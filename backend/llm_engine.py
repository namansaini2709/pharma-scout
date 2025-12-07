import google.generativeai as genai
import os

# Configure your API key here or via Environment Variable
# For this demo, we check the environment.
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

def generate_narrative_with_llm(query: str, clinical_data, literature_data, market_data, ip_data):
    """
    Uses Gemini 1.5 Flash to synthesize a board-ready executive summary.
    """
    if not GOOGLE_API_KEY:
        # Fallback if no key is present
        return None 

    # Construct the Prompt
    prompt = f"""
    You are a Pharma Strategy Consultant. Write a Due Diligence Executive Summary for the drug/target: "{query}".
    
    Use the following intelligence reports:
    
    1. CLINICAL TRIALS:
    {clinical_data['summary']}
    Findings: {clinical_data['findings']}
    
    2. LITERATURE:
    {literature_data['summary']}
    Findings: {literature_data['findings']}
    
    3. MARKET DATA:
    {market_data['summary']}
    Findings: {market_data['findings']}
    
    4. IP/PATENTS:
    {ip_data['summary']}
    Findings: {ip_data['findings']}
    
    OUTPUT FORMAT (JSON):
    {{
      "summary": "2-3 sentence high-level overview.",
      "recommendation": "GO, NO_GO, or NEEDS_DATA",
      "rationale": {{
        "scientific": "1 sentence synthesis of clinical/lit.",
        "commercial": "1 sentence synthesis of market.",
        "ip": "1 sentence synthesis of IP.",
        "supply": "Note on supply chain (infer from context or generic)."
      }},
      "risks": ["Risk 1", "Risk 2", "Risk 3"],
      "next_steps": ["Step 1", "Step 2", "Step 3"]
    }}
    """
    
    try:
        model = genai.GenerativeModel('gemini-2.5-flash') # Updated based on available models
        response = model.generate_content(prompt)
        # Clean the response to ensure valid JSON (remove markdown fences if any)
        text = response.text.replace("```json", "").replace("```", "").strip()
        return text
    except Exception as e:
        print(f"LLM Generation Error: {e}")
        return None
