import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useCreateCurrency, useUpdateCurrency } from '@/hooks/useCurrencies'
import type { Currency } from '@/types/currency.types'

const currencySchema = z.object({
  code: z
    .string()
    .min(3, 'Code must be 3 characters')
    .max(3, 'Code must be 3 characters')
    .transform((val) => val.toUpperCase()),
  name: z.string().min(2, 'Name is required'),
  symbol: z.string().min(1, 'Symbol is required').max(5, 'Max 5 characters'),
  decimal_places: z
    .number({ invalid_type_error: 'Decimal places are required' })
    .min(0)
    .max(6, 'Maximum 6 decimal places'),
  is_active: z.boolean().optional(),
})

type CurrencyFormData = z.infer<typeof currencySchema>

interface CurrencyDialogProps {
  open: boolean
  onClose: () => void
  currency?: Currency | null
}

export function CurrencyDialog({ open, onClose, currency }: CurrencyDialogProps) {
  const isEditing = !!currency
  const { mutateAsync: createCurrency, isPending: creating } = useCreateCurrency()
  const { mutateAsync: updateCurrency, isPending: updating } = useUpdateCurrency()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CurrencyFormData>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      code: '',
      name: '',
      symbol: '',
      decimal_places: 2,
      is_active: true,
    },
  })

  useEffect(() => {
    if (currency && open) {
      reset({
        code: currency.code,
        name: currency.name || currency.name_en,
        symbol: currency.symbol,
        decimal_places: currency.decimal_places,
        is_active: currency.is_active,
      })
    } else if (!currency && open) {
      reset({ code: '', name: '', symbol: '', decimal_places: 2, is_active: true })
    }
  }, [currency, open, reset])

  const onSubmit = async (data: CurrencyFormData) => {
    if (isEditing && currency) {
      await updateCurrency({
        id: currency.id,
        payload: {
          name: data.name,
          symbol: data.symbol,
          decimal_places: data.decimal_places,
          is_active: data.is_active,
        },
      })
    } else {
      await createCurrency({
        code: data.code,
        name: data.name,
        symbol: data.symbol,
        decimal_places: data.decimal_places,
        is_active: data.is_active,
      })
    }

    onClose()
  }

  const isBusy = creating || updating

  return (
    <Dialog open={open} onOpenChange={() => !isBusy && onClose()}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Currency' : 'Add Currency'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" placeholder="USD" disabled={isBusy || isEditing} {...register('code')} />
              {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="symbol">Symbol</Label>
              <Input id="symbol" placeholder="$" disabled={isBusy} {...register('symbol')} />
              {errors.symbol && <p className="text-sm text-red-500">{errors.symbol.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="US Dollar" disabled={isBusy} {...register('name')} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="decimal_places">Decimal Places</Label>
            <Input
              id="decimal_places"
              type="number"
              min={0}
              max={6}
              disabled={isBusy}
              {...register('decimal_places', { valueAsNumber: true })}
            />
            {errors.decimal_places && (
              <p className="text-sm text-red-500">{errors.decimal_places.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label htmlFor="is_active">Active</Label>
              <p className="text-sm text-muted-foreground">Toggle currency availability</p>
            </div>
            <Checkbox
              id="is_active"
              checked={watch('is_active') ?? false}
              onCheckedChange={(checked) => setValue('is_active', !!checked)}
              disabled={isBusy}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isBusy}>
              Cancel
            </Button>
            <Button type="submit" disabled={isBusy}>
              {isBusy ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Currency'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

