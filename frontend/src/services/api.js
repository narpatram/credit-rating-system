import axios from 'axios'

const API_URL = 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const apiService = {
  // Mortgage endpoints
  getMortgages: async () => {
    try {
      const response = await api.get('/mortgages')
      return response.data
    } catch (error) {
      console.error('Error fetching mortgages:', error)
      throw error
    }
  },

  createMortgage: async (mortgageData) => {
    try {
      const response = await api.post('/mortgages', mortgageData)
      return response.data
    } catch (error) {
      console.error('Error creating mortgage:', error)
      throw error
    }
  },

  deleteMortgage: async (id) => {
    try {
      const response = await api.delete(`/mortgages/${id}`)
      return response.data
    } catch (error) {
      console.error('Error deleting mortgage:', error)
      throw error
    }
  },

  // Credit rating endpoints
  calculateCreditRating: async (mortgageId) => {
    try {
      const response = await api.post(`/mortgages/${mortgageId}/calculate-rating`)
      return response.data
    } catch (error) {
      console.error('Error calculating credit rating:', error)
      throw error
    }
  },

  getCreditRating: async (mortgageId) => {
    try {
      const response = await api.get(`/mortgages/${mortgageId}/rating`)
      return response.data
    } catch (error) {
      console.error('Error getting credit rating:', error)
      throw error
    }
  },
}

export default apiService 