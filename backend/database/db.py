"""
database/db.py
--------------
SQLite database setup using SQLAlchemy ORM.
To migrate to PostgreSQL later: change DATABASE_URL only.
"""

import os
from datetime import datetime
from sqlalchemy import (
    create_engine, Column, Integer, String,
    Text, DateTime, Float, ForeignKey, Boolean
)
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

# ── Database location ──────────────────────────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"sqlite:///{os.path.join(BASE_DIR, 'pocket_judge.db')}",
)

# ── Engine and session ─────────────────────────────────────────────────────────
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # needed for SQLite only
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ══════════════════════════════════════════════════════════════════════════════
# MODELS
# ══════════════════════════════════════════════════════════════════════════════

class Query(Base):
    """
    Every legal question asked by a user is stored here.
    Tracks what category was detected, what the AI responded,
    and how confident the classification was.
    """
    __tablename__ = "queries"

    id              = Column(Integer, primary_key=True, index=True)
    session_id      = Column(String(64), index=True, nullable=True)
    user_query      = Column(Text, nullable=False)
    category        = Column(String(100), nullable=True)
    keywords        = Column(Text, nullable=True)        # stored as comma-separated
    response        = Column(Text, nullable=True)
    confidence      = Column(Float, default=0.0)
    processing_ms   = Column(Integer, default=0)
    created_at      = Column(DateTime, default=datetime.utcnow)

    # one query can have many evidence items
    evidence_items  = relationship("Evidence", back_populates="query")


class Evidence(Base):
    """
    Files uploaded as evidence — images, PDFs, screenshots.
    Linked to a query if the user uploads while asking a question.
    """
    __tablename__ = "evidence"

    id              = Column(Integer, primary_key=True, index=True)
    query_id        = Column(Integer, ForeignKey("queries.id"), nullable=True)
    filename        = Column(String(255), nullable=False)
    original_name   = Column(String(255), nullable=False)
    file_type       = Column(String(50), nullable=True)
    file_size_kb    = Column(Integer, default=0)
    ocr_text        = Column(Text, nullable=True)        # extracted text from OCR
    ocr_summary     = Column(Text, nullable=True)        # AI summary of document
    legal_relevance = Column(Text, nullable=True)        # what law this relates to
    uploaded_at     = Column(DateTime, default=datetime.utcnow)

    query           = relationship("Query", back_populates="evidence_items")


class Complaint(Base):
    """
    Generated complaint drafts — police complaints, RTI applications,
    legal notices, consumer complaints.
    """
    __tablename__ = "complaints"

    id                  = Column(Integer, primary_key=True, index=True)
    query_id            = Column(Integer, ForeignKey("queries.id"), nullable=True)
    complaint_type      = Column(String(100), nullable=False)   # police / consumer / RTI
    complainant_name    = Column(String(255), nullable=True)
    incident_date       = Column(String(100), nullable=True)
    incident_location   = Column(String(255), nullable=True)
    description         = Column(Text, nullable=True)
    generated_draft     = Column(Text, nullable=True)
    created_at          = Column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    """
    Tracks every API call for debugging and analytics.
    Helps understand what questions users ask most.
    """
    __tablename__ = "audit_logs"

    id          = Column(Integer, primary_key=True, index=True)
    endpoint    = Column(String(200), nullable=False)
    method      = Column(String(10), nullable=False)
    status_code = Column(Integer, nullable=True)
    duration_ms = Column(Integer, default=0)
    error       = Column(Text, nullable=True)
    created_at  = Column(DateTime, default=datetime.utcnow)


class LegalCategory(Base):
    """
    Tracks which legal categories are queried most often.
    Useful for future analytics dashboard.
    """
    __tablename__ = "legal_categories"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(100), unique=True, nullable=False)
    query_count = Column(Integer, default=0)
    last_used   = Column(DateTime, default=datetime.utcnow)


# ══════════════════════════════════════════════════════════════════════════════
# HELPERS
# ══════════════════════════════════════════════════════════════════════════════

def get_db():
    """FastAPI dependency — yields a database session, always closes it."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables. Called once on app startup."""
    Base.metadata.create_all(bind=engine)
    _seed_categories()


def _seed_categories():
    """Insert default legal categories if they don't exist yet."""
    db = SessionLocal()
    categories = [
        "Employment", "Cyber Crime", "Property & Housing",
        "Domestic Violence", "Consumer Rights", "Criminal",
        "Family Law", "RTI", "Education", "General"
    ]
    try:
        for name in categories:
            exists = db.query(LegalCategory).filter_by(name=name).first()
            if not exists:
                db.add(LegalCategory(name=name))
        db.commit()
    finally:
        db.close()