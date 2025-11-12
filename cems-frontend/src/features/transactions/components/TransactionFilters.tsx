import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import type { TransactionFilters } from '@/types/transaction.types'

interface TransactionFiltersProps {
  filters: TransactionFilters
  onFiltersChange: (filters: TransactionFilters) => void
  onReset: () => void
}

export default function TransactionFiltersComponent({
  filters,
  onFiltersChange,
  onReset,
}: TransactionFiltersProps) {
  const handleFilterChange = (key: keyof TransactionFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    })
  }

  const hasActiveFilters = Object.values(filters).some((value) => value !== undefined && value !== '')

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold">Filters</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onReset} className="ml-auto">
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Customer, ID..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <select
              value={filters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Types</option>
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date From */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date From</label>
            <Input
              type="date"
              value={filters.date_from || ''}
              onChange={(e) => handleFilterChange('date_from', e.target.value)}
            />
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date To</label>
            <Input
              type="date"
              value={filters.date_to || ''}
              onChange={(e) => handleFilterChange('date_to', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
