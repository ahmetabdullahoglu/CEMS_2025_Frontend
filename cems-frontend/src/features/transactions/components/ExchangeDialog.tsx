import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, TrendingDown } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { useActiveCurrencies, useExchangeRate, useCreateExchange } from '@/hooks/useCurrencies'
import { useBranchSelection } from '@/contexts/BranchContext'
import { formatBranchLabel } from '@/utils/branch'

const exchangeSchema = z.object({
  branch_id: z.string().uuid('Please select a branch'),
  from_currency_id: z.string().uuid('Please select a currency'),
  to_currency_id: z.string().uuid('Please select a currency'),
  from_amount: z.number().positive('Amount must be positive').min(0.01, 'Amount must be at least 0.01'),
  exchange_rate: z.number().positive('Exchange rate must be positive').optional(),
  commission_percentage: z.number().min(0, 'Commission cannot be negative').optional(),
  customer_id: z.string().uuid('Invalid customer').optional().or(z.literal('')),
  description: z.string().optional(),
  notes: z.string().optional(),
  reference_number: z.string().optional(),
})

type ExchangeFormData = z.infer<typeof exchangeSchema>

interface ExchangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ExchangeDialog({ open, onOpenChange }: ExchangeDialogProps) {
  const { data: currencies, isLoading: currenciesLoading } = useActiveCurrencies()
  const { availableBranches: branches, currentBranchId, isLoading: branchesLoading } =
    useBranchSelection()
  const { mutate: createExchange, isPending: isCreating } = useCreateExchange()

  const form = useForm<ExchangeFormData>({
    resolver: zodResolver(exchangeSchema),
    defaultValues: {
      branch_id: currentBranchId ?? '',
      from_currency_id: '',
      to_currency_id: '',
      from_amount: 0,
      exchange_rate: undefined,
      commission_percentage: undefined,
      customer_id: '',
      description: '',
      notes: '',
      reference_number: '',
    },
  })

  const fromCurrencyId = form.watch('from_currency_id')
  const toCurrencyId = form.watch('to_currency_id')
  const fromAmount = form.watch('from_amount')
  const manualRate = form.watch('exchange_rate')

  const selectedFromCurrency = currencies?.find((currency) => currency.id === fromCurrencyId)
  const selectedToCurrency = currencies?.find((currency) => currency.id === toCurrencyId)

  const { data: exchangeRate, isLoading: rateLoading } = useExchangeRate(
    selectedFromCurrency?.code,
    selectedToCurrency?.code
  )

  useEffect(() => {
    if (exchangeRate?.rate && !manualRate) {
      form.setValue('exchange_rate', Number(exchangeRate.rate))
    }
  }, [exchangeRate?.rate, form, manualRate])

  const effectiveRate = manualRate || (exchangeRate ? Number(exchangeRate.rate) : undefined)

  const toAmount =
    effectiveRate && fromAmount > 0 ? (fromAmount * Number(effectiveRate)).toFixed(2) : '0.00'

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  useEffect(() => {
    if (open && currentBranchId) {
      form.setValue('branch_id', currentBranchId)
    }
  }, [currentBranchId, form, open])

  const onSubmit = (data: ExchangeFormData) => {
    if (data.from_currency_id === data.to_currency_id) {
      form.setError('to_currency_id', {
        message: 'From and To currencies cannot be the same',
      })
      return
    }

    createExchange(
      {
        branch_id: data.branch_id,
        from_currency_id: data.from_currency_id,
        to_currency_id: data.to_currency_id,
        from_amount: data.from_amount,
        exchange_rate: data.exchange_rate ?? (exchangeRate ? Number(exchangeRate.rate) : undefined),
        commission_percentage: data.commission_percentage ?? undefined,
        customer_id: data.customer_id || undefined,
        description: data.description || undefined,
        notes: data.notes || undefined,
        reference_number: data.reference_number || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New Exchange Transaction</DialogTitle>
          <DialogDescription>
            Create a new currency exchange transaction. Enter the details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Branch */}
            <FormField
              control={form.control}
              name="branch_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
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
                          <SelectItem key={branch.id} value={branch.id}>
                            {formatBranchLabel(branch, branch.name, branch.id)}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* From Currency */}
              <FormField
                control={form.control}
                name="from_currency_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Currency</FormLabel>
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
                              {currency.code} - {currency.name_en}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* To Currency */}
              <FormField
                control={form.control}
                name="to_currency_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Currency</FormLabel>
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
                              {currency.code} - {currency.name_en}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedFromCurrency && selectedToCurrency && selectedFromCurrency.id !== selectedToCurrency.id && (
              <div className="rounded-lg border bg-muted/50 p-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingDown className="h-4 w-4" />
                    <span>Exchange Rate</span>
                  </div>
                  <div className="font-medium">
                    {rateLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : effectiveRate ? (
                      <>
                        1 {selectedFromCurrency.code} = {Number(effectiveRate).toFixed(4)}{' '}
                        {selectedToCurrency.code}
                      </>
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Exchange Rate Override */}
              <FormField
                control={form.control}
                name="exchange_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exchange Rate (auto-filled)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.0001"
                        placeholder="Enter exchange rate"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                      />
                    </FormControl>
                    <p className="text-xs text-muted-foreground">
                      Defaults to the latest rate. You can override it if needed.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Commission Percentage */}
              <FormField
                control={form.control}
                name="commission_percentage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Commission % (optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min={0}
                        placeholder="e.g. 1.5"
                        value={field.value ?? ''}
                        onChange={(e) =>
                          field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Amount */}
            <FormField
              control={form.control}
              name="from_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Amount {selectedFromCurrency ? `(${selectedFromCurrency.code})` : ''}
                  </FormLabel>
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

            {/* Calculated To Amount */}
            {selectedFromCurrency && selectedToCurrency && fromAmount > 0 && effectiveRate && (
              <div className="rounded-lg border bg-primary/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    You will receive ({selectedToCurrency.code})
                  </span>
                  <span className="text-lg font-bold">{toAmount}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer ID (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Customer UUID" value={field.value ?? ''} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reference_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. EXC-2025-001" value={field.value ?? ''} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Describe this exchange" value={field.value ?? ''} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Additional details" value={field.value ?? ''} onChange={field.onChange} />
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
              <Button type="submit" disabled={isCreating || rateLoading}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Transaction
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
