from duckduckgo_search import DDGS
import asyncio

def perform_search(query: str, max_results=5):
    """
    Scrapes the open web using DuckDuckGo.
    """
    try:
        results = DDGS().text(query, max_results=max_results)
        return results if results else []
    except Exception as e:
        print(f"Search Error: {e}")
        return []

async def fetch_market_data(drug_name: str):
    """
    Searches for Market Size, Pricing, and Competitors.
    """
    queries = [
        f"{drug_name} market size 2024 2025",
        f"{drug_name} sales revenue 2023",
        f"{drug_name} price cost treatment"
    ]
    
    findings = []
    
    # We run these sequentially or parallel (sequential is safer for rate limits)
    for q in queries:
        results = perform_search(q, max_results=2)
        for r in results:
            findings.append(f"{r['title']}: {r['body']}")
            
    if not findings:
        return {
            "score": 0,
            "summary": "No market data found in public web search.",
            "findings": ["Web search returned zero results."],
            "status": "completed"
        }
        
    # Simple Heuristic Scoring based on keywords in snippets
    # (Real scoring happens in the LLM layer, here we just check for 'billion' or 'million')
    text_blob = " ".join(findings).lower()
    score = 50
    if "billion" in text_blob:
        score += 30
    elif "million" in text_blob:
        score += 10
        
    if "growing" in text_blob or "increase" in text_blob:
        score += 10
        
    return {
        "score": min(95, score),
        "summary": "Market intelligence gathered from open web.",
        "findings": findings[:5], # Top 5 snippets
        "status": "completed"
    }

async def fetch_ip_data(drug_name: str):
    """
    Searches for Patents and Expiry.
    """
    queries = [
        f"{drug_name} patent expiry date",
        f"{drug_name} generic entry date",
        f"{drug_name} patent litigation lawsuit"
    ]
    
    findings = []
    
    for q in queries:
        results = perform_search(q, max_results=2)
        for r in results:
            findings.append(f"{r['title']}: {r['body']}")
            
    if not findings:
        return {
            "score": 50, # Neutral risk
            "summary": "No specific patent data found.",
            "findings": ["Web search returned zero results."],
            "status": "completed"
        }

    # Inverse Scoring: We want LOW risk. 
    # If we see "expired" or "generic", risk is LOW (Good for generics, bad for originator).
    # Assuming user is an originator looking for opportunity: 
    # - If expired/generic available -> Bad opportunity (crowded) -> High Risk Score?
    # - Actually, for "Opportunity Score", if it's a generic opportunity, expired is GOOD.
    # Let's assume we are scoring "Commercial Opportunity". 
    # High IP Risk (bad) = Patent blocks us. 
    
    text_blob = " ".join(findings).lower()
    risk_score = 50
    
    if "expired" in text_blob or "generic available" in text_blob:
        risk_score = 20 # Low risk (open market)
    elif "patent protection" in text_blob or "exclusivity" in text_blob:
        risk_score = 80 # High risk (blocked)
        
    return {
        "score": risk_score,
        "summary": "Patent landscape scanned via web search.",
        "findings": findings[:5],
        "status": "completed"
    }
