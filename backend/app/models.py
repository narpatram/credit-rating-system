from sqlalchemy import Column, Integer, String, Float, DateTime, CheckConstraint
from sqlalchemy.sql import func
from .database import Base

class Mortgage(Base):
    """
    SQLAlchemy model for mortgage applications.
    
    Attributes:
        id (int): Primary key
        applicant_name (str): Name of the applicant
        income (float): Annual income
        credit_score (int): Credit score (300-850)
        loan_amount (float): Requested loan amount
        property_value (float): Value of the property
        debt_amount (float): Existing debt amount
        loan_type (str): Type of loan (fixed/adjustable)
        property_type (str): Type of property (single_family/condo)
        credit_rating (str): Calculated credit rating (AAA/BBB/C)
        created_at (datetime): Creation timestamp
        updated_at (datetime): Last update timestamp
    """
    __tablename__ = "mortgages"

    id = Column(Integer, primary_key=True, index=True)
    applicant_name = Column(String(100), nullable=False)
    income = Column(Float, nullable=False)
    credit_score = Column(Integer, nullable=False)
    loan_amount = Column(Float, nullable=False)
    property_value = Column(Float, nullable=False)
    debt_amount = Column(Float, nullable=False)
    loan_type = Column(String(20), nullable=False)
    property_type = Column(String(20), nullable=False)
    credit_rating = Column(String(10), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Add constraints
    __table_args__ = (
        CheckConstraint('income > 0', name='check_income_positive'),
        CheckConstraint('credit_score >= 300 AND credit_score <= 850', name='check_credit_score_range'),
        CheckConstraint('loan_amount > 0', name='check_loan_amount_positive'),
        CheckConstraint('property_value > 0', name='check_property_value_positive'),
        CheckConstraint('debt_amount >= 0', name='check_debt_amount_non_negative'),
        CheckConstraint("loan_type IN ('fixed', 'adjustable')", name='check_loan_type'),
        CheckConstraint("property_type IN ('single_family', 'condo')", name='check_property_type'),
        CheckConstraint("credit_rating IN ('AAA', 'BBB', 'C')", name='check_credit_rating'),
    ) 