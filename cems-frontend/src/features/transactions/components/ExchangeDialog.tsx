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
import { useActiveCurrencies, useExchangeRate, useCreateExchange } from '@/hooks/useCurrencies'

const exchangeSchema = z.object({
  from_currency_code: z.string().min(1, 'Please select a currency'),
  to_currency_code: z.string().min(1, 'Please select a currency'),
  from_amount: z.number().positive('Amount must be positive').min(0.01, 'Amount must be at least 0.01'),
  customer_name: z.string().optional(),
})

type ExchangeFormData = z.infer<typeof exchangeSchema>

interface ExchangeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ExchangeDialog({ open, onOpenChange }: ExchangeDialogProps) {
  const { data: currencies, isLoading: currenciesLoading } = useActiveCurrencies()
  const { mutate: createExchange, isPending: isCreating } = useCreateExchange()

  const form = useForm<ExchangeFormData>({
    resolver: zodResolver(exchangeSchema),
    defaultValues: {
      from_currency_code: '',
      to_currency_code: '',
      from_amount: 0,
      customer_name: '',
    },
  })

  const fromCurrency = form.watch('from_currency_code')
  const toCurrency = form.watch('to_currency_code')
  const fromAmount = form.watch('from_amount')

  const { data: exchangeRate, isLoading: rateLoading } = useExchangeRate(fromCurrency, toCurrency)

  // Calculate to_amount based on exchange rate
  const toAmount =
    exchangeRate && fromAmount > 0 ? (fromAmount * Number(exchangeRate.rate)).toFixed(2) : '0.00'

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open, form])

  const onSubmit = (data: ExchangeFormData) => {
    createExchange(
      {
        from_currency_code: data.from_currency_code,
        to_currency_code: data.to_currency_code,
        from_amount: data.from_amount,
        customer_name: data.customer_name || undefined,
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
            {/* From Currency */}
            <FormField
              control={form.control}
              name="from_currency_code"
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
                          <SelectItem key={currency.code} value={currency.code}>
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
              name="to_currency_code"
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
                          <SelectItem key={currency.code} value={currency.code}>
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

            {/* Exchange Rate Display */}
            {fromCurrency && toCurrency && fromCurrency !== toCurrency && (
              <div className="rounded-lg border bg-muted/50 p-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <TrendingDown className="h-4 w-4" />
                    <span>Exchange Rate</span>
                  </div>
                  <div className="font-medium">
                    {rateLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : exchangeRate ? (
                      <>
                        1 {fromCurrency} = {Number(exchangeRate.rate).toFixed(4)} {toCurrency}
                      </>
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Amount */}
            <FormField
              control={form.control}
              name="from_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ({fromCurrency || 'From Currency'})</FormLabel>
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
            {fromCurrency && toCurrency && fromAmount > 0 && exchangeRate && (
              <div className="rounded-lg border bg-primary/5 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    You will receive ({toCurrency})
                  </span>
                  <span className="text-lg font-bold">{toAmount}</span>
                </div>
              </div>
            )}

            {/* Customer Name (Optional) */}
            <FormField
              control={form.control}
              name="customer_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter customer name" {...field} />
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
