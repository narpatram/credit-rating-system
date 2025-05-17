# Mortgage Application System

A full-stack application for managing mortgage applications with credit rating calculations.

## Project Structure

```
project_root/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # Main application file
│   │   ├── schemas.py      # Pydantic models
│   │   └── utils/          # Utility functions
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   └── src/
│       ├── components/     # React components
│       └── store/         # Redux store
└── database/              # Database configuration and models
    ├── config.py          # Database configuration
    └── models.py          # SQLAlchemy models
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
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory:
   ```
   DATABASE_URL=sqlite:///./mortgage.db
   ```

5. Run the backend server:
   ```bash
   uvicorn app.main:app --reload
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
- Real-time updates with Redux state management
- Responsive Material-UI interface
- Error handling and logging

## API Documentation

Once the backend server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 