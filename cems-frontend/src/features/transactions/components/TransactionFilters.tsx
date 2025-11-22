import { Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import type { TransactionFilters } from '@/types/transaction.types'
import { useBranchSelection } from '@/contexts/BranchContext'
import { useActiveCurrencies } from '@/hooks/useCurrencies'
import { formatBranchLabel } from '@/utils/branch'

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
  const { availableBranches, currentBranchId } = useBranchSelection()
  const { data: currencies } = useActiveCurrencies()

  const handleFilterChange = (key: keyof TransactionFilters, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value === '' ? undefined : value,
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
          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <select
              value={filters.transaction_type || ''}
              onChange={(e) => handleFilterChange('transaction_type', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="exchange">Exchange</option>
              <option value="transfer">Transfer</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              value={filters.status_filter || ''}
              onChange={(e) => handleFilterChange('status_filter', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Branch */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Branch</label>
            <select
              value={filters.branch_id || ''}
              onChange={(e) => handleFilterChange('branch_id', e.target.value || currentBranchId || '')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Branches</option>
              {availableBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {formatBranchLabel({ id: branch.id, code: branch.code ?? '', name: branch.name ?? branch.code ?? '' })}
                </option>
              ))}
            </select>
          </div>

          {/* Currency */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Currency</label>
            <select
              value={filters.currency_id || ''}
              onChange={(e) => handleFilterChange('currency_id', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All Currencies</option>
              {currencies?.data?.map((currency) => (
                <option key={currency.id} value={currency.id}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          {/* Customer */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Customer ID</label>
            <Input
              placeholder="Customer UUID"
              value={filters.customer_id || ''}
              onChange={(e) => handleFilterChange('customer_id', e.target.value)}
            />
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

          {/* Amount Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Amount Min</label>
            <Input
              type="number"
              min={0}
              value={filters.amount_min ?? ''}
              onChange={(e) =>
                handleFilterChange('amount_min', e.target.value ? Number(e.target.value) : '')
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Amount Max</label>
            <Input
              type="number"
              min={0}
              value={filters.amount_max ?? ''}
              onChange={(e) =>
                handleFilterChange('amount_max', e.target.value ? Number(e.target.value) : '')
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
