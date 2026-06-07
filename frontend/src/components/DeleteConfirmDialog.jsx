import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Loader2 } from 'lucide-react'

export function DeleteConfirmDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  productName, 
  isLoading = false 
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span>Delete Product</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <strong>"{productName}"</strong>?
            <br />
            <br />
            This action cannot be undone. The product will be permanently removed from your inventory.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
