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
import { useCreateTransfer } from '@/hooks/useTransactions'
import { useCreateVaultTransfer, useVaultsList } from '@/hooks/useVault'
import { formatBranchLabel } from '@/utils/branch'
import { useBranchSelection } from '@/contexts/BranchContext'

// Schema matching transfer endpoints
const transferSchema = z.discriminatedUnion('transfer_type', [
  z.object({
    transfer_type: z.literal('branch_to_branch'),
    from_branch_id: z.string().uuid('Please select a from branch'),
    to_branch_id: z.string().uuid('Please select a to branch'),
    currency_id: z.string().uuid('Please select a currency'),
    amount: z
      .number()
      .positive('Amount must be positive')
      .min(0.01, 'Amount must be at least 0.01'),
    description: z.string().optional(),
    notes: z.string().optional(),
    reference_number: z.string().optional(),
  }),
  z.object({
    transfer_type: z.literal('vault_to_branch'),
    vault_id: z.string().uuid('Please select a vault'),
    branch_id: z.string().uuid('Please select a branch'),
    currency_id: z.string().uuid('Please select a currency'),
    amount: z
      .number()
      .positive('Amount must be positive')
      .min(0.01, 'Amount must be at least 0.01'),
    notes: z.string().optional(),
  }),
  z.object({
    transfer_type: z.literal('branch_to_vault'),
    branch_id: z.string().uuid('Please select a branch'),
    vault_id: z.string().uuid('Please select a vault'),
    currency_id: z.string().uuid('Please select a currency'),
    amount: z
      .number()
      .positive('Amount must be positive')
      .min(0.01, 'Amount must be at least 0.01'),
    notes: z.string().optional(),
  }),
  z.object({
    transfer_type: z.literal('vault_to_vault'),
    from_vault_id: z.string().uuid('Please select the source vault'),
    to_vault_id: z.string().uuid('Please select the destination vault'),
    currency_id: z.string().uuid('Please select a currency'),
    amount: z
      .number()
      .positive('Amount must be positive')
      .min(0.01, 'Amount must be at least 0.01'),
    notes: z.string().optional(),
  }),
])

type TransferFormData = z.infer<typeof transferSchema>

interface TransferDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function TransferDialog({ open, onOpenChange }: TransferDialogProps) {
  const { data: currencies, isLoading: currenciesLoading } = useActiveCurrencies()
  const { availableBranches: branches, currentBranchId, isLoading: branchesLoading } =
    useBranchSelection()
  const { data: vaults, isLoading: vaultsLoading } = useVaultsList()
  const { mutate: createTransfer, isPending: isCreating } = useCreateTransfer()
  const { mutate: createVaultTransfer, isPending: isCreatingVaultTransfer } = useCreateVaultTransfer()

