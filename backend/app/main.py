from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware
import logging
from pathlib import Path
import sys

# Add the project root to Python path
project_root = Path(__file__).parent.parent.parent
sys.path.append(str(project_root))

from .models import Mortgage, Base
from .database import engine, get_db
from .utils.credit_rating import calculate_credit_rating
from . import schemas

# Constants
DEFAULT_PAGE_SIZE = 100
MAX_PAGE_SIZE = 1000
ALLOWED_ORIGINS = ["http://localhost:3000"]

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create tables if they don't exist
try:
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created successfully")
except Exception as e:
    logger.error(f"Failed to create database tables: {str(e)}")
    raise

app = FastAPI(
    title="Mortgage Application API",
    description="API for managing mortgage applications with credit rating calculations",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/mortgages", response_model=schemas.Mortgage, status_code=status.HTTP_201_CREATED, tags=["mortgages"])
async def create_mortgage(mortgage: schemas.MortgageCreate, db: Session = Depends(get_db)):
    """
    Create a new mortgage application.
    
    The credit rating is automatically calculated based on:
    - Loan-to-Value (LTV) Ratio
    - Debt-to-Income (DTI) Ratio
    - Credit Score
    - Loan Type
    - Property Type
    
    Args:
        mortgage (MortgageCreate): The mortgage application data
        db (Session): Database session
        
    Returns:
        Mortgage: The created mortgage application with credit rating
        
    Raises:
        HTTPException: If there's an error creating the mortgage
    """
    try:
        credit_rating = calculate_credit_rating(mortgage)
        db_mortgage = Mortgage(
            **mortgage.model_dump(),
            credit_rating=credit_rating
        )
        db.add(db_mortgage)
        db.commit()
        db.refresh(db_mortgage)
        logger.info(f"Created new mortgage application for {db_mortgage.applicant_name}")
        return db_mortgage
    except Exception as e:
        logger.error(f"Failed to create mortgage: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create mortgage application"
        )

@app.get("/mortgages", response_model=List[schemas.Mortgage], tags=["mortgages"])
async def get_mortgages(
    skip: int = 0,
    limit: int = DEFAULT_PAGE_SIZE,
    db: Session = Depends(get_db)
):
    """
    Get all mortgage applications with pagination.
    
    Args:
        skip (int): Number of records to skip
        limit (int): Maximum number of records to return
        db (Session): Database session
        
    Returns:
        List[Mortgage]: List of mortgage applications
        
    Raises:
        HTTPException: If there's an error fetching mortgages
    """
    try:
        if limit > MAX_PAGE_SIZE:
            limit = MAX_PAGE_SIZE
        mortgages = db.query(Mortgage).offset(skip).limit(limit).all()
        return mortgages
    except Exception as e:
        logger.error(f"Failed to fetch mortgages: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch mortgage applications"
        )

@app.delete("/mortgages/{mortgage_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["mortgages"])
async def delete_mortgage(mortgage_id: int, db: Session = Depends(get_db)):
    """
    Delete a mortgage application by ID.
    
    Args:
        mortgage_id (int): ID of the mortgage to delete
        db (Session): Database session
        
    Raises:
        HTTPException: If mortgage not found or error deleting
    """
    try:
        mortgage = db.query(Mortgage).filter(Mortgage.id == mortgage_id).first()
        if mortgage is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mortgage not found"
            )
        db.delete(mortgage)
        db.commit()
        logger.info(f"Deleted mortgage application {mortgage_id}")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete mortgage {mortgage_id}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to delete mortgage application"
        )

@app.put("/mortgages/{mortgage_id}", response_model=schemas.Mortgage, tags=["mortgages"])
async def update_mortgage(
    mortgage_id: int,
    mortgage_update: schemas.MortgageCreate,
    db: Session = Depends(get_db)
):
    """
    Update a mortgage application by ID.
    
    The credit rating is automatically recalculated based on the updated values.
    
    Args:
        mortgage_id (int): ID of the mortgage to update
        mortgage_update (MortgageCreate): Updated mortgage data
        db (Session): Database session
        
    Returns:
        Mortgage: The updated mortgage application
        
    Raises:
        HTTPException: If mortgage not found or error updating
    """
    try:
        db_mortgage = db.query(Mortgage).filter(Mortgage.id == mortgage_id).first()
        if db_mortgage is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Mortgage not found"
            )
        
        credit_rating = calculate_credit_rating(mortgage_update)
        
        for key, value in mortgage_update.model_dump().items():
            setattr(db_mortgage, key, value)
        
        db_mortgage.credit_rating = credit_rating
        
        db.commit()
        db.refresh(db_mortgage)
        logger.info(f"Updated mortgage application {mortgage_id}")
        return db_mortgage
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update mortgage {mortgage_id}: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update mortgage application"
        ) 