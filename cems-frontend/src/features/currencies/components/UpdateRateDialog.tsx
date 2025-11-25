import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { History } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  useActiveCurrencies,
  useCreateExchangeRate,
} from '@/hooks/useCurrencies'
import type { Currency } from '@/types/currency.types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface UpdateRateDialogProps {
  currency: Currency | null
  open: boolean
  onClose: () => void
  onViewHistory?: (currency: Currency) => void
}

const rateSchema = z.object({
  to_currency_id: z.string().uuid({ message: 'Select a target currency' }),
  rate: z
    .string()
    .min(1, 'Mid rate is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Rate must be a positive number',
    }),
  buy_rate: z
    .string()
    .optional()
    .refine((val) => val === undefined || val === '' || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'Buy rate must be a positive number',
    }),
  sell_rate: z
    .string()
    .optional()
    .refine((val) => val === undefined || val === '' || (!isNaN(Number(val)) && Number(val) > 0), {
      message: 'Sell rate must be a positive number',
    }),
  effective_from: z.string().min(1, 'Effective date is required'),
  notes: z.string().max(500, 'Notes must be 500 characters or less').optional(),
})

type RateFormData = z.infer<typeof rateSchema>

export default function UpdateRateDialog({ currency, open, onClose, onViewHistory }: UpdateRateDialogProps) {
  const { data: activeCurrencies } = useActiveCurrencies()
  const { mutate: createRate, isPending } = useCreateExchangeRate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<RateFormData>({
    resolver: zodResolver(rateSchema),
  })

  useEffect(() => {
    if (currency && open) {
      reset({
        to_currency_id: '',
        rate: '',
        buy_rate: '',
        sell_rate: '',
        effective_from: new Date().toISOString().slice(0, 16),
        notes: '',
      })
    }
  }, [currency, open, reset])

  useEffect(() => {
    if (open && currency && (watch('to_currency_id') ?? '') === '') {
      const fallback = (activeCurrencies ?? []).find((c) => c.id !== currency.id)
      if (fallback) {
        setValue('to_currency_id', fallback.id)
      }
    }
  }, [activeCurrencies, currency, open, setValue, watch])

  const onSubmit = (data: RateFormData) => {
    if (!currency) return

    const effectiveFrom = new Date(data.effective_from).toISOString()

    createRate(
      {
        from_currency_id: currency.id,
        to_currency_id: data.to_currency_id,
        rate: Number(data.rate),
        buy_rate: data.buy_rate ? Number(data.buy_rate) : null,
        sell_rate: data.sell_rate ? Number(data.sell_rate) : null,
        effective_from: effectiveFrom,
        notes: data.notes || null,
      },
      {
        onSuccess: () => {
          onClose()
          reset()
        },
      }
    )
  }

  const handleClose = () => {
    if (!isPending) {
      onClose()
      reset()
    }
  }

  if (!currency) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <DialogTitle>Create Exchange Rate</DialogTitle>
              <DialogDescription>
                Set a new rate for {currency.name || currency.name_en} ({currency.code}) against another
                currency
              </DialogDescription>
            </div>
            {onViewHistory && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={isPending}
                onClick={() => onViewHistory(currency)}
              >
                <History className="w-4 h-4 mr-1" /> History
              </Button>
            )}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="to_currency_id">
              Target Currency <span className="text-red-500">*</span>
            </Label>
            <input type="hidden" {...register('to_currency_id')} />
            <Select
              onValueChange={(val) => setValue('to_currency_id', val)}
              value={watch('to_currency_id')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {(activeCurrencies ?? [])
                  .filter((item) => item.id !== currency.id)
                  .map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.code} — {item.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {errors.to_currency_id && (
              <p className="text-sm text-red-500">{errors.to_currency_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate">
              Mid Rate <span className="text-red-500">*</span>
            </Label>
            <Input
              id="rate"
              type="number"
              step="0.0001"
              placeholder="0.0000"
              {...register('rate')}
              disabled={isPending}
            />
            {errors.rate && <p className="text-sm text-red-500">{errors.rate.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="buy_rate">Buy Rate (optional)</Label>
            <Input
              id="buy_rate"
              type="number"
              step="0.0001"
              placeholder="0.0000"
              {...register('buy_rate')}
              disabled={isPending}
            />
            {errors.buy_rate && (
              <p className="text-sm text-red-500">{errors.buy_rate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sell_rate">Sell Rate (optional)</Label>
            <Input
              id="sell_rate"
              type="number"
              step="0.0001"
              placeholder="0.0000"
              {...register('sell_rate')}
              disabled={isPending}
            />
            {errors.sell_rate && (
              <p className="text-sm text-red-500">{errors.sell_rate.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="effective_from">
              Effective From <span className="text-red-500">*</span>
            </Label>
            <Input
              id="effective_from"
              type="datetime-local"
              {...register('effective_from')}
              disabled={isPending}
            />
            {errors.effective_from && (
              <p className="text-sm text-red-500">{errors.effective_from.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" placeholder="Optional notes" {...register('notes')} disabled={isPending} />
            {errors.notes && <p className="text-sm text-red-500">{errors.notes.message}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Updating...' : 'Update Rates'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
