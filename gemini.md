This is basically an “AI research assistant” for pharma that takes a molecule or disease name and returns a full go / no-go report (science, market, patents, supply) in a few minutes instead of weeks. 

pharma scout copilot

I’ll first explain it in simple words, then give you a detailed spec you can paste into a CLI/codegen tool.

1. Simple explanation
Problem

Right now, if a pharma team wants to see if a molecule/disease is a good opportunity, they have to:

Read clinical trial PDFs

Check market demand reports

Look at patent/IP risk

Check supply chain and manufacturing feasibility

Read scientific literature

All this is in different systems and formats, so researchers waste days stitching info instead of making decisions. 

pharma scout copilot

Your product in one line

An AI copilot that, given a molecule or disease, automatically pulls signals from multiple sources (market, trials, patents, supply, literature), scores the opportunity, and generates a clear, shareable product story with a recommendation.

2. High-level flow (end to end)

User types a query: a molecule name (e.g., “metformin”) or disease (e.g., “PCOS”).

Orchestrator receives the query and breaks it into subtasks:

“Check scientific evidence”

“Check clinical trials”

“Check market size & competition”

“Check patents/IP risk”

“Check supply chain & manufacturing”

Scout Agents run in parallel:

Each agent talks to different data sources (APIs, PDFs, databases, web).

Each agent returns structured results, not raw text.

Signal Engine takes all agents’ outputs:

Cleans and normalizes the data

Calculates scores: scientific fit, commercial potential, competitive/patent risk, supply feasibility, overall opportunity score.

Narrative Generator uses those scores + evidence:

Writes a structured report:

Summary

Recommendation (go / no-go / needs more evidence)

Why (with bullets)

Risks

Next steps / strategy

Frontend / UI:

Shows a dashboard: scores, evidence, and narrative

Allows export as PDF / slide for leadership. 

pharma scout copilot

3. Core system components (what you need to build)

Break it into services/modules:

3.1 Frontend (Web UI)

Goal: One interface where a user can:

Enter a molecule or disease

See scores, charts, and the narrative

Export report as PDF

Features:

Search bar for molecule/disease

Results page:

Overall Opportunity Score

Sub-scores: Scientific, Commercial, IP risk, Supply

Tabs or sections:

Clinical Trials

Market

Patents/IP

Supply Chain

Literature

Generated product story (text)

“Export as PDF” button

Tech (example):

React / Next.js

Connects to backend via REST/GraphQL API

3.2 Backend API Gateway

Goal: Single entry point for the frontend and other clients.

Responsibilities:

Expose endpoints like:

POST /evaluate — body: { "query": "metformin for PCOS" }

GET /job/:id — status + results

Validate input

Send requests to Orchestrator service

Stream back progress and final result

3.3 Orchestrator Service (the “brain router”)

Goal: Turn one user query into multiple smaller jobs and coordinate the agents.

Responsibilities:

Receive query: "metformin for PCOS"

Create a Job ID

Define subtasks, e.g.:

{
  "jobId": "123",
  "tasks": [
    { "type": "clinical_trials", "query": "metformin PCOS" },
    { "type": "market", "query": "PCOS treatment market" },
    { "type": "ip", "query": "metformin patents PCOS indication" },
    { "type": "supply", "query": "metformin manufacturing API suppliers" },
    { "type": "literature", "query": "metformin PCOS efficacy safety" }
  ]
}


Dispatch each task to the right Scout Agent

Wait for all agent responses (with timeouts/fallbacks)

Pass collected outputs to the Signal Engine

Think of it as a task scheduler + router.

3.4 Scout Agent Layer (domain-specific workers)

Each Scout Agent is a microservice / module specialized in one type of data. 

pharma scout copilot

Market Agent

Inputs: molecule/disease

Data: market research APIs, sales data, epidemiology, competitor drugs

Output (structured):

Estimated market size

Competitor list

Price bands

Unmet need score

Time-to-market considerations

Clinical Trials Agent

Data: trial registries, clinical PDFs, trial result APIs

Output:

Number of trials

Trial phases (I/II/III/IV)

Success/failure indicators

Safety/efficacy summaries

Patents / IP Agent

Data: patent databases, legal filings

Output:

Key patents

Expiry dates

FTO (freedom-to-operate) risk score

Known litigations if available

Supply Chain Agent

Data: supplier databases, trade data, manufacturing info

Output:

Availability of API / excipients

Supplier diversity (how many suppliers)

Supply risk score (e.g., dependency on one country, geopolitical risk)

Literature / Scientific Evidence Agent

Data: PubMed-like APIs, scientific PDFs

Output:

Number of relevant papers

Strength of evidence (e.g., RCTs vs observational)

Mechanism of action notes

Safety concerns

Common pattern for all agents:

Receive: { taskId, query, constraints }

Do retrieval + optional LLM summarization

Return: { taskId, structuredData, confidenceScore }

3.5 Signal Scoring Engine

Goal: Take messy, heterogeneous outputs from all agents and convert them into comparable scores + overall opportunity score. 

pharma scout copilot

Inputs:

ClinicalTrialsResult

MarketResult

IPResult

SupplyResult

LiteratureResult

Processing:

Normalize values (e.g., map everything to 0–100)

Apply weightings (configurable):

Scientific Fit (e.g., 35%)

