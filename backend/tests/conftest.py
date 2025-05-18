import pytest
from app.schemas import MortgageCreate

@pytest.fixture
def valid_mortgage_data():
    """Fixture providing valid mortgage data for testing."""
    return {
        "applicant_name": "John Doe",
        "income": 100000.0,
        "credit_score": 750,
        "loan_amount": 300000.0,
        "property_value": 400000.0,
        "debt_amount": 20000.0,
        "loan_type": "fixed",
        "property_type": "single_family"
    }

@pytest.fixture
def valid_mortgage(valid_mortgage_data):
    """Fixture providing a valid MortgageCreate instance."""
    return MortgageCreate(**valid_mortgage_data)

@pytest.fixture
def high_risk_mortgage():
    """Fixture providing a high-risk mortgage scenario."""
    return MortgageCreate(
        applicant_name="High Risk Applicant",
        income=40000.0,
        credit_score=600,
        loan_amount=450000.0,
        property_value=500000.0,
        debt_amount=25000.0,
        loan_type="adjustable",
        property_type="condo"
    )

@pytest.fixture
def low_risk_mortgage():
    """Fixture providing a low-risk mortgage scenario."""
    return MortgageCreate(
        applicant_name="Low Risk Applicant",
        income=200000.0,
        credit_score=800,
        loan_amount=400000.0,
        property_value=800000.0,
        debt_amount=50000.0,
        loan_type="fixed",
        property_type="single_family"
    ) 