import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, ArrowRight } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useActiveCurrencies } from '@/hooks/useCurrencies'
import { useBranches, useCreateTransfer } from '@/hooks/useTransactions'

// Schema matching TransferTransactionCreate from API
const transferSchema = z.object({
  from_branch_id: z.string().uuid('Please select a from branch'),
  to_branch_id: z.string().uuid('Please select a to branch'),
  currency_id: z.string().uuid('Please select a currency'),
  amount: z.number().positive('Amount must be positive').min(0.01, 'Amount must be at least 0.01'),
  notes: z.string().optional(),
  reference_number: z.string().optional(),
})

type TransferFormData = z.infer<typeof transferSchema>

interface TransferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TransferDialog({ open, onOpenChange }: TransferDialogProps) {
  const { data: currencies, isLoading: currenciesLoading } = useActiveCurrencies()
  const { data: branches, isLoading: branchesLoading } = useBranches()
  const { mutate: createTransfer, isPending: isCreating } = useCreateTransfer()

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      from_branch_id: '',
      to_branch_id: '',
      currency_id: '',
      amount: 0,
      notes: '',
      reference_number: '',
    },
  })

  const fromBranchId = form.watch('from_branch_id')
  const toBranchId = form.watch('to_branch_id')

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  const onSubmit = (data: TransferFormData) => {
    if (data.from_branch_id === data.to_branch_id) {
      form.setError('to_branch_id', {
        message: 'From and To branches cannot be the same',
      })
      return
    }

    createTransfer(data, {
      onSuccess: () => {
        onOpenChange(false)
        form.reset()
      },
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Transfer Transaction</DialogTitle>
          <DialogDescription>
            Transfer funds between branches. Enter the details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* From Branch */}
            <FormField
              control={form.control}
              name="from_branch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Branch *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branchesLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        branches?.map((branch) => (
                          <SelectItem
                            key={branch.id}
                            value={branch.id}
                            disabled={branch.id === toBranchId}
                          >
                            {branch.name} ({branch.code})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Transfer Arrow Indicator */}
            {fromBranchId && toBranchId && (
              <div className="flex items-center justify-center py-2">
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            )}

            {/* To Branch */}
            <FormField
              control={form.control}
              name="to_branch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Branch *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {branchesLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        branches?.map((branch) => (
                          <SelectItem
                            key={branch.id}
                            value={branch.id}
                            disabled={branch.id === fromBranchId}
                          >
                            {branch.name} ({branch.code})
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Currency */}
            <FormField
              control={form.control}
              name="currency_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {currenciesLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        currencies?.map((currency) => (
                          <SelectItem key={currency.id} value={currency.id}>
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={field.value}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reference Number */}
            <FormField
              control={form.control}
              name="reference_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference Number (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter reference number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any additional notes"
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Transfer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