Commercial Potential (30%)

Competitive/IP Risk (20%)

Supply Feasibility (15%)

Compute:

{
  "scientific_fit": 78,
  "commercial_potential": 82,
  "ip_risk": 40,    // lower is better
  "supply_feasibility": 70,
  "overall_opportunity_score": 76
}


Attach raw evidence references (IDs, URLs, citations)

3.6 Opportunity Scorecard + Product Narrative Generator

Goal: Turn scores + structured signals into a human-readable, board-ready report. 

pharma scout copilot

Inputs:

All scores from Signal Engine

Summaries from each agent

Query (molecule/disease)

Evidence snippets

Outputs:

Short summary (3–5 lines)

Recommendation:

Go / No-Go / Needs more data

Why (by dimension):

Scientific rationale

Market rationale

IP/competitive landscape

Supply

Risks

Suggested strategy / next steps

Example structure:

{
  "summary": "Metformin for PCOS shows strong scientific and commercial potential with moderate IP risk.",
  "recommendation": "GO",
  "rationale": {
    "scientific": "...",
    "commercial": "...",
    "ip": "...",
    "supply": "..."
  },
  "risks": [
    "Potential competition from generics...",
    "Need further phase III trials in specific subgroups..."
  ],
  "next_steps": [
    "Commission deeper IP FTO analysis...",
    "Design phase II trial in X population..."
  ]
}


Then the backend provides this to the frontend and a PDF generator formats it nicely.

3.7 Storage & Infrastructure

Database (Postgres/Mongo) for:

Job metadata

Cached agent results

Final scorecards and narratives

Queue system (Redis/RabbitMQ/Kafka) for:

Orchestrator ↔ Agents communication

Auth & user management

Basic login

Org/team support later

Logging & monitoring

For each job: timings, failures, partial results

4. Data model sketch

You can describe these to a CLI/codegen tool.

4.1 Core entities

User

Job (one evaluation request)

Task (per-agent job)

AgentResult

SignalScores

OpportunityScorecard

Example (simplified):

// Job
{
  "id": "job_123",
  "user_id": "user_1",
  "query": "metformin for PCOS",
  "status": "completed",
  "created_at": "...",
  "completed_at": "..."
}

// AgentResult
{
  "id": "task_clinical_1",
  "job_id": "job_123",
  "agent_type": "clinical_trials",
  "raw_data": { /* cleaned, structured */ },
  "summary": "10 trials found, 6 positive...",
  "confidence": 0.88
}

// SignalScores
{
  "job_id": "job_123",
  "scientific_fit": 78,
  "commercial_potential": 82,
  "ip_risk": 40,
  "supply_feasibility": 70,
  "overall_opportunity_score": 76
}

5. Copy-paste spec for your CLI / codegen tool

You can paste this block directly into your CLI as a prompt:

Project: Build a Pharma Opportunity Copilot web app.

Goal: Given a molecule or disease name, the system should automatically collect signals from multiple domains (market, clinical trials, patents/IP, supply chain, scientific literature), compute opportunity scores, and generate a structured, shareable report with a clear go/no-go recommendation.

Main components to implement:

A web frontend (React/Next.js) with:

Search bar to input molecule/disease

Results page showing:

Overall opportunity score

Sub-scores: scientific fit, commercial potential, IP risk, supply feasibility

Tabs/sections for: clinical trials, market, patents/IP, supply chain, literature

A generated “product narrative” section: summary, recommendation, rationale, risks, next steps

Button to export the whole result as a nicely formatted PDF.

A backend API with endpoints:

POST /evaluate – input: { "query": "<molecule or disease>" }, response: job ID

GET /job/:id – returns job status and final result (scores + narrative)

An Orchestrator service that:

Receives a query and creates a Job

Breaks it into 5 subtasks: clinical_trials, market, ip, supply, literature

Sends those tasks in parallel to specialized Scout Agents

Waits for all agents or timeout, then passes results to the Signal Scoring Engine

A Scout Agent layer with separate modules/services:

MarketAgent

ClinicalTrialsAgent

IPAgent

SupplyAgent

LiteratureAgent
Each agent consumes a task object with { jobId, taskId, query } and returns structured JSON: { taskId, structuredData, summary, confidence }.

A Signal Scoring Engine that:

Takes all AgentResults for a Job

Normalizes them into numeric scores (0–100) for: scientific_fit, commercial_potential, ip_risk, supply_feasibility

Computes an overall_opportunity_score using configurable weights

Outputs those scores plus references to the underlying evidence

A Narrative Generator that:

Consumes: scores + agent summaries + the original query

Produces a structured JSON OpportunityScorecard with fields:

summary (short description)

recommendation ("GO", "NO_GO", "NEEDS_MORE_DATA")

rationale object with sections for scientific, commercial, IP, supply

risks (list of bullets)

next_steps (list of bullets)

Storage and infrastructure:

Database for Users, Jobs, AgentResults, SignalScores, OpportunityScorecards

Queue system for orchestrator ↔ agents

Basic auth and logging

Please generate:

Backend service boilerplate (API + orchestrator + agents + scoring engine + narrative generator)

Frontend pages and components for search, loading state, and results dashboard

Data models and interfaces for Job, Task, AgentResult, SignalScores, OpportunityScorecard

A simple PDF export feature based on the OpportunityScorecard.