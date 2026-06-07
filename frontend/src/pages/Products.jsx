import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useProducts, useDeleteProduct, useExportProducts } from '@/hooks/useProducts'
import { ProductTable } from '@/components/ProductTable'
import { ProductDialog } from '@/components/ProductDialog'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import { debounce } from '@/lib/utils'
import { Plus, Search, Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function Products() {
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [sortBy, setSortBy] = useState('id')
  const [sortDir, setSortDir] = useState('asc')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)

  // Debounced search
  const debouncedSetSearch = useMemo(
    () => debounce((value) => {
      setDebouncedSearch(value)
      setPage(0) // Reset to first page when searching
    }, 300),
    []
  )

  React.useEffect(() => {
    debouncedSetSearch(search)
  }, [search, debouncedSetSearch])

  // Query parameters
  const queryParams = {
    page,
    size,
    sortBy,
    sortDir,
    ...(debouncedSearch && { search: debouncedSearch })
  }

  // Hooks
  const { data: productsData, isLoading, error } = useProducts(queryParams)
  const deleteProductMutation = useDeleteProduct()
  const exportMutation = useExportProducts()

  // Handlers
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
    setPage(0)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  const handlePageSizeChange = (newSize) => {
    setSize(newSize)
    setPage(0)
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
  }

  const handleDelete = (product) => {
    setDeletingProduct(product)
  }

  const confirmDelete = async () => {
    if (deletingProduct) {
      try {
        await deleteProductMutation.mutateAsync(deletingProduct.id)
        setDeletingProduct(null)
      } catch (error) {
        // Error is handled by the mutation
      }
    }
  }

  const handleExport = async () => {
    try {
      await exportMutation.mutateAsync()
    } catch (error) {
      // Error is handled by the mutation
    }
  }

  const handleDialogClose = () => {
    setIsCreateDialogOpen(false)
    setEditingProduct(null)
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <p className="text-destructive">Failed to load products. Please try again.</p>
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleExport}
            variant="outline"
            disabled={exportMutation.isPending}
            className="w-full sm:w-auto"
          >
            {exportMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export CSV
          </Button>
          
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>Search Products</CardTitle>
          <CardDescription>
            Search by product name or category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Products 
            {productsData && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({productsData.totalElements} total)
              </span>
            )}
          </CardTitle>
          <CardDescription>
            {debouncedSearch ? (
              `Showing results for "${debouncedSearch}"`
            ) : (
              'All products in your inventory'
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductTable
            data={productsData}
            isLoading={isLoading}
            sortBy={sortBy}
            sortDir={sortDir}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            currentPage={page}
            pageSize={size}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <ProductDialog
        open={isCreateDialogOpen || !!editingProduct}
        onOpenChange={handleDialogClose}
        product={editingProduct}
        mode={editingProduct ? 'edit' : 'create'}
      />

      <DeleteConfirmDialog
        open={!!deletingProduct}
        onOpenChange={() => setDeletingProduct(null)}
        onConfirm={confirmDelete}
        productName={deletingProduct?.name}
        isLoading={deleteProductMutation.isPending}
      />
    </div>
  )
}
