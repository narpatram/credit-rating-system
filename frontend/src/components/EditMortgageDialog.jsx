import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  useTheme,
} from '@mui/material';
import { useState, useEffect } from 'react';


function EditMortgageDialog({ open, onClose, mortgage, onSave }) {

  const [formData, setFormData] = useState({
    applicant_name: '',
    income: '',
    credit_score: '',
    loan_amount: '',
    property_value: '',
    credit_rating: '',
  });

  useEffect(() => {
    if (mortgage) {
      setFormData({
        applicant_name: mortgage.applicant_name,
        income: mortgage.income.toString(),
        credit_score: mortgage.credit_score.toString(),
        loan_amount: mortgage.loan_amount.toString(),
        property_value: mortgage.property_value.toString(),
        credit_rating: mortgage.credit_rating,
      });
    }
  }, [mortgage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedMortgage = {
      ...mortgage,
      ...formData,
      income: Number(formData.income),
      credit_score: Number(formData.credit_score),
      loan_amount: Number(formData.loan_amount),
      property_value: Number(formData.property_value),
    };
    onSave(updatedMortgage);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Mortgage Application</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="applicant_name"
              label="Applicant Name"
              value={formData.applicant_name}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="income"
              label="Annual Income"
              type="number"
              value={formData.income}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: '₹',
              }}
            />
            <TextField
              name="credit_score"
              label="Credit Score"
              type="number"
              value={formData.credit_score}
              onChange={handleChange}
              fullWidth
              required
              inputProps={{
                min: 300,
                max: 850,
              }}
            />
            <TextField
              name="loan_amount"
              label="Loan Amount"
              type="number"
              value={formData.loan_amount}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: '₹',
              }}
            />
            <TextField
              name="property_value"
              label="Property Value"
              type="number"
              value={formData.property_value}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{
                startAdornment: '₹',
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditMortgageDialog; 