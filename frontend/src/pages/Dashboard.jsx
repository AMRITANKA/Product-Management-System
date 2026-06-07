import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useDashboardStats, useLowStockProducts } from '@/hooks/useProducts'
import { formatCurrency } from '@/lib/utils'
import { Package, ShoppingCart, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const StatCard = ({ title, value, description, icon: Icon, isLoading }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-muted-foreground">Loading...</span>
            </div>
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

const LowStockAlert = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <span>Low Stock Alert</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-muted-foreground">Loading low stock products...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!products || products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-green-600" />
            <span>Stock Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-green-600">All products are well stocked! 🎉</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <span>Low Stock Alert</span>
        </CardTitle>
        <CardDescription>
          {products.length} product{products.length > 1 ? 's' : ''} running low on stock
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {products.slice(0, 5).map((product) => (
            <div key={product.id} className="flex justify-between items-center p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-orange-600">{product.quantity} left</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(product.price)}</p>
              </div>
            </div>
          ))}
          {products.length > 5 && (
            <p className="text-sm text-muted-foreground text-center pt-2">
              +{products.length - 5} more products with low stock
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: lowStockProducts, isLoading: lowStockLoading } = useLowStockProducts(10)

  if (statsError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your product inventory</p>
        </div>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Failed to load dashboard data. Please check your connection and try again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your product inventory</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          description="Products in inventory"
          icon={Package}
          isLoading={statsLoading}
        />
        <StatCard
          title="Categories"
          value={stats?.totalCategories || 0}
          description="Product categories"
          icon={ShoppingCart}
          isLoading={statsLoading}
        />
        <StatCard
          title="Total Quantity"
          value={stats?.totalQuantity || 0}
          description="Items in stock"
          icon={TrendingUp}
          isLoading={statsLoading}
        />
        <StatCard
          title="Inventory Value"
          value={stats?.inventoryValue ? formatCurrency(stats.inventoryValue) : '$0.00'}
          description="Total inventory worth"
          icon={TrendingUp}
          isLoading={statsLoading}
        />
      </div>

      {/* Low Stock Alert */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-1">
        <LowStockAlert products={lowStockProducts} isLoading={lowStockLoading} />
      </div>
    </div>
  )
}
