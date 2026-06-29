"""
services/evidence_service.py
-----------------------------
Returns evidence checklists for each legal category.
Tells users exactly what to collect and preserve.
"""

import os
import json

EVIDENCE_FILE = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "legal_data", "evidence", "checklist.json"
)


def get_evidence_checklist(category: str) -> list[str]:
    """
    Return the evidence checklist for a given legal category.

    Returns:
        List of evidence items the user should collect
    """
    try:
        with open(EVIDENCE_FILE, "r", encoding="utf-8") as f:
            checklists = json.load(f)

        return checklists.get(category, checklists.get("General", []))

    except Exception:
        return [
            "Document all incidents with dates and times",
            "Collect any written communication related to the issue",
            "Note names and contact details of witnesses",
            "Keep copies of all official documents"
        ]