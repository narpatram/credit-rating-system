import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiService } from '../services/api'
import axios from 'axios'

const API_URL = 'http://localhost:8000'

export const fetchMortgages = createAsyncThunk(
  'mortgage/fetchMortgages',
  async () => {
    const response = await axios.get(`${API_URL}/mortgages`)
    return response.data
  }
)

export const createMortgage = createAsyncThunk(
  'mortgage/createMortgage',
  async (mortgageData) => {
    const response = await axios.post(`${API_URL}/mortgages`, mortgageData)
    return response.data
  }
)

export const deleteMortgage = createAsyncThunk(
  'mortgage/deleteMortgage',
  async (id) => {
    await axios.delete(`${API_URL}/mortgages/${id}`)
    return id
  }
)

export const calculateCreditRating = createAsyncThunk(
  'mortgage/calculateRating',
  async (mortgageId, { rejectWithValue }) => {
    try {
      const response = await apiService.calculateCreditRating(mortgageId)
      return response
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message)
    }
  }
)

export const updateMortgage = createAsyncThunk(
  'mortgage/updateMortgage',
  async ({ id, ...mortgageData }) => {
    const response = await axios.put(`${API_URL}/mortgages/${id}`, mortgageData)
    return response.data
  }
)

const initialState = {
  mortgages: [],
  loading: false,
  error: null,
  currentMortgage: null,
  snackbar: {
    open: false,
    message: '',
    severity: 'success',
  },
}

const mortgageSlice = createSlice({
  name: 'mortgage',
  initialState,
  reducers: {
    setCurrentMortgage: (state, action) => {
      state.currentMortgage = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    showSnackbar: (state, action) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'success',
      }
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch mortgages
      .addCase(fetchMortgages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMortgages.fulfilled, (state, action) => {
        state.loading = false
        state.mortgages = action.payload
      })
      .addCase(fetchMortgages.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Create mortgage
      .addCase(createMortgage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createMortgage.fulfilled, (state, action) => {
        state.loading = false
        state.mortgages.push(action.payload)
        state.currentMortgage = action.payload
        state.snackbar = {
          open: true,
          message: 'Mortgage application created successfully',
          severity: 'success',
        }
      })
      .addCase(createMortgage.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
        state.snackbar = {
          open: true,
          message: action.error.message || 'Failed to create mortgage application',
          severity: 'error',
        }
      })
      // Delete mortgage
      .addCase(deleteMortgage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteMortgage.fulfilled, (state, action) => {
        state.loading = false
        state.mortgages = state.mortgages.filter(
          (mortgage) => mortgage.id !== action.payload
        )
        state.snackbar = {
          open: true,
          message: 'Mortgage application deleted successfully',
          severity: 'success',
        }
      })
      .addCase(deleteMortgage.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
        state.snackbar = {
          open: true,
          message: action.error.message || 'Failed to delete mortgage application',
          severity: 'error',
        }
      })
      // Calculate credit rating
      .addCase(calculateCreditRating.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(calculateCreditRating.fulfilled, (state, action) => {
        state.loading = false
        const mortgage = state.mortgages.find(
          (m) => m.id === action.payload.mortgage_id
        )
        if (mortgage) {
          mortgage.rating = action.payload.rating
        }
      })
      .addCase(calculateCreditRating.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to calculate credit rating'
      })
      // Update mortgage
      .addCase(updateMortgage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateMortgage.fulfilled, (state, action) => {
        state.loading = false
        const index = state.mortgages.findIndex(m => m.id === action.payload.id)
        if (index !== -1) {
          state.mortgages[index] = action.payload
        }
        state.snackbar = {
          open: true,
          message: 'Mortgage application updated successfully',
          severity: 'success',
        }
      })
      .addCase(updateMortgage.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
        state.snackbar = {
          open: true,
          message: action.error.message || 'Failed to update mortgage application',
          severity: 'error',
        }
      })
  },
})

export const { setCurrentMortgage, clearError, showSnackbar, hideSnackbar } = mortgageSlice.actions
export default mortgageSlice.reducer 