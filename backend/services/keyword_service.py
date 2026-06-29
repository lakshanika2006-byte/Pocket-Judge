"""
services/keyword_service.py
----------------------------
Extracts meaningful legal keywords from the user's raw query.
Filters out common stop words and returns only significant terms.
"""

# Words that carry no legal meaning
STOP_WORDS = {
    "i", "me", "my", "myself", "we", "our", "you", "your", "he", "she",
    "it", "they", "them", "what", "which", "who", "is", "are", "was",
    "were", "be", "been", "being", "have", "has", "had", "do", "does",
    "did", "will", "would", "could", "should", "may", "might", "can",
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "by", "from", "up", "about", "into", "through", "not",
    "no", "so", "if", "as", "am", "this", "that", "these", "those",
    "there", "here", "how", "when", "where", "why", "please", "help",
    "want", "need", "get", "got", "go", "going", "come", "coming"
}


def extract_keywords(query: str) -> list[str]:
    """
    Extract meaningful legal keywords from raw user input.

    Returns:
        List of unique legal keywords, sorted by length (longer = more specific)
    """
    # Clean and split
    import re
    words = re.findall(r'\b[a-z]{3,}\b', query.lower())

    # Filter stop words
    keywords = [w for w in words if w not in STOP_WORDS]

    # Remove duplicates, keep order, sort by length descending
    seen = set()
    unique = []
    for kw in keywords:
        if kw not in seen:
            seen.add(kw)
            unique.append(kw)

    return sorted(unique, key=len, reverse=True)[:15]  # max 15 keywords