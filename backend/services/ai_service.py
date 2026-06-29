"""
services/ai_service.py
----------------------
AI response generation for the full legal pipeline.
Uses Ollama (llama3.2) via services/llm.py.
"""
from services.llm import ask_llm


def _build_prompt(query, category, keywords, legal_info, evidence, authority, confidence):
    laws   = legal_info.get("laws", [])
    rights = legal_info.get("fundamental_rights", [])
    steps  = legal_info.get("steps", [])

    primary     = authority.get("primary", "National Legal Services Authority")
    website     = authority.get("website", "nalsa.gov.in")
    helpline    = authority.get("helpline", "15100")
    description = authority.get("description", "")
    additional  = authority.get("additional", [])

    additional_str = "\n".join(f"- {a}" for a in additional) if additional else ""

    prompt = f"""\
User Situation:
{query}

Legal Context:
Category: {category}

Fundamental Rights:
{chr(10).join(f"- {r}" for r in rights)}

Applicable Laws:
{chr(10).join(f"- {law['name']}" for law in laws)}

Recommended Steps:
{chr(10).join(f"{i+1}. {s}" for i, s in enumerate(steps))}

Evidence to collect:
{chr(10).join(f"- {e}" for e in evidence)}

Authority to contact:
- {primary} ({website})
- Helpline: {helpline}
- {description}
{additional_str}

For the 📞 WHO TO CONTACT section, always include:
- Police: 100
- Emergency: 112
- Women Helpline: 1091
- NALSA (Free Legal Aid): 15100
- {primary}: {helpline}
{additional_str}

---

Provide a structured legal response using these headings exactly:

⚖️ SITUATION

🛡️ YOUR RIGHTS

📚 APPLICABLE LAWS

📝 WHAT TO DO

📂 EVIDENCE TO COLLECT

📞 WHO TO CONTACT

⚠️ IMPORTANT

Use modern Indian laws whenever applicable:
- Bharatiya Nyaya Sanhita (BNS)
- Bharatiya Nagarik Suraksha Sanhita (BNSS)
- Bharatiya Sakshya Adhiniyam (BSA)
- Constitution of India
- IT Act 2000
- Consumer Protection Act
- POSH Act
- Domestic Violence Act
- RTI Act
- Labour Laws

Never invent section numbers.

End with:

⚖️ This is general legal information and not a substitute for professional legal advice.\
"""

    return prompt


def generate_response(query, category, keywords, legal_info, evidence, authority, confidence):
    prompt = _build_prompt(
        query=query,
        category=category,
        keywords=keywords,
        legal_info=legal_info,
        evidence=evidence,
        authority=authority,
        confidence=confidence,
    )
    return ask_llm(prompt)