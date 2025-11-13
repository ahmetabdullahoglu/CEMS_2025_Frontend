import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
import { useUpdateCurrencyRates } from '@/hooks/useCurrencies'
import type { Currency } from '@/types/currency.types'

interface UpdateRateDialogProps {
  currency: Currency | null
  open: boolean
  onClose: () => void
}

const rateSchema = z.object({
  buy_rate: z
    .string()
    .min(1, 'Buy rate is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Buy rate must be a positive number',
    }),
  sell_rate: z
    .string()
    .min(1, 'Sell rate is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Sell rate must be a positive number',
    }),
})

type RateFormData = z.infer<typeof rateSchema>

export default function UpdateRateDialog({ currency, open, onClose }: UpdateRateDialogProps) {
  const { mutate: updateRates, isPending } = useUpdateCurrencyRates()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RateFormData>({
    resolver: zodResolver(rateSchema),
  })

  useEffect(() => {
    if (currency && open) {
      reset({
        buy_rate: currency.buy_rate?.toString() || '0',
        sell_rate: currency.sell_rate?.toString() || '0',
      })
    }
  }, [currency, open, reset])

  const onSubmit = (data: RateFormData) => {
    if (!currency) return

    updateRates(
      {
        id: currency.id,
        data: {
          buy_rate: Number(data.buy_rate),
          sell_rate: Number(data.sell_rate),
        },
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
          <DialogTitle>Update Exchange Rates</DialogTitle>
          <DialogDescription>
            Update buy and sell rates for {currency.name_en} ({currency.code})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="buy_rate">
              Buy Rate <span className="text-red-500">*</span>
            </Label>
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
            <Label htmlFor="sell_rate">
              Sell Rate <span className="text-red-500">*</span>
            </Label>
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
