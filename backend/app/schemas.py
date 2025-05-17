from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class MortgageBase(BaseModel):
    applicant_name: str
    income: float = Field(gt=0)
    credit_score: int = Field(ge=300, le=850)
    loan_amount: float = Field(gt=0)
    property_value: float = Field(gt=0)
    debt_amount: float = Field(ge=0)
    loan_type: str = Field(pattern="^(fixed|adjustable)$")
    property_type: str = Field(pattern="^(single_family|condo)$")

class MortgageCreate(MortgageBase):
    pass

class Mortgage(MortgageBase):
    id: int
    credit_rating: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True 