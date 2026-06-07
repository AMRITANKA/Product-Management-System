import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const SkeletonRow = () => (
  <TableRow>
    <TableCell>
      <div className="h-4 w-8 bg-muted animate-skeleton rounded" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-32 bg-muted animate-skeleton rounded" />
    </TableCell>
    <TableCell>
      <div className="h-6 w-20 bg-muted animate-skeleton rounded-full" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-16 bg-muted animate-skeleton rounded" />
    </TableCell>
    <TableCell>
      <div className="h-6 w-12 bg-muted animate-skeleton rounded-full" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-48 bg-muted animate-skeleton rounded" />
    </TableCell>
    <TableCell>
      <div className="h-4 w-24 bg-muted animate-skeleton rounded" />
    </TableCell>
    <TableCell>
      <div className="flex justify-end space-x-2">
        <div className="h-8 w-8 bg-muted animate-skeleton rounded" />
        <div className="h-8 w-8 bg-muted animate-skeleton rounded" />
      </div>
    </TableCell>
  </TableRow>
)

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-between items-center pt-4">
        <div className="h-4 w-48 bg-muted animate-skeleton rounded" />
        <div className="flex items-center space-x-4">
          <div className="h-4 w-24 bg-muted animate-skeleton rounded" />
          <div className="h-8 w-16 bg-muted animate-skeleton rounded" />
          <div className="h-8 w-20 bg-muted animate-skeleton rounded" />
          <div className="h-8 w-16 bg-muted animate-skeleton rounded" />
        </div>
      </div>
    </div>
  )
}
