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
    .length(3, 'Currency code must be 3 letters')
    .regex(/^[A-Za-z]{3}$/, 'Currency code must contain only letters')
    .transform((val) => val.toUpperCase()),
  name_en: z
    .string()
    .min(2, 'English name must be at least 2 characters')
    .max(100, 'English name must be at most 100 characters'),
  name_ar: z
    .string()
    .min(2, 'Arabic name must be at least 2 characters')
    .max(100, 'Arabic name must be at most 100 characters'),
  symbol: z.string().max(10, 'Symbol must be at most 10 characters').optional().or(z.literal('')),
  decimal_places: z
    .number({ invalid_type_error: 'Decimal places are required' })
    .min(0, 'Decimal places must be between 0 and 8')
    .max(8, 'Decimal places must be between 0 and 8')
    .optional()
    .default(2),
  is_base_currency: z.boolean().optional(),
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
      name_en: '',
      name_ar: '',
      symbol: '',
      decimal_places: 2,
      is_base_currency: false,
      is_active: true,
    },
  })

  useEffect(() => {
    if (currency && open) {
      reset({
        code: currency.code,
        name_en: currency.name_en || currency.name,
        name_ar: currency.name_ar || currency.name,
        symbol: currency.symbol || '',
        decimal_places: currency.decimal_places,
        is_base_currency: currency.is_base_currency ?? false,
        is_active: currency.is_active,
      })
    } else if (!currency && open) {
      reset({
        code: '',
        name_en: '',
        name_ar: '',
        symbol: '',
        decimal_places: 2,
        is_base_currency: false,
        is_active: true,
      })
    }
  }, [currency, open, reset])

  const onSubmit = async (data: CurrencyFormData) => {
    if (isEditing && currency) {
      await updateCurrency({
        id: currency.id,
        payload: {
          name_en: data.name_en,
          name_ar: data.name_ar,
          symbol: data.symbol || null,
          decimal_places: data.decimal_places,
          is_base_currency: data.is_base_currency,
          is_active: data.is_active,
        },
      })
    } else {
      await createCurrency({
        code: data.code,
        name_en: data.name_en,
        name_ar: data.name_ar,
        symbol: data.symbol || null,
        decimal_places: data.decimal_places,
        is_base_currency: data.is_base_currency,
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_en">Name (English)</Label>
              <Input id="name_en" placeholder="US Dollar" disabled={isBusy} {...register('name_en')} />
              {errors.name_en && <p className="text-sm text-red-500">{errors.name_en.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_ar">Name (Arabic)</Label>
              <Input id="name_ar" placeholder="دولار أمريكي" disabled={isBusy} {...register('name_ar')} />
              {errors.name_ar && <p className="text-sm text-red-500">{errors.name_ar.message}</p>}
            </div>
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
              <Label htmlFor="is_base_currency">Base Currency</Label>
              <p className="text-sm text-muted-foreground">Mark as the system base currency</p>
            </div>
            <Checkbox
              id="is_base_currency"
              checked={watch('is_base_currency') ?? false}
              onCheckedChange={(checked) => setValue('is_base_currency', !!checked)}
              disabled={isBusy}
            />
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

