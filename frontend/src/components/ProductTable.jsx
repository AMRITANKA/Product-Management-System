import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Edit, Trash2, ChevronUp, ChevronDown, Loader2, Package } from 'lucide-react'
import { TableSkeleton } from '@/components/TableSkeleton'

const SortButton = ({ children, sortBy, sortDir, field, onSort }) => {
  const isActive = sortBy === field
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium"
      onClick={() => onSort(field)}
    >
      {children}
      {isActive && (
        sortDir === 'asc' ? (
          <ChevronUp className="ml-1 h-3 w-3" />
        ) : (
          <ChevronDown className="ml-1 h-3 w-3" />
        )
      )}
    </Button>
  )
}

const Pagination = ({ 
  currentPage, 
  totalPages, 
  pageSize, 
  totalElements,
  onPageChange, 
  onPageSizeChange 
}) => {
  const startItem = currentPage * pageSize + 1
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements)
  
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">
          Showing {startItem} to {endItem} of {totalElements} results
        </span>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
            <SelectTrigger className="w-16">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

const EmptyState = ({ hasSearch }) => (
  <div className="text-center py-12">
    <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
      <Package className="h-12 w-12 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-2">
      {hasSearch ? 'No products found' : 'No products yet'}
    </h3>
    <p className="text-muted-foreground mb-4">
      {hasSearch 
        ? 'Try adjusting your search terms or filters.'
        : 'Get started by adding your first product to the inventory.'
      }
    </p>
  </div>
)

export function ProductTable({
  data,
  isLoading,
  sortBy,
  sortDir,
  onSort,
  onEdit,
  onDelete,
  onPageChange,
  onPageSizeChange,
  currentPage,
  pageSize
}) {
  if (isLoading) {
    return <TableSkeleton />
  }

  if (!data || !data.content || data.content.length === 0) {
    return <EmptyState hasSearch={false} />
  }

  const { content: products, totalPages, totalElements } = data

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton sortBy={sortBy} sortDir={sortDir} field="id" onSort={onSort}>
                  ID
                </SortButton>
              </TableHead>
              <TableHead>
                <SortButton sortBy={sortBy} sortDir={sortDir} field="name" onSort={onSort}>
                  Name
                </SortButton>
              </TableHead>
              <TableHead>
                <SortButton sortBy={sortBy} sortDir={sortDir} field="category" onSort={onSort}>
                  Category
                </SortButton>
              </TableHead>
              <TableHead>
                <SortButton sortBy={sortBy} sortDir={sortDir} field="price" onSort={onSort}>
                  Price
                </SortButton>
              </TableHead>
              <TableHead>
                <SortButton sortBy={sortBy} sortDir={sortDir} field="quantity" onSort={onSort}>
                  Quantity
                </SortButton>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead>
                <SortButton sortBy={sortBy} sortDir={sortDir} field="createdAt" onSort={onSort}>
                  Created
                </SortButton>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{product.name}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(product.price)}
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    product.quantity < 10 
                      ? 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
                      : product.quantity < 50
                      ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300'
                      : 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
                  }`}>
                    {product.quantity}
                  </span>
                </TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={product.description}>
                    {product.description || 'No description'}
                  </div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(product.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(product)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(product)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalElements={totalElements}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
