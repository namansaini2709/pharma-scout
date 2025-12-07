from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from models import JobRequest, JobResult, ScoreCard, Narrative, AgentSummary
from agents.clinical_trials import fetch_clinical_trials
from agents.literature import fetch_literature
from agents.search_scout import fetch_market_data, fetch_ip_data
from llm_engine import generate_narrative_with_llm
from database import get_db, create_db_tables, User, Report # New imports
from auth import get_password_hash, verify_password, create_access_token, get_current_user # New imports
import uuid
import random
import asyncio
import json
from datetime import datetime, timedelta # Updated import
import os
from typing import List # ADDED THIS LINE

app = FastAPI()

# --- CORS Configuration ---
origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database Initialization (Run once on startup) ---
@app.on_event("startup")
def on_startup():
    create_db_tables()
    # Set a default SECRET_KEY if not already set (for dev convenience)
    if not os.getenv("SECRET_KEY"):
        os.environ["SECRET_KEY"] = "your-super-secret-key" # Dev default
        print("WARNING: SECRET_KEY not set. Using default. Set for production!")

# --- Mock Logic for Supply Agent (Placeholder) ---
def get_mock_supply_data(query):
    return {
        "score": random.randint(60, 90),
        "summary": "Supply chain appears stable.",
        "findings": ["Multiple GMP suppliers available.", "No major geopolitical risks."]
    }

# --- Auth Endpoints ---
@app.post("/register", response_model=dict)
async def register_user(email: str, password: str, first_name: str = None, last_name: str = None, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(password)
    new_user = User(email=email, hashed_password=hashed_password, first_name=first_name, last_name=last_name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

@app.post("/token", response_model=dict)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30) # From auth.py
    # Include name in the token payload for easy frontend access if we wanted, 
    # but fetching from /users/me is safer/cleaner.
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=dict)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return {
        "email": current_user.email, 
        "id": current_user.id, 
        "first_name": current_user.first_name, 
        "last_name": current_user.last_name
    }

# --- Main Evaluation Endpoint ---
@app.post("/evaluate", response_model=JobResult)
async def evaluate_job(
    job: JobRequest, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user) # Now requires authentication
):
    query = job.query
    
    # 1. Run All Agents Concurrently
    clinical_task = fetch_clinical_trials(query)
    literature_task = fetch_literature(query)
    market_task = fetch_market_data(query)
    ip_task = fetch_ip_data(query)
    
    clinical_data, literature_data, market_data, ip_data = await asyncio.gather(
        clinical_task, literature_task, market_task, ip_task
    )
    
    supply_data = get_mock_supply_data(query)

    # 2. Score Calculation
    real_clinical_score = clinical_data["score"] if clinical_data["status"] != "failed" else 0
    real_literature_score = literature_data["score"] if literature_data["status"] != "failed" else 0

    scientific_fit_score = int((real_clinical_score + real_literature_score) / 2)
    if clinical_data["status"] == "failed" and literature_data["status"] == "failed":
        scientific_fit_score = 50

    comm_score = market_data["score"]
    ip_risk = ip_data["score"]
    supply_score = supply_data["score"]

    overall = int((scientific_fit_score * 0.35) + (comm_score * 0.30) + ((100 - ip_risk) * 0.20) + (supply_score * 0.15))

    # 3. LLM Narrative Generation
    llm_output_json = generate_narrative_with_llm(query, clinical_data, literature_data, market_data, ip_data)
    
    narrative = None
    if llm_output_json:
        try:
            llm_narrative = json.loads(llm_output_json)
            narrative = Narrative(
                summary=llm_narrative["summary"],
                recommendation=llm_narrative["recommendation"],
                rationale=llm_narrative["rationale"],
                risks=llm_narrative["risks"],
                next_steps=llm_narrative["next_steps"]
            )
        except json.JSONDecodeError as e:
            print(f"LLM JSON Decode Error: {e}")
            narrative = get_fallback_narrative(query, overall, clinical_data, market_data, ip_data, supply_data)
    
    if not narrative: # If LLM failed or no key
        narrative = get_fallback_narrative(query, overall, clinical_data, market_data, ip_data, supply_data)


    # Construct JobResult
    job_result = JobResult(
        job_id=str(uuid.uuid4()),
        query=query,
        status="completed",
        scores=ScoreCard(
            scientific_fit=scientific_fit_score,
            commercial_potential=comm_score,
            ip_risk=ip_risk,
            supply_feasibility=supply_score,
            overall_score=overall
        ),
        narrative=narrative,
        agent_details=[
            AgentSummary(agent_name="Clinical Trials Agent (LIVE)", status=clinical_data["status"], summary=clinical_data["summary"], key_findings=clinical_data["findings"]),
            AgentSummary(agent_name="Literature Agent (LIVE)", status=literature_data["status"], summary=literature_data["summary"], key_findings=literature_data["findings"]),
            AgentSummary(agent_name="Market Scout (WEB SEARCH)", status="completed", summary=market_data["summary"], key_findings=market_data["findings"]),
            AgentSummary(agent_name="IP Guardian (WEB SEARCH)", status="completed", summary=ip_data["summary"], key_findings=ip_data["findings"]),
            AgentSummary(agent_name="Supply Agent (MOCK)", status="completed", summary=supply_data["summary"], key_findings=supply_data["findings"]),
        ]
    )

    # 4. Save Report to DB
    new_report = Report(
        user_id=current_user.id,
        query=query,
        job_id=job_result.job_id,
        full_report_data=job_result.model_dump_json() # Use model_dump_json() for Pydantic V2
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    return job_result

def get_fallback_narrative(query, overall, clinical_data, market_data, ip_data, supply_data):
    rec = "GO" if overall > 75 else "NO_GO" if overall < 40 else "NEEDS_MORE_DATA"
    return Narrative(
        summary=f"Analysis driven by live data. Clinical status: {clinical_data['status']}. Market indicators found via web search.",
        recommendation=rec,
        rationale={
            "scientific": clinical_data["summary"],
            "commercial": market_data["summary"],
            "ip": ip_data["summary"],
            "supply": supply_data["summary"]
        },
        risks=[
            f"Insufficient LLM API Key or LLM generation failed for {query}.",
            "Manual review of all web search findings is recommended.",
            "Potential data discrepancies between sources."
        ],
        next_steps=["Verify web search findings with paid databases.", "Consult regulatory expert."]
    )

# --- User's Reports Endpoint ---
@app.get("/users/me/reports", response_model=List[JobResult])
async def read_my_reports(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    reports = db.query(Report).filter(Report.user_id == current_user.id).all()
    # Convert stored JSON strings back to JobResult Pydantic models
    return [JobResult.model_validate_json(r.full_report_data) for r in reports]