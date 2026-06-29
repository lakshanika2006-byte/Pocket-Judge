"""
services/classification_service.py
-----------------------------------
Detects the legal category of a user's query by matching
keywords against the structured legal knowledge base.
"""

import os
import json
import re
from typing import Tuple

LAWS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "legal_data", "laws"
)

# Module-level cache: populated once on first call, reused for every
# subsequent request. Previously load_all_categories() re-read every JSON
# file from disk on every single API call — a hidden source of latency.
_categories_cache = None


def load_all_categories() -> list:
    global _categories_cache
    if _categories_cache is not None:
        return _categories_cache

    categories = []
    if not os.path.exists(LAWS_DIR):
        print(f"WARNING: Laws directory not found at {LAWS_DIR}")
        _categories_cache = categories
        return categories

    for filename in os.listdir(LAWS_DIR):
        if filename.endswith(".json"):
            filepath = os.path.join(LAWS_DIR, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    categories.append(data)
            except Exception as e:
                print(f"WARNING: Could not load {filename}: {e}")
                continue

    _categories_cache = categories
    return categories


def classify_query(query: str) -> Tuple[str, float, list]:
    """
    Match user query against all legal categories.
    Uses word-boundary matching for accuracy.

    Returns:
        category (str)       — best matched category
        confidence (float)   — 0.0 to 1.0
        matched_keywords (list) — which keywords triggered
    """
    query_lower = query.lower()
    categories  = load_all_categories()

    best_category  = "General"
    best_score     = 0
    best_keywords  = []
    best_total_kw  = 1

    for cat in categories:
        keywords = cat.get("keywords", [])
        matched  = []

        for kw in keywords:
            # Match whole words or phrases
            pattern = r'\b' + re.escape(kw) + r'\b'
            if re.search(pattern, query_lower):
                matched.append(kw)

        score = len(matched)

        if score > best_score:
            best_score     = score
            best_category  = cat.get("category", "General")
            best_keywords  = matched
            best_total_kw  = len(keywords)

    # Confidence: matched / total keywords in winning category
    if best_score == 0:
        confidence = 0.0
    else:
        confidence = min(round((best_score / best_total_kw) * 10, 2), 1.0)

    return best_category, confidence, best_keywords
