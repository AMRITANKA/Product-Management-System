import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateProduct, useUpdateProduct, useCategories } from '@/hooks/useProducts'
import { Loader2 } from 'lucide-react'

// Validation schema
const productSchema = z.object({
  name: z.string()
    .min(2, 'Product name must be at least 2 characters')
    .max(100, 'Product name must not exceed 100 characters'),
  category: z.string()
    .min(2, 'Category must be at least 2 characters')
    .max(50, 'Category must not exceed 50 characters'),
  price: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Price must be a positive number'
    })
    .transform((val) => Number(val)),
  quantity: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0 && Number.isInteger(Number(val)), {
      message: 'Quantity must be a non-negative integer'
    })
    .transform((val) => Number(val)),
  description: z.string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
})

export function ProductDialog({ open, onOpenChange, product, mode = 'create' }) {
  const { data: categories = [] } = useCategories()
  const createProductMutation = useCreateProduct()
  const updateProductMutation = useUpdateProduct()
  
  const isLoading = createProductMutation.isPending || updateProductMutation.isPending
  const isEdit = mode === 'edit' && product

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      category: '',
      price: '',
      quantity: '',
      description: '',
    },
  })

  const watchedCategory = watch('category')

  // Reset form when dialog opens/closes or product changes
  React.useEffect(() => {
    if (open) {
      if (isEdit) {
        reset({
          name: product.name || '',
          category: product.category || '',
          price: product.price?.toString() || '',
          quantity: product.quantity?.toString() || '',
          description: product.description || '',
        })
      } else {
        reset({
          name: '',
          category: '',
          price: '',
          quantity: '',
          description: '',
        })
      }
    }
  }, [open, isEdit, product, reset])

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updateProductMutation.mutateAsync({
          id: product.id,
          product: data,
        })
      } else {
        await createProductMutation.mutateAsync(data)
      }
      onOpenChange(false)
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  }

  const handleCategorySelect = (value) => {
    setValue('category', value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Product' : 'Create New Product'}
          </DialogTitle>
          <DialogDescription>
            {isEdit 
              ? 'Update the product information below.'
              : 'Add a new product to your inventory.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              placeholder="Enter product name"
              {...register('name')}
              className={errors.name ? 'border-destructive' : ''}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={watchedCategory} onValueChange={handleCategorySelect}>
              <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select or type a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Or type a new category"
              value={watchedCategory}
              onChange={(e) => setValue('category', e.target.value)}
              className={errors.category ? 'border-destructive' : ''}
            />
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                {...register('price')}
                className={errors.price ? 'border-destructive' : ''}
              />
              {errors.price && (
                <p className="text-sm text-destructive">{errors.price.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                placeholder="0"
                {...register('quantity')}
                className={errors.quantity ? 'border-destructive' : ''}
              />
              {errors.quantity && (
                <p className="text-sm text-destructive">{errors.quantity.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter product description (optional)"
              rows={3}
              {...register('description')}
              className={errors.description ? 'border-destructive' : ''}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Update Product' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
