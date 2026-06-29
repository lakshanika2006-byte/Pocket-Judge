"""
services/authority_service.py
------------------------------
Returns the appropriate government authority and contact
information for a given legal category.
"""

import os
import json

AUTHORITY_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "legal_data", "authorities", "contacts.json"
)


def get_authority(category: str) -> dict:
    """
    Return authority contact information for a legal category.

    Returns:
        dict with primary authority, website, helpline, and additional contacts
    """
    try:
        with open(AUTHORITY_FILE, "r", encoding="utf-8") as f:
            authorities = json.load(f)

        return authorities.get(category, authorities.get("General", {}))

    except Exception:
        return {
            "primary":     "National Legal Services Authority",
            "website":     "nalsa.gov.in",
            "helpline":    "15100",
            "description": "Free legal aid for all citizens",
            "additional":  []
        }