import { ArrowUpDown, Edit, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Customer } from '@/types/customer.types'
import { cn } from '@/lib/utils'

interface CustomerTableProps {
  customers: Customer[]
  sortBy?: string
  onSort: (field: string) => void
  onView?: (customerId: string) => void
  onEdit: (customer: Customer) => void
  onDelete: (customerId: string) => void
  isLoading?: boolean
}

export default function CustomerTable({
  customers,
  sortBy,
  onSort,
  onView,
  onEdit,
  onDelete,
  isLoading,
}: CustomerTableProps) {
  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onSort(field)}
      className={cn('h-8 -ml-3 hover:bg-transparent', sortBy === field && 'text-primary')}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="flex items-center justify-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
            <p className="ml-3 text-sm text-muted-foreground">Loading customers...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (customers.length === 0) {
    return (
      <Card>
        <CardContent className="py-10">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No customers found</p>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search or add a new customer
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortButton field="customer_number">Customer #</SortButton>
              </TableHead>
              <TableHead>
                <SortButton field="first_name">Name</SortButton>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>National ID</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>
                <SortButton field="created_at">Created</SortButton>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.customer_number}</TableCell>
                <TableCell className="font-medium">
                  {onView ? (
                    <button
                      onClick={() => onView(customer.id)}
                      className="hover:text-primary hover:underline text-left"
                    >
                      {customer.first_name} {customer.last_name}
                    </button>
                  ) : (
                    `${customer.first_name} ${customer.last_name}`
                  )}
                </TableCell>
                <TableCell className="capitalize">{customer.customer_type}</TableCell>
                <TableCell>{customer.national_id || customer.passport_number || 'N/A'}</TableCell>
                <TableCell>{customer.phone_number}</TableCell>
                <TableCell>{customer.email || 'N/A'}</TableCell>
                <TableCell>
                  {new Date(customer.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(customer)}
                    title="Edit Customer"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(customer.id)}
                    title="Delete Customer"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
