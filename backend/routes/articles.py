from fastapi import APIRouter, HTTPException, Query
from services.articles_service import (
    list_articles_summary,
    get_article_by_number,
    detect_article_number,
    search_articles_by_keyword,
)

router = APIRouter(prefix="/api/articles", tags=["Articles"])


@router.get("")
def list_articles():
    """List all Fundamental Rights articles (number + title + short description)."""
    return {"articles": list_articles_summary()}


@router.get("/search")
def search_articles(q: str = Query(..., min_length=2)):
    """
    Search articles by free text. If an explicit article number is
    detected in the query (e.g. 'What is Article 21?'), that exact
    article is returned first.
    """
    number = detect_article_number(q)
    if number:
        exact = get_article_by_number(number)
        if exact:
            return {"match_type": "exact", "results": [exact]}

    results = search_articles_by_keyword(q)
    return {"match_type": "keyword", "results": results}


@router.get("/{number}")
def get_article(number: str):
    """Get full detail for a single article by number, e.g. /api/articles/21 or /api/articles/21A."""
    article = get_article_by_number(number)
    if not article:
        raise HTTPException(status_code=404, detail=f"Article {number} not found")
    return article
