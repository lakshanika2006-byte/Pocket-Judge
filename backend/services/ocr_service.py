"""
services/ocr_service.py
------------------------
Extracts text from uploaded evidence files.
Supports: images (JPG, PNG), PDFs.
Requires: tesseract installed on system.
"""

import os

try:
    from PIL import Image
    import pytesseract
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False

try:
    from pypdf import PdfReader
    PYPDF_AVAILABLE = True
except ImportError:
    PYPDF_AVAILABLE = False

def extract_text(filepath: str) -> dict:
    """
    Extract text from image or PDF file.

    Returns:
        dict with extracted_text, page_count, method used
    """
    ext = os.path.splitext(filepath)[1].lower()

    if ext in [".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"]:
        return _extract_from_image(filepath)

    elif ext == ".pdf":
        return _extract_from_pdf(filepath)

    else:
        return {
            "extracted_text": "",
            "page_count":     0,
            "method":         "unsupported",
            "error":          f"File type {ext} is not supported for text extraction"
        }


def _extract_from_image(filepath: str) -> dict:
    """Use Tesseract OCR to extract text from image."""
    try:
        image = Image.open(filepath)
        text  = pytesseract.image_to_string(image, lang="eng")

        return {
            "extracted_text": text.strip(),
            "page_count":     1,
            "method":         "tesseract_ocr",
            "error":          None
        }
    except Exception as e:
        return {
            "extracted_text": "",
            "page_count":     0,
            "method":         "tesseract_ocr",
            "error":          str(e)
        }


def _extract_from_pdf(filepath: str) -> dict:
    """Extract text from PDF using pypdf."""
    try:
        reader     = PdfReader(filepath)
        pages      = []

        for page in reader.pages:
            text = page.extract_text()
            if text:
                pages.append(text.strip())

        full_text = "\n\n".join(pages)

        return {
            "extracted_text": full_text,
            "page_count":     len(reader.pages),
            "method":         "pypdf",
            "error":          None
        }
    except Exception as e:
        return {
            "extracted_text": "",
            "page_count":     0,
            "method":         "pypdf",
            "error":          str(e)
        }


def summarise_evidence(text: str, category: str) -> str:
    """
    Produce a brief summary of what the evidence document contains
    and what legal relevance it might have.
    """
    if not text or len(text.strip()) < 20:
        return "No readable text could be extracted from this document."

    word_count = len(text.split())
    preview    = text[:300].replace("\n", " ").strip()

    return (
        f"Document contains approximately {word_count} words. "
        f"Preview: {preview}... "
        f"This document may be relevant to your {category} matter."
    )