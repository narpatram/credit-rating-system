import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Card,
  CardContent,
  useTheme,
  Paper,
  IconButton,
  Tooltip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { fetchMortgages, updateMortgage, deleteMortgage, hideSnackbar } from '../store/mortgageSlice';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LoadingScreen from './LoadingScreen';
import EditMortgageDialog from './EditMortgageDialog';

function MortgageList() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { mortgages, loading, error, snackbar } = useSelector((state) => state.mortgage);
  const [selectedMortgage, setSelectedMortgage] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [mortgageToDelete, setMortgageToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchMortgages());
  }, [dispatch]);

  const getRatingColor = (rating) => {
    switch (rating) {
      case 'AAA':
        return 'success';
      case 'BBB':
        return 'warning';
      case 'C':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRatingIcon = (rating) => {
    switch (rating) {
      case 'AAA':
        return <TrendingUpIcon />;
      case 'BBB':
        return <TrendingFlatIcon />;
      case 'C':
        return <TrendingDownIcon />;
      default:
        return null;
    }
  };

  const handleEdit = (mortgage) => {
    setSelectedMortgage(mortgage);
    setIsEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setIsEditDialogOpen(false);
    setSelectedMortgage(null);
  };

  const handleEditSave = async (updatedMortgage) => {
    try {
      await dispatch(updateMortgage(updatedMortgage)).unwrap();
      dispatch(fetchMortgages());
    } catch (error) {
      console.error('Failed to update mortgage:', error);
    }
  };

  const handleSnackbarClose = () => {
    dispatch(hideSnackbar());
  };

  const handleDelete = (mortgage) => {
    setMortgageToDelete(mortgage);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteMortgage(mortgageToDelete.id)).unwrap();
      dispatch(fetchMortgages());
    } catch (error) {
      console.error('Failed to delete mortgage:', error);
    } finally {
      setIsDeleteDialogOpen(false);
      setMortgageToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setMortgageToDelete(null);
  };

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', mt: 4 }}>
      <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
            Mortgage Applications
          </Typography>
          <TableContainer component={Paper} elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.background.default }}>
                  <TableCell sx={{ fontWeight: 600 }}>Applicant Name</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Income</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Credit Score</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Loan Amount</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>Property Value</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Rating</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <LoadingScreen />
                    </TableCell>
                  </TableRow>
                ) : mortgages.map((mortgage) => (
                  <TableRow
                    key={mortgage.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <TableCell>{mortgage.applicant_name}</TableCell>
                    <TableCell align="right">
                      ₹{mortgage.income.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">{mortgage.credit_score}</TableCell>
                    <TableCell align="right">
                      ₹{mortgage.loan_amount.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      ₹{mortgage.property_value.toLocaleString()}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={getRatingIcon(mortgage.credit_rating)}
                        label={mortgage.credit_rating}
                        color={getRatingColor(mortgage.credit_rating)}
                        variant="outlined"
                        sx={{
                          minWidth: 80,
                          '& .MuiChip-icon': {
                            color: 'inherit',
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(mortgage)}
                            sx={{ color: theme.palette.primary.main }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(mortgage)}
                            sx={{ color: theme.palette.error.main }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {!loading && mortgages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Typography color="text.secondary">
                        No mortgage applications found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
      <EditMortgageDialog
        open={isEditDialogOpen}
        onClose={handleEditClose}
        mortgage={selectedMortgage}
        onSave={handleEditSave}
      />
      <Dialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Mortgage Application
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the mortgage application for {mortgageToDelete?.applicant_name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MortgageList; 