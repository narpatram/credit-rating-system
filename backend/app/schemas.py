from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class MortgageBase(BaseModel):
    """
    Base Pydantic model for mortgage data validation.
    
    Attributes:
        applicant_name (str): Name of the applicant
        income (float): Annual income (must be positive)
        credit_score (int): Credit score (300-850)
        loan_amount (float): Requested loan amount (must be positive)
        property_value (float): Value of the property (must be positive)
        debt_amount (float): Existing debt amount (must be non-negative)
        loan_type (str): Type of loan (fixed/adjustable)
        property_type (str): Type of property (single_family/condo)
    """
    applicant_name: str = Field(..., min_length=1, max_length=100, description="Name of the applicant")
    income: float = Field(..., gt=0, description="Annual income (must be positive)")
    credit_score: int = Field(..., ge=300, le=850, description="Credit score (300-850)")
    loan_amount: float = Field(..., gt=0, description="Requested loan amount (must be positive)")
    property_value: float = Field(..., gt=0, description="Value of the property (must be positive)")
    debt_amount: float = Field(..., ge=0, description="Existing debt amount (must be non-negative)")
    loan_type: str = Field(..., pattern="^(fixed|adjustable)$", description="Type of loan (fixed/adjustable)")
    property_type: str = Field(..., pattern="^(single_family|condo)$", description="Type of property (single_family/condo)")

class MortgageCreate(MortgageBase):
    """Pydantic model for creating a new mortgage application."""
    pass

class Mortgage(MortgageBase):
    """
    Pydantic model for mortgage data with additional fields.
    
    Additional Attributes:
        id (int): Unique identifier
        credit_rating (str): Calculated credit rating (AAA/BBB/C)
        created_at (datetime): Creation timestamp
        updated_at (Optional[datetime]): Last update timestamp
    """
    id: int
    credit_rating: str = Field(..., pattern="^(AAA|BBB|C)$")
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 