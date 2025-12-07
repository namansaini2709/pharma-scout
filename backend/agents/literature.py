import httpx
import asyncio
import xml.etree.ElementTree as ET # For basic XML parsing if needed, though JSON is preferred
import json

NCBI_API_BASE = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/"
ESEARCH_URL = NCBI_API_BASE + "esearch.fcgi"
ESUMMARY_URL = NCBI_API_BASE + "esummary.fcgi"

async def fetch_literature(query: str):
    """
    Fetches real literature data from PubMed using NCBI E-utilities API.
    """
    headers = {
        "User-Agent": "PharmaScout/1.0 (Educational Project; contact@example.com)",
        "Accept": "application/json"
    }

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Step 1: Search for IDs
            esearch_params = {
                "db": "pubmed",
                "term": query,
                "retmax": 10, # Get top 10 relevant articles
                "retmode": "json"
            }
            esearch_response = await client.get(ESEARCH_URL, params=esearch_params, headers=headers)
            esearch_response.raise_for_status()
            esearch_data = esearch_response.json()

            id_list = esearch_data["esearchresult"]["idlist"]
            if not id_list:
                return {
                    "score": 0,
                    "summary": f"No recent scientific literature found for '{query}'.",
                    "findings": ["No relevant papers on PubMed."],
                    "status": "completed"
                }

            # Step 2: Fetch Summaries for these IDs
            esummary_params = {
                "db": "pubmed",
                "id": ",".join(id_list),
                "retmode": "json"
            }
            esummary_response = await client.get(ESUMMARY_URL, params=esummary_params, headers=headers)
            esummary_response.raise_for_status()
            esummary_data = esummary_response.json()
            
            return process_literature_data(esummary_data, query)

    except Exception as e:
        print(f"CRITICAL ERROR in Literature Agent: {e}")
        return {
            "score": 0,
            "summary": f"Failed to connect to PubMed: {str(e)[:100]}...",
            "findings": ["API Connection Error (PubMed)."],
            "status": "failed"
        }

def process_literature_data(data, query):
    articles = data.get("result", {}).get("uids", [])
    
    total_articles = 0
    recent_articles = 0 # e.g., in last 5 years
    key_findings = []

    # ESummary JSON structure is a bit complex, need to navigate
    # The actual article data is nested under 'result' and then by UID
    # 'result': {'uids': ['37265882', '37265551'], '37265882': {...}, '37265551': {...}}
    
    for uid in articles:
        article_data = data["result"][uid]
        total_articles += 1
        
        title = article_data.get("title", "No Title")
        pubdate = article_data.get("pubdate", "Unknown Date")
        
        key_findings.append(f"'{title}' ({pubdate})")

        # Simple recency check (placeholder, needs proper date parsing)
        if "202" in pubdate or "2024" in pubdate or "2023" in pubdate or "2022" in pubdate or "2021" in pubdate:
            recent_articles += 1
            
    # -- Scoring Logic for Literature --
    # Score based on number of articles and recency
    if total_articles == 0:
        score = 0
        summary = f"No scientific literature found for '{query}'."
    else:
        # 0-100 score: More articles, more recent articles = higher score
        base_score = min(100, total_articles * 5) # Max 20 articles gives 100
        recency_bonus = min(20, recent_articles * 10) # Max 2 recent articles gives 20
        score = min(100, base_score + recency_bonus)
        summary = f"Found {total_articles} relevant articles ({recent_articles} recent). Strong evidence base."
    
    return {
        "score": score,
        "summary": summary,
        "findings": key_findings[:5], # Limit findings to top 5
        "status": "completed"
    }
