import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateCustomer, useUpdateCustomer } from '@/hooks/useCustomers'
import { useAuth } from '@/contexts/useAuth'
import { useBranchSelection } from '@/contexts/BranchContext'
import type { Customer, CustomerType, RiskLevel } from '@/types/customer.types'

// Schema matching CustomerCreate from API
const customerSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  name_ar: z.string().optional(),
  national_id: z.string().optional(),
  passport_number: z.string().optional(),
  phone_number: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  date_of_birth: z.string().min(1, 'Date of birth is required'), // YYYY-MM-DD format
  nationality: z.string().min(1, 'Nationality is required'),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().min(1, 'Country is required'),
  customer_type: z.enum(['individual', 'corporate']),
  risk_level: z.enum(['low', 'medium', 'high']).optional(),
})

type CustomerFormData = z.infer<typeof customerSchema>

interface CustomerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer | null
}

const CUSTOMER_TYPES: { value: CustomerType; label: string }[] = [
  { value: 'individual', label: 'Individual' },
  { value: 'corporate', label: 'Corporate' },
]

const RISK_LEVELS: { value: RiskLevel; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

export default function CustomerDialog({ open, onOpenChange, customer }: CustomerDialogProps) {
  const { mutate: createCustomer, isPending: isCreating } = useCreateCustomer()
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer()
  const { user } = useAuth()
  const { currentBranchId } = useBranchSelection()

  const isEditMode = !!customer
  const isPending = isCreating || isUpdating

  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      name_ar: '',
      national_id: '',
      passport_number: '',
      phone_number: '',
      email: '',
      date_of_birth: '',
      nationality: '',
      address: '',
      city: '',
      country: '',
      customer_type: 'individual',
      risk_level: 'low',
    },
  })

  // Update form when customer changes
  useEffect(() => {
    if (customer && open) {
      form.reset({
        first_name: customer.first_name,
        last_name: customer.last_name,
        name_ar: customer.name_ar || '',
        national_id: customer.national_id || '',
        passport_number: customer.passport_number || '',
        phone_number: customer.phone_number,
        email: customer.email || '',
        date_of_birth: customer.date_of_birth,
        nationality: customer.nationality,
        address: customer.address || '',
        city: customer.city || '',
        country: customer.country,
        customer_type: customer.customer_type,
        risk_level: customer.risk_level,
      })
    } else if (!open) {
      form.reset()
    }
  }, [customer, open, form])

  const onSubmit = (data: CustomerFormData) => {
    const payload = {
      ...data,
      email: data.email || null,
      name_ar: data.name_ar || null,
      national_id: data.national_id || null,
      passport_number: data.passport_number || null,
      address: data.address || null,
      city: data.city || null,
      branch_id: currentBranchId || user?.branches?.[0]?.id || '',
      risk_level: data.risk_level || 'low',
    }

    if (isEditMode && customer) {
      updateCustomer(
        { id: customer.id, data: payload },
        {
          onSuccess: () => {
            onOpenChange(false)
          },
        }
      )
    } else {
      createCustomer(payload, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? 'Update customer information below.'
              : 'Fill in the customer information below.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* First Name and Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Customer Type */}
            <FormField
              control={form.control}
              name="customer_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select customer type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CUSTOMER_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* National ID and Passport */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="national_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>National ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter national ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="passport_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Passport Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter passport number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Phone and Email */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="date_of_birth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Nationality and Country */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nationality *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter nationality" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter country" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* City and Address */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Risk Level */}
            <FormField
              control={form.control}
              name="risk_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Risk Level</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select risk level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {RISK_LEVELS.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditMode ? 'Update Customer' : 'Create Customer'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