  const form = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      transfer_type: 'branch_to_branch',
      from_branch_id: currentBranchId ?? '',
      to_branch_id: '',
      currency_id: '',
      amount: 0,
      description: '',
      notes: '',
      reference_number: '',
    },
  })

  const transferType = form.watch('transfer_type')
  const fromBranchId = form.watch('from_branch_id')
  const toBranchId = form.watch('to_branch_id')
  const fromVaultId = form.watch('from_vault_id')
  const toVaultId = form.watch('to_vault_id')
  const isSubmitting = isCreating || isCreatingVaultTransfer

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      form.reset({
        transfer_type: 'branch_to_branch',
        from_branch_id: currentBranchId ?? '',
        to_branch_id: '',
        currency_id: '',
        amount: 0,
        description: '',
        notes: '',
        reference_number: '',
      })
    }
  }, [open, currentBranchId, form])

  // Realign fields when transfer type changes so validation matches the correct shape
  useEffect(() => {
    const currency_id = form.getValues('currency_id')
    const amount = form.getValues('amount')

    if (transferType === 'branch_to_branch') {
      form.reset({
        transfer_type: transferType,
        from_branch_id: currentBranchId ?? '',
        to_branch_id: '',
        currency_id,
        amount,
        description: '',
        notes: '',
        reference_number: '',
      })
      return
    }

    if (transferType === 'vault_to_branch') {
      form.reset({
        transfer_type: transferType,
        vault_id: '',
        branch_id: currentBranchId ?? '',
        currency_id,
        amount,
        notes: '',
      })
      return
    }

    if (transferType === 'branch_to_vault') {
      form.reset({
        transfer_type: transferType,
        branch_id: currentBranchId ?? '',
        vault_id: '',
        currency_id,
        amount,
        notes: '',
        })
      return
    }

    form.reset({
      transfer_type: transferType,
      from_vault_id: '',
      to_vault_id: '',
      currency_id,
      amount,
      notes: '',
    })
  }, [transferType, currentBranchId, form])

  const onSubmit = (data: TransferFormData) => {
    if (data.transfer_type === 'branch_to_branch') {
      if (data.from_branch_id === data.to_branch_id) {
        form.setError('to_branch_id', {
          message: 'From and To branches cannot be the same',
        })
        return
      }

      const payload = {
        ...data,
        description: data.description?.trim() || undefined,
        notes: data.notes?.trim() || undefined,
        reference_number: data.reference_number?.trim() || undefined,
      }

      createTransfer(payload, {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
        },
      })
      return
    }

    if (data.transfer_type === 'vault_to_branch') {
      createVaultTransfer(
        {
          transfer_type: 'vault_to_branch',
          vault_id: data.vault_id,
          branch_id: data.branch_id,
          currency_id: data.currency_id,
          amount: data.amount,
          notes: data.notes?.trim() || undefined,
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
      return
    }

    if (data.transfer_type === 'branch_to_vault') {
      createVaultTransfer(
        {
          transfer_type: 'branch_to_vault',
          branch_id: data.branch_id,
          vault_id: data.vault_id,
          currency_id: data.currency_id,
          amount: data.amount,
          notes: data.notes?.trim() || undefined,
        },
        {
          onSuccess: () => {
            onOpenChange(false)
            form.reset()
          },
        }
      )
      return
    }

    createVaultTransfer(
      {
        transfer_type: 'vault_to_vault',
        from_vault_id: data.from_vault_id,
        to_vault_id: data.to_vault_id,
        currency_id: data.currency_id,
        amount: data.amount,
        notes: data.notes?.trim() || undefined,
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
          <DialogTitle>New Transfer Transaction</DialogTitle>
          <DialogDescription>
            Choose the transfer type and enter the required source/destination details.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="transfer_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transfer Type *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transfer type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="branch_to_branch">Branch to Branch</SelectItem>
                      <SelectItem value="vault_to_branch">Vault to Branch</SelectItem>
                      <SelectItem value="branch_to_vault">Branch to Vault</SelectItem>
                      <SelectItem value="vault_to_vault">Vault to Vault</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {transferType === 'branch_to_branch' && (
              <div className="space-y-4">
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
                                {formatBranchLabel(branch)}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {fromBranchId && toBranchId && (
                  <div className="flex items-center justify-center py-2">
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}

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
                                {formatBranchLabel(branch)}
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
            )}

            {transferType === 'vault_to_branch' && (
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="vault_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Vault *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vault" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vaultsLoading ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            vaults?.map((vault) => (
                              <SelectItem key={vault.id} value={vault.id}>
                                {vault.vault_code} - {vault.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="branch_id"
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
                              <SelectItem key={branch.id} value={branch.id}>
                                {formatBranchLabel(branch)}
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
            )}

            {transferType === 'branch_to_vault' && (
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="branch_id"
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
                              <SelectItem key={branch.id} value={branch.id}>
                                {formatBranchLabel(branch)}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vault_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Vault *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vault" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vaultsLoading ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            vaults?.map((vault) => (
                              <SelectItem key={vault.id} value={vault.id}>
                                {vault.vault_code} - {vault.name}
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
            )}

            {transferType === 'vault_to_vault' && (
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="from_vault_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From Vault *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vault" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vaultsLoading ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            vaults?.map((vault) => (
                              <SelectItem
                                key={vault.id}
                                value={vault.id}
                                disabled={vault.id === toVaultId}
                              >
                                {vault.vault_code} - {vault.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="to_vault_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To Vault *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select vault" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {vaultsLoading ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="h-4 w-4 animate-spin" />
                            </div>
                          ) : (
                            vaults?.map((vault) => (
                              <SelectItem
                                key={vault.id}
                                value={vault.id}
                                disabled={vault.id === fromVaultId}
                              >
                                {vault.vault_code} - {vault.name}
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
            )}

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
                          <SelectItem key={currency.id} value={String(currency.id)}>
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

            {transferType === 'branch_to_branch' && (
              <>
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

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter a short description"
                          className="resize-none"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

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
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Transfer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
