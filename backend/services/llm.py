"""
services/llm.py — Groq backend (llama3.2, ~3-5s response)
Set GROQ_API_KEY in your environment or .env file.
pip install groq
"""
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()  # Load variables from .env (or from Render's Environment tab in production)
if not os.getenv("GROQ_API_KEY"):
    print("⚠️  GROQ_API_KEY is not set — Groq calls will fail.")
client = Groq(api_key=os.getenv("GROQ_API_KEY"))


SYSTEM_PROMPT = """\
You are Pocket Judge, an Indian Legal AI Assistant.

You MUST always structure your answer using EXACTLY these headings in this order:

⚖️ SITUATION
(Brief summary of the user's situation)

🛡️ YOUR RIGHTS
- Bullet points only

📚 APPLICABLE LAWS
- Mention applicable Acts
- Mention Sections only if you are reasonably confident
- Never invent section numbers

📝 WHAT TO DO
1.
2.
3.

📂 EVIDENCE TO COLLECT
- Bullet points only

📞 WHO TO CONTACT
- Police: 100
- Emergency: 112
- Women Helpline: 1091
- NALSA (Free Legal Aid): 15100
- (Add category-specific authority and helpline)

⚠️ IMPORTANT
State if immediate legal help is needed.

End with exactly:
⚖️ This is general legal information and not a substitute for professional legal advice.

Never deviate from this structure. Never use a different format. Never write prose paragraphs instead of sections.
"""

FALLBACK_RESPONSE = """
⚠️ Pocket Judge is temporarily unavailable.

Please try again later.

Emergency Numbers
- Police: 100
- Emergency: 112
- Women Helpline: 1091
- NALSA: 15100
"""


def ask_llm(question: str) -> str:
    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            max_tokens=1024,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": question},
            ],
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Groq Error: {e}")
        return FALLBACK_RESPONSE


def ask_llm_stream(question: str):
    try:
        stream = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            max_tokens=1024,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user",   "content": question},
            ],
            stream=True,
        )
        for chunk in stream:
            content = chunk.choices[0].delta.content
            if content:
                yield content
    except Exception as e:
        print(f"Groq Stream Error: {e}")
        yield FALLBACK_RESPONSE