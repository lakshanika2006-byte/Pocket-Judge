"""
main.py
-------
The Pocket Judge — FastAPI Application Entry Point
Initialises the database, registers the legal-pipeline routes, serves the
frontend single-page app, and configures middleware.
"""

import os
import time
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from database.db import init_db, SessionLocal, AuditLog
from routes.legal import router as legal_router
from routes.evidence import router as evidence_router
from routes.articles import router as articles_router
from services.llm import ask_llm


# ── Lifespan (replaces deprecated @app.on_event) ───────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print("✅ Pocket Judge database initialised")
    print("✅ Legal knowledge base loaded")
    print("✅ API ready")
    yield
    # Shutdown logic (if any) goes here


app = FastAPI(
    title="The Pocket Judge API",
    description="AI-powered legal assistance based on Indian law, powered by Groq "
                 "(Llama 3.1 8B Instant).",
    version="2.1.0",
    lifespan=lifespan,
)

# ── CORS ────────────────────────────────────────────────────────────────────────
# ALLOWED_ORIGINS defaults to "*" so nothing breaks if you don't set it.
# In production, set it on Render to your Vercel URL(s), comma-separated, e.g.:
#   ALLOWED_ORIGINS=https://my-project.vercel.app,https://my-project-git-main.vercel.app
_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
ALLOWED_ORIGINS = [o.strip() for o in _origins_env.split(",")] if _origins_env != "*" else ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Audit logging middleware ────────────────────────────────────────────────────
@app.middleware("http")
async def audit_middleware(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration_ms = int((time.time() - start) * 1000)

    db = None
    try:
        db = SessionLocal()
        db.add(AuditLog(
            endpoint=str(request.url.path),
            method=request.method,
            status_code=response.status_code,
            duration_ms=duration_ms,
        ))
        db.commit()
    except Exception:
        pass
    finally:
        if db is not None:
            db.close()

    return response


# ── Health check ────────────────────────────────────────────────────────────────
# Moved off "/" so the frontend (mounted below) can be served at the root.
@app.get("/api/health")
def health():
    return {
        "status": "running",
        "app": "The Pocket Judge",
        "version": "2.1.0",
        "ai_backend": "Groq (llama-3.1-8b-instant)",
    }

# ── /api/ask  (simple JSON in / JSON out — raw LLM call, no legal pipeline) ────
class AskRequest(BaseModel):
    query: str


@app.post("/api/ask")
def ask(data: AskRequest):
    """
    Lightweight legal-question endpoint: sends the question straight to
    Groq with only the base system prompt. No classification, no
    knowledge-base grounding, no DB logging. Kept for quick manual testing
    via /docs — the frontend itself calls /api/legal/ask (the full
    pipeline) so answers are grounded in the curated Indian law data.
    POST { "query": "any legal question" }
    Returns { "answer": "AI generated legal explanation" }
    """
    query = (data.query or "").strip()
    if not query:
        return {"answer": "Please describe your situation so I can help."}
    answer = ask_llm(query)
    return {"answer": answer}


# ── Routers (full pipeline: classify → knowledge base → AI) ────────────────────
# Provides /api/legal/ask (used by the frontend), /api/ask-ai, /api/upload,
# /api/evidence/*, /api/articles/*. Registered before the static mount below
# so they always take priority over it.
app.include_router(legal_router)
app.include_router(evidence_router)
app.include_router(articles_router)


# ── Frontend (single-page app) ──────────────────────────────────────────────────
# Mounted last, at "/", so it never shadows the /api/* routes above (FastAPI/
# Starlette match routes in registration order). This means running
#   uvicorn main:app --reload
# and opening http://127.0.0.1:8000/ now serves the actual Pocket Judge UI
# directly — no separate dev server needed. It also matters for voice
# search: browsers only allow microphone access on a "secure context"
# (https, or http://localhost) — opening index.html via file:// silently
# blocks the mic, while serving it from here does not.
FRONTEND_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "frontend",
)

if os.path.isdir(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
else:
    print(f"⚠️  Frontend folder not found at {FRONTEND_DIR} — API will run without serving the UI.")
