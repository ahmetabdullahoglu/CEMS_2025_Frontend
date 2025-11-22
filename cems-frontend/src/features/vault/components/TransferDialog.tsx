import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ArrowRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useActiveCurrencies } from '@/hooks/useCurrencies'
import { useCreateVaultTransfer, useVaultBalances } from '@/hooks/useVault'
import { formatBranchLabel } from '@/utils/branch'
import { useBranchSelection } from '@/contexts/BranchContext'

interface TransferDialogProps {
  open: boolean
  onClose: () => void
}

const transferSchema = z
  .object({
    from_branch_id: z.string().optional(),
    to_branch_id: z.string().optional(),
    currency_id: z.string().min(1, 'Currency is required'),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: 'Amount must be a positive number',
      }),
    notes: z.string().optional(),
  })
  .refine(
    (values) => {
      const fromIsBranch = values.from_branch_id && values.from_branch_id !== 'vault'
      const toIsBranch = values.to_branch_id && values.to_branch_id !== 'vault'

      // Only one side of the transfer can be a branch
      return fromIsBranch !== toIsBranch
    },
    {
      path: ['to_branch_id'],
      message: 'Please choose a valid transfer direction',
    }
  )

type TransferFormData = z.infer<typeof transferSchema>

export default function TransferDialog({ open, onClose }: TransferDialogProps) {
  const { data: currencies, isLoading: currenciesLoading } = useActiveCurrencies()
  const { data: vaultDetails } = useVaultBalances()
  const { availableBranches: branches, currentBranchId, isLoading: branchesLoading } =
    useBranchSelection()
  const { mutate: createTransfer, isPending } = useCreateVaultTransfer()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      from_branch_id: currentBranchId ?? 'vault',
      to_branch_id: currentBranchId ?? 'vault',
      currency_id: '',
      amount: '',
      notes: '',
    },
  })

  const currencyId = watch('currency_id')

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  useEffect(() => {
    if (open && currentBranchId) {
      setValue('from_branch_id', currentBranchId)
      setValue('to_branch_id', currentBranchId)
    }
  }, [currentBranchId, open, setValue])

  const onSubmit = (data: TransferFormData) => {
    const vaultId = vaultDetails?.id

    if (!vaultId) {
      return
    }

    const fromBranch = data.from_branch_id === 'vault' ? null : data.from_branch_id || null
    const toBranch = data.to_branch_id === 'vault' ? null : data.to_branch_id || null
    const amount = data.amount

    if (fromBranch && toBranch) {
      // Unsupported combination
      return
    }

    if (!fromBranch && toBranch) {
      createTransfer(
        {
          transfer_type: 'vault_to_branch',
          vault_id: vaultId,
          branch_id: toBranch,
          currency_id: data.currency_id,
          amount,
          notes: data.notes || null,
        },
        {
          onSuccess: () => {
            onClose()
            reset()
          },
        }
      )
      return
    }

    if (fromBranch && !toBranch) {
      createTransfer(
        {
          transfer_type: 'branch_to_vault',
          branch_id: fromBranch,
          vault_id: vaultId,
          currency_id: data.currency_id,
          amount,
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
  }

  const handleClose = () => {
    if (!isPending) {
      onClose()
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Vault Transfer</DialogTitle>
          <DialogDescription>
            Transfer currency between vault and branches
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from_branch_id">From Branch (Optional)</Label>
              <Select
                value={watch('from_branch_id')}
                onValueChange={(value) => setValue('from_branch_id', value)}
                disabled={isPending || branchesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch or vault" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vault">Vault</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id.toString()}>
                      {formatBranchLabel(branch)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-center pt-6">
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to_branch_id">To Branch (Optional)</Label>
            <Select
              value={watch('to_branch_id')}
              onValueChange={(value) => setValue('to_branch_id', value)}
              disabled={isPending || branchesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select branch or vault" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vault">Vault</SelectItem>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id.toString()}>
                    {formatBranchLabel(branch)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currency_code">
              Currency <span className="text-red-500">*</span>
            </Label>
            <Select
              value={currencyId}
              onValueChange={(value) => setValue('currency_id', value)}
              disabled={isPending || currenciesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {currencies?.map((currency) => (
                  <SelectItem key={currency.id} value={currency.id}>
                    {currency.code} - {currency.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.currency_id && (
              <p className="text-sm text-red-500">{errors.currency_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">
              Amount <span className="text-red-500">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register('amount')}
              disabled={isPending}
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              placeholder="Optional transfer notes"
              {...register('notes')}
              disabled={isPending}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create Transfer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
