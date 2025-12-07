# Pharma Scout Copilot

## The Command Center for Drug Discovery.

Pharma Scout Copilot is an AI-powered platform that transforms weeks of pharmaceutical due diligence into minutes. Given a molecule or disease name, it automatically pulls and synthesizes signals from multiple real-time sources (clinical trials, scientific literature, market data, and IP/patents), computes an overall opportunity score, and generates a structured, board-ready report with a clear go/no-go recommendation.

---

## Features

*   **Intelligent Search:** Analyze any molecule or disease with a single query.
*   **Real-time Agents:** Live data fetching from ClinicalTrials.gov and PubMed, complemented by intelligent web search for market & IP.
*   **AI-Powered Synthesis:** Uses Gemini 2.5 Flash to generate executive summaries, risks, and next steps.
*   **Dynamic Scoring:** Computes Scientific Fit, Commercial Potential, IP Risk, and Supply Feasibility scores.
*   **Interactive UI:** Modern, "Bio-Luminescent Glass" design with Framer Motion animations.
*   **User Authentication:** Secure login/signup, powered by PostgreSQL (or SQLite locally).
*   **Personalized Portfolio:** Save and view all your analysis reports.
*   **Board-Ready PDF Export:** One-click generation of professional PDF reports.

---

## Project Structure

The project is divided into two main parts:

1.  **`backend/`**: A FastAPI application that serves the API, orchestrates AI agents, and manages the database.
2.  **`frontend/`**: A Next.js 14 application that provides the user interface.

---

## Local Development Setup

### Prerequisites

*   Python 3.8+
*   Node.js 18+ & npm
*   Git

### 1. Clone the Repository

Since the code is not pushed yet, you'll first need to create the repo on GitHub, then add your existing local code to it. (This will be handled automatically by the agent after README creation).

### 2. Backend Setup (`backend/`)

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```
2.  **Create and activate a Python virtual environment:**
    ```bash
    python -m venv venv
    .\venv\Scripts\activate # On Windows CMD/PowerShell
    # source venv/bin/activate # On Linux/macOS
    ```
3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
4.  **Database Configuration:**
    *   For local development, we default to **SQLite**. If you want to use **PostgreSQL (e.g., Supabase)**, set the `DATABASE_URL` environment variable:
        ```bash
        # For SQLite (default, zero setup needed)
        set DATABASE_URL=sqlite:///./pharma.db
        
        # For Supabase PostgreSQL (replace with your actual URL and password)
        # set DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
        ```
5.  **Google Gemini API Key:**
    *   Set your Gemini API key as an environment variable (get one from [Google AI Studio](https://ai.google.dev/)):
        ```bash
        set GOOGLE_API_KEY=YOUR_GEMINI_API_KEY
        ```
6.  **Start the Backend Server:**
    ```bash
    uvicorn main:app --reload
    ```
    The backend will be available at `http://localhost:8000`.

### 3. Frontend Setup (`frontend/`)

1.  **Open a NEW terminal window** (keep the backend terminal running).
2.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
3.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```
4.  **Environment Variable:**
    *   Create a `.env.local` file in the `frontend/` directory with the following content (or set it in your environment):
        ```
        NEXT_PUBLIC_API_URL=http://localhost:8000
        ```
        This tells the frontend where your local backend is running.
5.  **Start the Frontend Development Server:**
    ```bash
    npm run dev
    ```
    The frontend will be available at `http://localhost:3000`.

---

## Deployment Guide

### Environment Variables (Crucial for Deployment)

For both your backend and frontend deployments, you **must** set the following environment variables in your hosting provider's dashboard:

*   **`SECRET_KEY`**: A strong, random string for JWT token security (e.g., generate a UUID).
*   **`DATABASE_URL`**: Your production PostgreSQL connection string (e.g., from Supabase).
*   **`GOOGLE_API_KEY`**: Your production Gemini API key.
*   **`ALLOWED_ORIGINS`**: A comma-separated list of your frontend's production URLs (e.g., `https://pharma-scout.vercel.app`). For local testing, `http://localhost:3000` is used.
*   **`NEXT_PUBLIC_API_URL`**: The public URL of your deployed backend API (e.g., `https://your-backend-app.railway.app`). (Frontend only)

### 1. Backend Deployment (e.g., Railway, Render)

Choose a platform that supports Python applications (e.g., Railway, Render, Heroku).

1.  **Connect to GitHub:** Link your repository (`namansaini2709/pharma-scout`).
2.  **Root Directory:** Specify `backend/`.
3.  **Build Command:** `pip install -r requirements.txt`
4.  **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
5.  **Environment Variables:** Add all backend-specific variables listed above (`SECRET_KEY`, `DATABASE_URL`, `GOOGLE_API_KEY`, `ALLOWED_ORIGINS`).

### 2. Frontend Deployment (e.g., Vercel)

Choose a platform that supports Next.js applications (e.g., Vercel, Netlify).

1.  **Connect to GitHub:** Link your repository (`namansaini2709/pharma-scout`).
2.  **Root Directory:** Specify `frontend/`.
3.  **Build Command:** (Usually auto-detected by Vercel: `npm run build`)
4.  **Start Command:** (Usually auto-detected by Vercel: `npm run start`)
5.  **Environment Variables:** Add `NEXT_PUBLIC_API_URL` (pointing to your deployed backend URL).

---

## Contribution

Feel free to open issues or pull requests!

---
