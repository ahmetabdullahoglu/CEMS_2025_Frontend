import { format } from 'date-fns'
import { Mail, Phone, MapPin, CreditCard, Calendar, Edit } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Customer } from '@/types/customer.types'

interface CustomerInfoProps {
  customer: Customer
  onEdit: () => void
}

const ID_TYPE_LABELS: Record<string, string> = {
  national_id: 'National ID',
  passport: 'Passport',
  driving_license: 'Driving License',
  other: 'Other',
}

export default function CustomerInfo({ customer, onEdit }: CustomerInfoProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customer Information</CardTitle>
            <Button onClick={onEdit} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Full Name</label>
              <p className="text-lg font-semibold mt-1">{customer.name}</p>
            </div>

            {/* ID Type */}
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                ID Type
              </label>
              <p className="text-lg mt-1">{ID_TYPE_LABELS[customer.id_type] || customer.id_type}</p>
            </div>

            {/* ID Number */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">ID Number</label>
              <p className="text-lg font-mono mt-1">{customer.id_number}</p>
            </div>

            {/* Phone */}
            {customer.phone && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </label>
                <p className="text-lg mt-1">{customer.phone}</p>
              </div>
            )}

            {/* Email */}
            {customer.email && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-lg mt-1">{customer.email}</p>
              </div>
            )}

            {/* Address */}
            {customer.address && (
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                <p className="text-lg mt-1">{customer.address}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metadata Card */}
      <Card>
        <CardHeader>
          <CardTitle>Record Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Created
              </label>
              <p className="text-lg mt-1">
                {format(new Date(customer.created_at), 'PPpp')}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Last Updated
              </label>
              <p className="text-lg mt-1">
                {format(new Date(customer.updated_at), 'PPpp')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
