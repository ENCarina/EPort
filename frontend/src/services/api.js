import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  register: (data) => apiClient.post('/register', data),
  login: (data) => apiClient.post('/login', data),
}

export const userAPI = {
  getUsers: () => apiClient.get('/users'),
  getUser: (id) => apiClient.get(`/users/${id}`),
  updatePassword: (id, data) => apiClient.put(`/users/${id}/password`, data),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
}

export const staffAPI = {
  getStaff: () => apiClient.get('/staff'),
  getStaffDetail: (id) => apiClient.get(`/staff/${id}`),
  createStaff: (data) => apiClient.post('/staff', data),
  updateStaff: (id, data) => apiClient.put(`/staff/${id}`, data),
  deleteStaff: (id) => apiClient.delete(`/staff/${id}`),
}

export const profileAPI = {
  getProfiles: () => apiClient.get('/profiles'),
  getProfileDetail: (id) => apiClient.get(`/profiles/${id}`),
}

export const consultationAPI = {
  getConsultations: () => apiClient.get('/consultations'),
  getConsultation: (id) => apiClient.get(`/consultations/${id}`),
  createConsultation: (data) => apiClient.post('/consultations', data),
  updateConsultation: (id, data) => apiClient.put(`/consultations/${id}`, data),
  deleteConsultation: (id) => apiClient.delete(`/consultations/${id}`),
}

export const slotAPI = {
  getSlots: (staffId) => apiClient.get(`/slots?staffId=${staffId}`),
  getSlot: (id) => apiClient.get(`/slots/${id}`),
  createSlot: (data) => apiClient.post('/slots', data),
  updateSlot: (id, data) => apiClient.put(`/slots/${id}`, data),
  deleteSlot: (id) => apiClient.delete(`/slots/${id}`),
}

export const bookingAPI = {
  getBookings: () => apiClient.get('/bookings'),
  getBooking: (id) => apiClient.get(`/bookings/${id}`),
  createBooking: (data) => apiClient.post('/bookings', data),
  updateBooking: (id, data) => apiClient.put(`/bookings/${id}`, data),
  deleteBooking: (id) => apiClient.delete(`/bookings/${id}`),
}

export default apiClient
