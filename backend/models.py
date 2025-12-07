from pydantic import BaseModel
from typing import List, Optional, Dict

# --- Input Model ---
class JobRequest(BaseModel):
    query: str

# --- Output Models ---

class ScoreCard(BaseModel):
    scientific_fit: int
    commercial_potential: int
    ip_risk: int
    supply_feasibility: int
    overall_score: int

class AgentSummary(BaseModel):
    agent_name: str
    status: str # "completed", "processing"
    summary: str
    key_findings: List[str]

class Narrative(BaseModel):
    summary: str
    recommendation: str # "GO", "NO_GO", "NEEDS_DATA"
    rationale: Dict[str, str] # { "scientific": "...", "commercial": "..." }
    risks: List[str]
    next_steps: List[str]

class JobResult(BaseModel):
    job_id: str
    query: str
    status: str # "completed"
    scores: ScoreCard
    narrative: Narrative
    agent_details: List[AgentSummary]
