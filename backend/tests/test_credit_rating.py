import pytest
from app.utils.credit_rating import calculate_credit_rating
from app.schemas import MortgageCreate
from pydantic import ValidationError

def test_valid_mortgage_rating(valid_mortgage):
    """Test credit rating calculation with valid mortgage data."""
    rating = calculate_credit_rating(valid_mortgage)
    assert rating in ["AAA", "BBB", "C"]

def test_high_risk_mortgage(high_risk_mortgage):
    """Test credit rating calculation for high-risk scenario."""
    rating = calculate_credit_rating(high_risk_mortgage)
    assert rating == "C"  # Should be highly speculative

def test_low_risk_mortgage(low_risk_mortgage):
    """Test credit rating calculation for low-risk scenario."""
    rating = calculate_credit_rating(low_risk_mortgage)
    assert rating == "AAA"  # Should be highly secure

def test_credit_score_impact():
    """Test the impact of credit score on rating."""
    # High credit score
    high_score = MortgageCreate(
        applicant_name="Test User",
        income=100000.0,
        credit_score=800,
        loan_amount=300000.0,
        property_value=400000.0,
        debt_amount=20000.0,
        loan_type="fixed",
        property_type="single_family"
    )
    high_rating = calculate_credit_rating(high_score)
    
    # Low credit score
    low_score = MortgageCreate(
        applicant_name="Test User",
        income=100000.0,
        credit_score=600,
        loan_amount=300000.0,
        property_value=400000.0,
        debt_amount=20000.0,
        loan_type="fixed",
        property_type="single_family"
    )
    low_rating = calculate_credit_rating(low_score)
    
    assert high_rating <= low_rating  # Higher score should give better or equal rating

def test_ltv_ratio_impact():
    """Test the impact of Loan-to-Value ratio on rating."""
    # Low LTV
    low_ltv = MortgageCreate(
        applicant_name="Test User",
        income=100000.0,
        credit_score=700,
        loan_amount=200000.0,
        property_value=400000.0,
        debt_amount=20000.0,
        loan_type="fixed",
        property_type="single_family"
    )
    low_ltv_rating = calculate_credit_rating(low_ltv)
    
    # High LTV
    high_ltv = MortgageCreate(
        applicant_name="Test User",
        income=100000.0,
        credit_score=700,
        loan_amount=380000.0,
        property_value=400000.0,
        debt_amount=20000.0,
        loan_type="fixed",
        property_type="single_family"
    )
    high_ltv_rating = calculate_credit_rating(high_ltv)
    
    assert low_ltv_rating <= high_ltv_rating  # Lower LTV should give better or equal rating

def test_dti_ratio_impact():
    """Test the impact of Debt-to-Income ratio on rating."""
    # Low DTI
    low_dti = MortgageCreate(
        applicant_name="Test User",
        income=100000.0,
        credit_score=700,
        loan_amount=300000.0,
        property_value=400000.0,
        debt_amount=20000.0,
        loan_type="fixed",
        property_type="single_family"
    )
    low_dti_rating = calculate_credit_rating(low_dti)
    
    # High DTI
    high_dti = MortgageCreate(
        applicant_name="Test User",
        income=100000.0,
        credit_score=700,
        loan_amount=300000.0,
        property_value=400000.0,
        debt_amount=60000.0,
        loan_type="fixed",
        property_type="single_family"
    )
    high_dti_rating = calculate_credit_rating(high_dti)
    
    assert low_dti_rating <= high_dti_rating  # Lower DTI should give better or equal rating

def test_invalid_credit_score():
    """Test handling of invalid credit score."""
    with pytest.raises(ValidationError) as exc_info:
        MortgageCreate(
            applicant_name="Test User",
            income=100000.0,
            credit_score=200,  # Below valid range
            loan_amount=300000.0,
            property_value=400000.0,
            debt_amount=20000.0,
            loan_type="fixed",
            property_type="single_family"
        )
    assert "Input should be greater than or equal to 300" in str(exc_info.value)

def test_invalid_loan_amount():
    """Test handling of invalid loan amount."""
    with pytest.raises(ValidationError) as exc_info:
        MortgageCreate(
            applicant_name="Test User",
            income=100000.0,
            credit_score=700,
            loan_amount=-100000.0,  # Negative amount
            property_value=400000.0,
            debt_amount=20000.0,
            loan_type="fixed",
            property_type="single_family"
        )
    assert "Input should be greater than 0" in str(exc_info.value)

def test_invalid_loan_type():
    """Test handling of invalid loan type."""
    with pytest.raises(ValidationError) as exc_info:
        MortgageCreate(
            applicant_name="Test User",
            income=100000.0,
            credit_score=700,
            loan_amount=300000.0,
            property_value=400000.0,
            debt_amount=20000.0,
            loan_type="invalid_type",  # Invalid loan type
            property_type="single_family"
        )
    assert "String should match pattern '^(fixed|adjustable)$'" in str(exc_info.value)

def test_invalid_property_type():
    """Test handling of invalid property type."""
    with pytest.raises(ValidationError) as exc_info:
        MortgageCreate(
            applicant_name="Test User",
            income=100000.0,
            credit_score=700,
            loan_amount=300000.0,
            property_value=400000.0,
            debt_amount=20000.0,
            loan_type="fixed",
            property_type="invalid_type"  # Invalid property type
        )
    assert "String should match pattern '^(single_family|condo)$'" in str(exc_info.value) 