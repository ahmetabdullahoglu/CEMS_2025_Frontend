import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCustomer } from '@/hooks/useCustomers'
import CustomerInfo from '../components/CustomerInfo'
import CustomerTransactions from '../components/CustomerTransactions'
import DocumentUpload from '../components/DocumentUpload'
import CustomerDialog from '../components/CustomerDialog'

export default function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const customerId = id || ''

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { data: customer, isLoading, isError, error } = useCustomer(customerId, !!customerId)

  const handleBack = () => {
    navigate('/customers')
  }

  const handleEdit = () => {
    setIsEditDialogOpen(true)
  }

  if (!customerId) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-destructive font-semibold">Invalid Customer ID</p>
              <Button className="mt-4" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Customers
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-10">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="ml-3 text-sm text-muted-foreground">Loading customer details...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isError || !customer) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <p className="text-destructive font-semibold">Error Loading Customer</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error instanceof Error ? error.message : 'Failed to load customer details'}
              </p>
              <Button className="mt-4" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Customers
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {customer.first_name} {customer.last_name}
            </h1>
            <p className="text-muted-foreground">Customer #: {customer.customer_number}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">Information</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <CustomerInfo customer={customer} onEdit={handleEdit} />
        </TabsContent>

        <TabsContent value="transactions">
          <CustomerTransactions customerId={customerId} />
        </TabsContent>

        <TabsContent value="documents">
          <DocumentUpload customerId={customerId} />
        </TabsContent>
      </Tabs>

      {/* Edit Dialog */}
      <CustomerDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        customer={customer}
      />
    </div>
  )
}
