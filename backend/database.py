import os
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from models import ScoreCard, Narrative, AgentSummary # Import Pydantic models for JSON storage

# --- Database URL ---
# Prioritize DATABASE_URL environment variable for production (Supabase)
# Fallback to SQLite for local development convenience if not set
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./pharma.db")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Database Models ---
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=True) # New
    last_name = Column(String, nullable=True) # New
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    reports = relationship("Report", back_populates="owner")

class Report(Base):
    __tablename__ = "reports"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    query = Column(String, index=True)
    job_id = Column(String, unique=True, index=True) # UUID from the JobResult
    
    # Store the entire JobResult as JSON
    # For PostgreSQL, SQLAlchemy handles JSON type directly.
    # For SQLite, it stores as TEXT and serializes/deserializes automatically.
    full_report_data = Column(JSON) 
    
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="reports")

# --- Create Tables ---
# This function will create tables if they don't exist
def create_db_tables():
    Base.metadata.create_all(bind=engine)

# --- Dependency to get DB session ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
