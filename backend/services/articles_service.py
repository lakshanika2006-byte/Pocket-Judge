"""
services/articles_service.py
-----------------------------
Loads and queries the Constitutional Articles knowledge base
(legal_data/constitution/articles.json).
"""

import os
import json
import re
from typing import Optional

ARTICLES_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "legal_data", "constitution", "articles.json"
)

_cache = None


def load_all_articles() -> list:
    """Load all articles from disk, cached in memory after first read."""
    global _cache
    if _cache is not None:
        return _cache

    if not os.path.exists(ARTICLES_FILE):
        print(f"WARNING: Articles file not found at {ARTICLES_FILE}")
        _cache = []
        return _cache

    try:
        with open(ARTICLES_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
        _cache = data.get("articles", [])
    except Exception as e:
        print(f"WARNING: Could not load articles.json: {e}")
        _cache = []

    return _cache


def list_articles_summary() -> list:
    """Lightweight list for an index view: number + title + one-line description."""
    return [
        {
            "article": a["article"],
            "title": a["title"],
            "description": a["description"]
        }
        for a in load_all_articles()
    ]


def get_article_by_number(number: str) -> Optional[dict]:
    """Exact lookup by article number, e.g. '21' or '21A' (case-insensitive)."""
    number = number.strip().upper().replace("ARTICLE", "").strip()
    for a in load_all_articles():
        if a["article"].upper() == number:
            return a
    return None


def detect_article_number(query: str) -> Optional[str]:
    """
    Detect an explicit article reference in free text, e.g.
    'What is Article 21?' or 'article21a' -> '21A'.
    Returns the matched article number string, or None.
    """
    match = re.search(r'\barticle\s*-?\s*(\d{1,3}[a-zA-Z]?)\b', query, re.IGNORECASE)
    if match:
        return match.group(1).upper()
    return None


def search_articles_by_keyword(query: str, top_k: int = 3) -> list:
    """
    Simple keyword-overlap search across keywords + synonyms + title.
    This is a placeholder — replaced by the hybrid TF-IDF/RapidFuzz
    matching engine in Milestone 3.
    """
    query_lower = query.lower()
    scored = []

    for a in load_all_articles():
        haystack = a["keywords"] + a["synonyms"] + [a["title"]]
        score = sum(1 for term in haystack if term.lower() in query_lower)
        if score > 0:
            scored.append((score, a))

    scored.sort(key=lambda x: x[0], reverse=True)
    return [a for _, a in scored[:top_k]]