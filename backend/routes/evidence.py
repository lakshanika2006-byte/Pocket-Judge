import os
import uuid
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db, Evidence as EvidenceModel
from services.ocr_service import extract_text, summarise_evidence
from services.classification_service import classify_query

router = APIRouter()

UPLOAD_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
    "uploads"
)

ALLOWED_TYPES = {
    "image/jpeg", "image/png", "image/bmp", "image/tiff",
    "application/pdf", "image/webp"
}

MAX_SIZE_MB = 10


@router.post("/api/upload")
async def upload_evidence(
    file:     UploadFile = File(...),
    db:       Session    = Depends(get_db)
):
    """
    Upload evidence file.
    1. Validate file type and size
    2. Save to uploads folder with unique name
    3. Run OCR / text extraction
    4. Classify what legal category it may relate to
    5. Save record to database
    6. Return extracted text and summary
    """

    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file.content_type} is not supported. "
                   f"Upload images (JPG, PNG) or PDFs only."
        )

    # Read and validate size
    content = await file.read()
    size_mb = len(content) / (1024 * 1024)

    if size_mb > MAX_SIZE_MB:
        raise HTTPException(
            status_code=400,
            detail=f"File too large ({size_mb:.1f} MB). Maximum size is {MAX_SIZE_MB} MB."
        )

    # Create unique filename
    ext           = os.path.splitext(file.filename)[1].lower()
    unique_name   = f"{uuid.uuid4().hex}{ext}"
    save_path     = os.path.join(UPLOAD_DIR, unique_name)

    # Ensure uploads folder exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Save file
    with open(save_path, "wb") as f:
        f.write(content)

    # Run OCR
    ocr_result  = extract_text(save_path)
    extracted   = ocr_result.get("extracted_text", "")

    # Classify the content
    category    = "General"
    if extracted:
        category, _, _ = classify_query(extracted)

    # Summarise
    summary = summarise_evidence(extracted, category)

    # Save to database
    record = EvidenceModel(
        filename        = unique_name,
        original_name   = file.filename,
        file_type       = file.content_type,
        file_size_kb    = int(len(content) / 1024),
        ocr_text        = extracted[:5000] if extracted else None,
        ocr_summary     = summary,
        legal_relevance = category
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id":             record.id,
        "filename":       unique_name,
        "original_name":  file.filename,
        "file_type":      file.content_type,
        "size_kb":        record.file_size_kb,
        "extracted_text": extracted[:1000] if extracted else "",
        "summary":        summary,
        "category":       category,
        "pages":          ocr_result.get("page_count", 0),
        "ocr_method":     ocr_result.get("method", ""),
        "message":        "Evidence uploaded and analysed successfully"
    }


@router.get("/api/evidence/{evidence_id}")
def get_evidence(evidence_id: int, db: Session = Depends(get_db)):
    """Retrieve a specific evidence record by ID."""
    record = db.query(EvidenceModel).filter(EvidenceModel.id == evidence_id).first()

    if not record:
        raise HTTPException(status_code=404, detail="Evidence not found")

    return {
        "id":             record.id,
        "original_name":  record.original_name,
        "file_type":      record.file_type,
        "size_kb":        record.file_size_kb,
        "ocr_text":       record.ocr_text,
        "summary":        record.ocr_summary,
        "category":       record.legal_relevance,
        "uploaded_at":    record.uploaded_at.isoformat()
    }
