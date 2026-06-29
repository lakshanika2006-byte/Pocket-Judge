"""
services/legal_service.py
--------------------------
Loads structured legal knowledge for a given category.
Returns laws, fundamental rights, and action steps.

The category → file map is built automatically by reading the "category"
field out of every JSON file in legal_data/laws/, the same way
classification_service.load_all_categories() does. This is deliberate:
a hardcoded dict here previously went stale and silently dropped 4 of the
9 categories (Criminal, Family Law, RTI, Education), which meant queries
in those categories were classified correctly but then served only the
generic "Constitution of India" fallback instead of their real legal
data. Auto-discovery means adding a new legal_data/laws/*.json file is
enough to wire a new category in everywhere — no second list to remember
to update.
"""

import os
import json

LAWS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "legal_data", "laws"
)

_category_file_cache = None


def _build_category_file_map() -> dict:
    """
    Scan every *.json file in legal_data/laws/ once and map its declared
    "category" field to its filename. Cached after first build; restart
    the server if you add a new law file while it's running.
    """
    global _category_file_cache
    if _category_file_cache is not None:
        return _category_file_cache

    mapping = {}
    if not os.path.exists(LAWS_DIR):
        print(f"WARNING: Laws directory not found at {LAWS_DIR}")
        _category_file_cache = mapping
        return mapping

    for filename in os.listdir(LAWS_DIR):
        if not filename.endswith(".json"):
            continue
        filepath = os.path.join(LAWS_DIR, filename)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                data = json.load(f)
            category = data.get("category")
            if category:
                mapping[category] = filename
        except Exception as e:
            print(f"WARNING: Could not load {filename}: {e}")
            continue

    _category_file_cache = mapping
    return mapping


def get_legal_info(category: str) -> dict:
    """
    Load full legal data for the given category.

    Returns dict with:
        laws             — list of applicable laws
        fundamental_rights — constitutional protections
        steps            — recommended action steps
    """
    filename = _build_category_file_map().get(category)

    if not filename:
        return _general_response()

    filepath = os.path.join(LAWS_DIR, filename)

    if not os.path.exists(filepath):
        return _general_response()

    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        return {
            "laws":               data.get("laws", []),
            "fundamental_rights": data.get("fundamental_rights", []),
            "steps":              data.get("steps", []),
            "category":           category
        }

    except Exception:
        return _general_response()


def _general_response() -> dict:
    return {
        "laws": [
            {
                "name": "Constitution of India",
                "sections": ["Article 21", "Article 14", "Article 32"],
                "summary": "Every citizen has the right to life, equality, and constitutional remedies.",
                "remedy": "Approach the National Legal Services Authority for free guidance"
            }
        ],
        "fundamental_rights": [
            "Article 21 — Right to Life and Personal Liberty",
            "Article 14 — Right to Equality before Law",
            "Article 32 — Right to Constitutional Remedies"
        ],
        "steps": [
            "Document all incidents with dates, times, and witnesses",
            "Consult a lawyer at your District Legal Services Authority for free advice",
            "Contact NALSA helpline: 15100"
        ],
        "category": "General"
    }