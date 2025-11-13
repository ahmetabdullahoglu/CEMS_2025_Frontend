import { format } from 'date-fns'
import { Mail, Phone, MapPin, CreditCard, Calendar, Edit, User, Globe, Shield, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Customer } from '@/types/customer.types'

interface CustomerInfoProps {
  customer: Customer
  onEdit: () => void
}

export default function CustomerInfo({ customer, onEdit }: CustomerInfoProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Customer Information</CardTitle>
              <div className="flex gap-2">
                <Badge variant={customer.is_active ? "default" : "secondary"}>
                  {customer.is_active ? (
                    <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                  ) : (
                    <><XCircle className="w-3 h-3 mr-1" /> Inactive</>
                  )}
                </Badge>
                <Badge variant={customer.is_verified ? "default" : "secondary"}>
                  {customer.is_verified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </div>
            <Button onClick={onEdit} size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Number */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Customer Number</label>
              <p className="text-lg font-semibold mt-1">{customer.customer_number}</p>
            </div>

            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <p className="text-lg font-semibold mt-1">
                {customer.first_name} {customer.last_name}
              </p>
            </div>

            {/* Arabic Name */}
            {customer.name_ar && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Arabic Name</label>
                <p className="text-lg mt-1" dir="rtl">{customer.name_ar}</p>
              </div>
            )}

            {/* Customer Type */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Customer Type</label>
              <p className="text-lg mt-1 capitalize">{customer.customer_type}</p>
            </div>

            {/* National ID */}
            {customer.national_id && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  National ID
                </label>
                <p className="text-lg font-mono mt-1">{customer.national_id}</p>
              </div>
            )}

            {/* Passport Number */}
            {customer.passport_number && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Passport Number
                </label>
                <p className="text-lg font-mono mt-1">{customer.passport_number}</p>
              </div>
            )}

            {/* Date of Birth */}
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </label>
              <p className="text-lg mt-1">
                {format(new Date(customer.date_of_birth), 'PPP')}
              </p>
            </div>

            {/* Nationality */}
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Nationality
              </label>
              <p className="text-lg mt-1">{customer.nationality}</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <p className="text-lg mt-1">{customer.phone_number}</p>
            </div>

            {/* Email */}
            {customer.email && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <p className="text-lg mt-1">{customer.email}</p>
              </div>
            )}

            {/* Country */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Country</label>
              <p className="text-lg mt-1">{customer.country}</p>
            </div>

            {/* City */}
            {customer.city && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">City</label>
                <p className="text-lg mt-1">{customer.city}</p>
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

            {/* Risk Level */}
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Risk Level
              </label>
              <p className="text-lg mt-1">
                <Badge
                  variant={
                    customer.risk_level === 'low' ? 'default' :
                    customer.risk_level === 'medium' ? 'secondary' :
                    'destructive'
                  }
                  className="capitalize"
                >
                  {customer.risk_level}
                </Badge>
              </p>
            </div>
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
                Registered At
              </label>
              <p className="text-lg mt-1">
                {format(new Date(customer.registered_at), 'PPpp')}
              </p>
            </div>

            {customer.verified_at && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Verified At
                </label>
                <p className="text-lg mt-1">
                  {format(new Date(customer.verified_at), 'PPpp')}
                </p>
              </div>
            )}

            {customer.last_transaction_date && (
              <div>
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Last Transaction
                </label>
                <p className="text-lg mt-1">
                  {format(new Date(customer.last_transaction_date), 'PPpp')}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Created At
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
