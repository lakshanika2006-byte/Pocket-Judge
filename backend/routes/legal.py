import time
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.db import get_db, Query as QueryModel, LegalCategory
from services.classification_service import classify_query
from services.keyword_service import extract_keywords
from services.legal_service import get_legal_info
from services.evidence_service import get_evidence_checklist
from services.authority_service import get_authority
from services.ai_service import generate_response, _build_prompt
from services.llm import ask_llm, ask_llm_stream

router = APIRouter()


class LegalRequest(BaseModel):
    query:      str
    session_id: str = "anonymous"


class LegalResponse(BaseModel):
    response:           str
    category:           str
    keywords:           list
    confidence:         float
    evidence_checklist: list
    authority:          dict


@router.post("/api/legal/ask", response_model=LegalResponse)
def ask_legal_question(body: LegalRequest, db: Session = Depends(get_db)):
    """
    Full legal assistance pipeline:
    1. Classify the query
    2. Extract keywords
    3. Load legal knowledge
    4. Get evidence checklist
    5. Get authority contacts
    6. Generate structured AI response
    7. Save to database
    """
    start_time = time.time()

    # Step 1: Classify
    category, confidence, matched_kw = classify_query(body.query)

    # Step 2: Keywords
    keywords = extract_keywords(body.query)

    # Step 3: Legal knowledge
    legal_info = get_legal_info(category)

    # Step 4: Evidence checklist
    evidence = get_evidence_checklist(category)

    # Step 5: Authority
    authority = get_authority(category)

    # Step 6: Generate AI response
    response_text = generate_response(
        query=body.query,
        category=category,
        keywords=keywords,
        legal_info=legal_info,
        evidence=evidence,
        authority=authority,
        confidence=confidence,
    )

    # Step 7: Persist to database
    duration_ms = int((time.time() - start_time) * 1000)

    db_query = QueryModel(
        session_id=body.session_id,
        user_query=body.query,
        category=category,
        keywords=", ".join(keywords),
        response=response_text,
        confidence=confidence,
        processing_ms=duration_ms,
    )
    db.add(db_query)

    cat_record = db.query(LegalCategory).filter_by(name=category).first()
    if cat_record:
        cat_record.query_count += 1

    db.commit()

    return LegalResponse(
        response=response_text,
        category=category,
        keywords=keywords,
        confidence=confidence,
        evidence_checklist=evidence,
        authority=authority,
    )


@router.post("/api/legal/ask/stream")
def ask_legal_question_stream(body: LegalRequest):
    """
    Streaming version of /api/legal/ask.
    Runs the same classification + knowledge-base pipeline, then streams
    the Ollama response token-by-token so the UI can display text live
    instead of waiting ~60 seconds for the full response.
    No DB write on this route (write happens on the non-streaming route).
    """
    category, confidence, matched_kw = classify_query(body.query)
    keywords   = extract_keywords(body.query)
    legal_info = get_legal_info(category)
    evidence   = get_evidence_checklist(category)
    authority  = get_authority(category)

    prompt = _build_prompt(
        query=body.query,
        category=category,
        keywords=keywords,
        legal_info=legal_info,
        evidence=evidence,
        authority=authority,
        confidence=confidence,
    )

    return StreamingResponse(
        ask_llm_stream(prompt),
        media_type="text/plain",
    )


# ── AI Direct Route ──────────────────────────────────────────────────────────
class AIRequest(BaseModel):
    query: str


@router.post("/api/ask-ai")
def ask_ai(body: AIRequest):
    """
    Direct LLM call — skips classification pipeline.
    Useful for raw AI responses without DB logging.
    """
    answer = ask_llm(body.query)
    return {"response": answer}
