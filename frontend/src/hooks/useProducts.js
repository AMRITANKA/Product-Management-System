import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi } from '@/services/api'
import { toast } from 'sonner'

// Query keys
export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT: 'product',
  CATEGORIES: 'categories',
  DASHBOARD_STATS: 'dashboardStats',
  LOW_STOCK: 'lowStock',
}

// Get all products with pagination and search
export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS, params],
    queryFn: () => productApi.getProducts(params),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single product
export const useProduct = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCT, id],
    queryFn: () => productApi.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// Get categories
export const useCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.CATEGORIES],
    queryFn: productApi.getCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Get dashboard stats
export const useDashboardStats = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_STATS],
    queryFn: productApi.getDashboardStats,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

// Get low stock products
export const useLowStockProducts = (threshold = 10) => {
  return useQuery({
    queryKey: [QUERY_KEYS.LOW_STOCK, threshold],
    queryFn: () => productApi.getLowStockProducts(threshold),
    staleTime: 5 * 60 * 1000,
  })
}

// Create product mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productApi.createProduct,
    onSuccess: (data) => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] })
      
      toast.success('Product created successfully!')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to create product'
      toast.error(message)
    },
  })
}

// Update product mutation
export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, product }) => productApi.updateProduct(id, product),
    onSuccess: (data, variables) => {
      // Update the specific product in cache
      queryClient.setQueryData([QUERY_KEYS.PRODUCT, variables.id], data)
      
      // Invalidate products list to reflect changes
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] })
      
      toast.success('Product updated successfully!')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to update product'
      toast.error(message)
    },
  })
}

// Delete product mutation
export const useDeleteProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: productApi.deleteProduct,
    onSuccess: (_, deletedId) => {
      // Remove the product from cache
      queryClient.removeQueries({ queryKey: [QUERY_KEYS.PRODUCT, deletedId] })
      
      // Invalidate products list
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PRODUCTS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DASHBOARD_STATS] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] })
      
      toast.success('Product deleted successfully!')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to delete product'
      toast.error(message)
    },
  })
}

// Export to CSV mutation
export const useExportProducts = () => {
  return useMutation({
    mutationFn: productApi.exportToCSV,
    onSuccess: (data) => {
      // Create download link
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'products.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      toast.success('Products exported successfully!')
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Failed to export products'
      toast.error(message)
    },
  })
}
