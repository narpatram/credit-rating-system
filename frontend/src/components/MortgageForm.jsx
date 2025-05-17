import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Box,
  Card,
  CardContent,
  InputAdornment,
  useTheme,
  MenuItem,
} from '@mui/material';
import { createMortgage } from '../store/mortgageSlice';
import PersonIcon from '@mui/icons-material/Person';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import HomeIcon from '@mui/icons-material/Home';
import LoadingButton from '@mui/lab/LoadingButton';

const loanTypes = [
  { value: 'fixed', label: 'Fixed Rate' },
  { value: 'adjustable', label: 'Adjustable Rate' },
];

const propertyTypes = [
  { value: 'single_family', label: 'Single Family Home' },
  { value: 'condo', label: 'Condo' },
];

function MortgageForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const { loading, error } = useSelector((state) => state.mortgage);
  const [formData, setFormData] = useState({
    applicant_name: '',
    income: '',
    credit_score: '',
    loan_amount: '',
    property_value: '',
    debt_amount: '',
    loan_type: '',
    property_type: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createMortgage(formData));
    if (!result.error) {
      navigate('/mortgages');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
            New Mortgage Application
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Applicant Name"
                  name="applicant_name"
                  value={formData.applicant_name}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Annual Income"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        ₹
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Existing Debt"
                  name="debt_amount"
                  value={formData.debt_amount}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        ₹
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Credit Score"
                  name="credit_score"
                  value={formData.credit_score}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditScoreIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 300, max: 850 }}
                  helperText="Must be between 300 and 850"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Loan Type"
                  name="loan_type"
                  value={formData.loan_type}
                  onChange={handleChange}
                >
                  {loanTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Loan Amount"
                  name="loan_amount"
                  value={formData.loan_amount}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        ₹
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type="number"
                  label="Property Value"
                  name="property_value"
                  value={formData.property_value}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        ₹
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Property Type"
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                >
                  {propertyTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <LoadingButton
                    type="submit"
                    variant="contained"
                    color="primary"
                    loading={loading}
                    size="large"
                    sx={{
                      minWidth: 200,
                      height: 48,
                    }}
                  >
                    Submit Application
                  </LoadingButton>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}

export default MortgageForm; 