import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status)
    return response
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Product API functions
export const productApi = {
  // Get all products with pagination and search
  getProducts: async (params = {}) => {
    const { data } = await api.get('/products', { params })
    return data
  },

  // Get product by ID
  getProduct: async (id) => {
    const { data } = await api.get(`/products/${id}`)
    return data
  },

  // Create new product
  createProduct: async (product) => {
    const { data } = await api.post('/products', product)
    return data
  },

  // Update product
  updateProduct: async (id, product) => {
    const { data } = await api.put(`/products/${id}`, product)
    return data
  },

  // Delete product
  deleteProduct: async (id) => {
    await api.delete(`/products/${id}`)
  },

  // Get products by category
  getProductsByCategory: async (category, params = {}) => {
    const { data } = await api.get(`/products/category/${category}`, { params })
    return data
  },

  // Get products by price range
  getProductsByPriceRange: async (minPrice, maxPrice, params = {}) => {
    const { data } = await api.get('/products/price-range', {
      params: { minPrice, maxPrice, ...params }
    })
    return data
  },

  // Get all categories
  getCategories: async () => {
    const { data } = await api.get('/products/categories')
    return data
  },

  // Get low stock products
  getLowStockProducts: async (threshold = 10) => {
    const { data } = await api.get('/products/low-stock', {
      params: { threshold }
    })
    return data
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    const { data } = await api.get('/products/dashboard')
    return data
  },

  // Export products to CSV
  exportToCSV: async () => {
    const response = await api.get('/products/export/csv', {
      responseType: 'blob'
    })
    return response.data
  }
}

export default api
