# Mortgage Application System

A full-stack application for managing mortgage applications with credit rating calculations.

## Project Structure

```
project_root/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # Main application file
│   │   ├── models.py       # SQLAlchemy models
│   │   ├── schemas.py      # Pydantic models
│   │   ├── database.py     # Database configuration
│   │   └── utils/          # Utility functions
│   │       └── credit_rating.py  # Credit rating calculation
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Environment variables (not tracked in git)
└── frontend/               # React frontend
    └── src/
        ├── components/     # React components
        └── store/         # Redux store
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Unix/MacOS:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory with the following content:
   ```
   DB_USER=root
   DB_PASSWORD=password
   DB_HOST=localhost
   DB_NAME=mortgage_db
   ```
   Note: Make sure to update these values according to your MySQL setup.

5. Set up MySQL:
   - Install MySQL if not already installed
   - Create a database named `mortgage_db`
   - Create a user with appropriate permissions or use root

6. Run the backend server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Features

- Create, read, update, and delete mortgage applications
- Automatic credit rating calculation based on:
  - Loan-to-Value (LTV) Ratio
  - Debt-to-Income (DTI) Ratio
  - Credit Score
  - Loan Type
  - Property Type
- Credit ratings are calculated as:
  - AAA: Highly secure (risk score ≤ 2)
  - BBB: Medium risk (risk score 3-5)
  - C: Highly speculative (risk score > 5)
- Real-time updates with Redux state management
- Responsive Material-UI interface
- Error handling and logging

## API Endpoints

- `POST /mortgages`: Create a new mortgage application
- `GET /mortgages`: List all mortgage applications
- `PUT /mortgages/{id}`: Update a mortgage application
- `DELETE /mortgages/{id}`: Delete a mortgage application

## API Documentation

Once the backend server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

### Database Schema

The application uses the following database schema:

```sql
CREATE TABLE mortgages (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    applicant_name VARCHAR(100) NOT NULL,
    income FLOAT NOT NULL,
    credit_score INTEGER NOT NULL,
    loan_amount FLOAT NOT NULL,
    property_value FLOAT NOT NULL,
    debt_amount FLOAT NOT NULL,
    loan_type VARCHAR(20) NOT NULL,
    property_type VARCHAR(20) NOT NULL,
    credit_rating VARCHAR(10) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME ON UPDATE CURRENT_TIMESTAMP
);
```

### Environment Variables

The following environment variables are required:
- `DB_USER`: MySQL username
- `DB_PASSWORD`: MySQL password
- `DB_HOST`: MySQL host
- `DB_NAME`: MySQL database name

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 