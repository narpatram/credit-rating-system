from .. import schemas

VALID_CREDIT_RATINGS = ["AAA", "BBB", "C"]

def calculate_credit_rating(mortgage: schemas.MortgageCreate, avg_credit_score: float = 700.0) -> str:
    """
    Calculate credit rating based on the specified algorithm.
    
    Args:
        mortgage (MortgageCreate): The mortgage application data
        avg_credit_score (float): The average credit score for adjustment
        
    Returns:
        str: The calculated credit rating (AAA, BBB, or C)
    """
    # Input validation
    if mortgage.loan_amount <= 0 or mortgage.property_value <= 0:
        raise ValueError("Loan amount and property value must be positive")
    if mortgage.income <= 0:
        raise ValueError("Income must be positive")
    if mortgage.debt_amount < 0:
        raise ValueError("Debt amount cannot be negative")
    if mortgage.credit_score < 300 or mortgage.credit_score > 850:
        raise ValueError("Credit score must be between 300 and 850")
    if mortgage.loan_type not in ["fixed", "adjustable"]:
        raise ValueError("Loan type must be either 'fixed' or 'adjustable'")
    if mortgage.property_type not in ["single_family", "condo"]:
        raise ValueError("Property type must be either 'single_family' or 'condo'")

    risk_score = 0
    
    # 1. Loan-to-Value (LTV) Ratio
    ltv_ratio = mortgage.loan_amount / mortgage.property_value
    if ltv_ratio > 0.9:  # LTV > 90%
        risk_score += 2
    elif ltv_ratio > 0.8:  # LTV > 80%
        risk_score += 1
    
    # 2. Debt-to-Income (DTI) Ratio
    dti_ratio = mortgage.debt_amount / mortgage.income
    if dti_ratio > 0.5:  # DTI > 50%
        risk_score += 2
    elif dti_ratio > 0.4:  # DTI > 40%
        risk_score += 1
    
    # 3. Credit Score
    if mortgage.credit_score >= 700:
        risk_score -= 1
    elif mortgage.credit_score < 650:
        risk_score += 1
    
    # 4. Loan Type
    if mortgage.loan_type == "fixed":
        risk_score -= 1
    elif mortgage.loan_type == "adjustable":
        risk_score += 1
    
    # 5. Property Type
    if mortgage.property_type == "condo":
        risk_score += 1
    
    # 6. Average Credit Score Adjustment
    if avg_credit_score >= 700:
        risk_score -= 1
    elif avg_credit_score < 650:
        risk_score += 1
    
    # Final Credit Rating
    if risk_score <= 2:
        return "AAA"  # Highly secure
    elif 3 <= risk_score <= 5:
        return "BBB"  # Medium risk
    else:
        return "C"    # Highly speculative or distressed 