import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import { useCustomers, useDeleteCustomer } from '@/hooks/useCustomers'
import CustomerTable from '../components/CustomerTable'
import CustomerDialog from '../components/CustomerDialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import type { Customer } from '@/types/customer.types'

export default function CustomersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [sortBy, setSortBy] = useState<string>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const queryParams = {
    page,
    page_size: pageSize,
    sort_by: sortBy,
    sort_order: sortOrder,
    search: search || undefined,
  }

  const { data, isLoading, isError, error } = useCustomers(queryParams)
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer()

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
  }

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleAddCustomer = () => {
    setSelectedCustomer(null)
    setIsDialogOpen(true)
  }

  const handleViewCustomer = (customerId: string) => {
    navigate(`/customers/${customerId}`)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDialogOpen(true)
  }

  const handleDeleteCustomer = (customerId: string) => {
    setShowDeleteConfirm(customerId)
  }

  const confirmDelete = () => {
    if (showDeleteConfirm) {
      deleteCustomer(showDeleteConfirm, {
        onSuccess: () => {
          setShowDeleteConfirm(null)
        },
      })
    }
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage customer information</p>
        </div>
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-destructive font-semibold">Error Loading Customers</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error instanceof Error ? error.message : 'Failed to load customers'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalPages = data?.total_pages || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground">Manage customer information</p>
        </div>
        <Button onClick={handleAddCustomer}>
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="py-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search customers by name, ID number, phone, or email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pl-9"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
            {search && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearch('')
                  setSearchInput('')
                  setPage(1)
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      {data && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {data.customers.length > 0 ? (page - 1) * pageSize + 1 : 0} to{' '}
            {Math.min(page * pageSize, data.total)} of {data.total} customers
          </div>
        </div>
      )}

      {/* Table */}
      <CustomerTable
        customers={data?.customers || []}
        sortBy={sortBy}
        onSort={handleSort}
        onView={handleViewCustomer}
        onEdit={handleEditCustomer}
        onDelete={handleDeleteCustomer}
        isLoading={isLoading}
      />

      {/* Pagination */}
      {data && totalPages > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (page <= 3) {
                      pageNum = i + 1
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = page - 2 + i
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className="w-8"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-semibold">Delete Customer</h3>
                  <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this customer? This action cannot be undone.
                  </p>
                  <div className="flex gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(null)}
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={confirmDelete}
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Customer Dialog */}
      <CustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        customer={selectedCustomer}
      />
    </div>
  )
}
