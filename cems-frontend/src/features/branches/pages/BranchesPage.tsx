import { Fragment, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  MapPin,
  Phone,
  Mail,
  Eye,
  PencilLine,
  Plus,
  Users,
  Wallet,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Branch } from '@/types/branch.types'
import {
  useBranchBalances,
  useBranches,
  useCreateBranch,
  useUpdateBranch,
} from '@/hooks/useBranches'
import { formatAmount } from '@/utils/number'
import { ActionIconButton } from '@/components/action-icon-button'

type BranchFormState = {
  name_en: string
  name_ar: string
  code: string
  region: string
  address: string
  city: string
  phone: string
  email: string
  manager_id: string
  is_main_branch: boolean
  opening_balance_date: string
}

const defaultBranchForm: BranchFormState = {
  name_en: '',
  name_ar: '',
  code: '',
  region: '',
  address: '',
  city: '',
  phone: '',
  email: '',
  manager_id: '',
  is_main_branch: false,
  opening_balance_date: '',
}

export default function BranchesPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const skip = (page - 1) * pageSize
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [region, setRegion] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [includeBalances, setIncludeBalances] = useState(true)
  const [calculateUsd, setCalculateUsd] = useState(true)
  const [expandedBranchId, setExpandedBranchId] = useState<string | null>(null)

  const { data, isLoading, isError } = useBranches({
    skip,
    limit: pageSize,
    search,
    region: region || undefined,
    is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
    include_balances: includeBalances,
    calculate_usd_value: includeBalances ? calculateUsd : undefined,
  })

  const branches = data?.data ?? []
  const expandedBranch = branches.find((branch) => branch.id === expandedBranchId)
  const shouldFetchBalances = Boolean(
    expandedBranchId && (!expandedBranch?.balances || expandedBranch.balances.length === 0)
  )

  useEffect(() => {
    if (!includeBalances) {
      setCalculateUsd(false)
    }
  }, [includeBalances])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [createForm, setCreateForm] = useState<BranchFormState>(defaultBranchForm)
  const [editForm, setEditForm] = useState<BranchFormState>(defaultBranchForm)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    data: balancesData,
    isLoading: balancesLoading,
    isError: balancesError,
  } = useBranchBalances(expandedBranchId ?? '', shouldFetchBalances)

  const { mutateAsync: createBranch, isPending: creatingBranch } = useCreateBranch()
  const { mutateAsync: updateBranch, isPending: updatingBranch } = useUpdateBranch()

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleViewBranch = (branchId: string) => {
    navigate(`/branches/${branchId}`)
  }

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    if (!data) return []
    const totalPages = Math.ceil((data?.total || 0) / pageSize)
    const current = page
    const delta = 2

    const pages: (number | string)[] = []

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= current - delta && i <= current + delta)
      ) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }

    return pages
  }

  const renderFormFields = useMemo(
    () =>
      function BranchFormFields({
        formState,
        setFormState,
        disabled,
      }: {
        formState: BranchFormState
        setFormState: React.Dispatch<React.SetStateAction<BranchFormState>>
        disabled?: boolean
      }) {
        return (
          <div className="grid gap-4">
            <div>
              <Label htmlFor="branch-name-en">Branch Name (English)</Label>
              <Input
                id="branch-name-en"
                value={formState.name_en}
                onChange={(e) => setFormState((prev) => ({ ...prev, name_en: e.target.value }))}
                placeholder="e.g. Baghdad Central"
                disabled={disabled}
                required
              />
            </div>
            <div>
              <Label htmlFor="branch-name-ar">Branch Name (Arabic)</Label>
              <Input
                id="branch-name-ar"
                value={formState.name_ar}
                onChange={(e) => setFormState((prev) => ({ ...prev, name_ar: e.target.value }))}
                placeholder="مثال: فرع بغداد المركزي"
                disabled={disabled}
                required
              />
            </div>
            <div>
              <Label htmlFor="branch-code">Branch Code</Label>
              <Input
                id="branch-code"
                value={formState.code}
                onChange={(e) => setFormState((prev) => ({ ...prev, code: e.target.value }))}
                placeholder="CEN01"
                disabled={disabled}
                required
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="branch-region">Region</Label>
                <Input
                  id="branch-region"
                  value={formState.region}
                  onChange={(e) => setFormState((prev) => ({ ...prev, region: e.target.value }))}
                  placeholder="e.g. Central"
                  disabled={disabled}
                  required
                />
              </div>
              <div>
                <Label htmlFor="branch-city">City</Label>
                <Input
                  id="branch-city"
                  value={formState.city}
                  onChange={(e) => setFormState((prev) => ({ ...prev, city: e.target.value }))}
                  placeholder="Baghdad"
                  disabled={disabled}
                  required
                />
              </div>
              <div>
                <Label htmlFor="branch-phone">Phone</Label>
                <Input
                  id="branch-phone"
                  value={formState.phone}
                  onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="+964 123 456 789"
                  disabled={disabled}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="branch-address">Address</Label>
              <Input
                id="branch-address"
                value={formState.address}
                onChange={(e) => setFormState((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="Karrada, 14 July St."
                disabled={disabled}
                required
              />
            </div>
            <div>
              <Label htmlFor="branch-email">Email</Label>
              <Input
                id="branch-email"
                type="email"
                value={formState.email}
                onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="branch@cems.com"
                disabled={disabled}
              />
            </div>
            <div>
              <Label htmlFor="branch-manager">Manager ID</Label>
              <Input
                id="branch-manager"
                value={formState.manager_id}
                onChange={(e) => setFormState((prev) => ({ ...prev, manager_id: e.target.value }))}
                placeholder="UUID of manager (optional)"
                disabled={disabled}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <Label htmlFor="branch-main">Main Branch</Label>
                  <p className="text-sm text-muted-foreground">Mark branch as the main location</p>
                </div>
                <Checkbox
                  id="branch-main"
                  checked={formState.is_main_branch}
                  onCheckedChange={(checked) =>
                    setFormState((prev) => ({ ...prev, is_main_branch: !!checked }))
                  }
                  disabled={disabled}
                />
              </div>
              <div>
                <Label htmlFor="opening-balance-date">Opening Balance Date</Label>
                <Input
                  id="opening-balance-date"
                  type="datetime-local"
                  value={formState.opening_balance_date}
                  onChange={(e) =>
                    setFormState((prev) => ({ ...prev, opening_balance_date: e.target.value }))
                  }
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        )
      },
    []
  )

  const resetForms = () => {
    setCreateForm(defaultBranchForm)
    setEditForm(defaultBranchForm)
    setFormError(null)
  }

  const toggleBalances = (branchId: string) => {
    setExpandedBranchId((prev) => (prev === branchId ? null : branchId))
  }

  const handleCreateBranch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    try {
      await createBranch({
        name_en: createForm.name_en,
        name_ar: createForm.name_ar,
        code: createForm.code,
        region: createForm.region,
        address: createForm.address,
        city: createForm.city,
        phone: createForm.phone,
        email: createForm.email || null,
        manager_id: createForm.manager_id || null,
        is_main_branch: createForm.is_main_branch,
        opening_balance_date: createForm.opening_balance_date || null,
      })
      resetForms()
      setIsCreateDialogOpen(false)
    } catch {
      setFormError('Unable to create branch. Please check the data and retry.')
    }
  }

  const handleEditBranch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingBranch) return
    setFormError(null)
    try {
      await updateBranch({
        id: editingBranch.id,
        data: {
          name_en: editForm.name_en,
          name_ar: editForm.name_ar,
          code: editForm.code,
          region: editForm.region,
          address: editForm.address || null,
          city: editForm.city || null,
          phone: editForm.phone || null,
          email: editForm.email || null,
          manager_id: editForm.manager_id || null,
          is_main_branch: editForm.is_main_branch,
          opening_balance_date: editForm.opening_balance_date || null,
        },
      })
      setIsEditDialogOpen(false)
      setEditingBranch(null)
    } catch {
      setFormError('Unable to update branch. Please try again.')
    }
  }

  const openEditDialog = (branch: Branch) => {
    setEditingBranch(branch)
    setEditForm({
      name_en: branch.name_en ?? branch.name ?? '',
      name_ar: branch.name_ar ?? '',
      code: branch.code ?? '',
      region: branch.region ?? '',
      address: branch.address ?? '',
      city: branch.city ?? '',
      phone: branch.phone ?? '',
      email: branch.email ?? '',
      manager_id: branch.manager_id ?? '',
      is_main_branch: branch.is_main_branch,
      opening_balance_date: branch.opening_balance_date ?? '',
    })
    setFormError(null)
    setIsEditDialogOpen(true)
  }

  const BranchFormFields = renderFormFields

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Branch Management</h1>
        <p className="text-muted-foreground">Manage branches and view balances</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>Search Branches</CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
              setIsCreateDialogOpen(open)
              if (!open) {
                resetForms()
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Branch
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCreateBranch} className="space-y-4">
                  <DialogHeader>
                    <DialogTitle>Create Branch</DialogTitle>
                    <DialogDescription>
                      Capture the basic details for the new branch location.
                    </DialogDescription>
                  </DialogHeader>
                  <BranchFormFields formState={createForm} setFormState={setCreateForm} disabled={creatingBranch} />
                  {formError && <p className="text-sm text-destructive">{formError}</p>}
                  <DialogFooter>
                    <Button type="submit" disabled={creatingBranch}>
                      {creatingBranch ? 'Saving...' : 'Create Branch'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, code, or location..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <Label htmlFor="region-filter">Region</Label>
              <Input
                id="region-filter"
                placeholder="e.g. Istanbul_Asian"
                value={region}
                onChange={(e) => {
                  setRegion(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as typeof statusFilter)
                  setPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Balances</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-balances"
                  checked={includeBalances}
                  onCheckedChange={(checked) => {
                    setIncludeBalances(Boolean(checked))
                    setPage(1)
                  }}
                />
                <Label htmlFor="include-balances" className="font-normal">
                  Include balances
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="calc-usd"
                  checked={calculateUsd}
                  disabled={!includeBalances}
                  onCheckedChange={(checked) => {
                    setCalculateUsd(Boolean(checked))
                    setPage(1)
                  }}
                />
                <Label htmlFor="calc-usd" className="font-normal">
                  Calculate USD value
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Branches</CardTitle>
            {data && (
              <span className="text-sm text-muted-foreground">
                Showing {branches.length} of {data.total} branches
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Loading branches...
            </div>
          )}

          {isError && (
            <div className="text-center py-8 text-red-500">
              Error loading branches. Please try again.
            </div>
          )}

          {data && branches.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No branches found.
            </div>
          )}

          {data && branches.length > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Total USD Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                  {branches.map((branch) => {
                    const isExpanded = expandedBranchId === branch.id
                    const hasLocalBalances = Boolean(branch.balances && branch.balances.length > 0)
                    const branchBalances = hasLocalBalances
                      ? branch.balances ?? []
                      : balancesData?.branch_id === branch.id
                        ? balancesData.balances
                        : []
                    const branchTotalUsd =
                      branch.total_value_in_base_currency ??
                      branch.total_usd_value ??
                      (balancesData?.branch_id === branch.id
                        ? balancesData.total_usd_equivalent
                        : undefined)

                    return (
                      <Fragment key={branch.id}>
                        <TableRow>
                          <TableCell>
                            <button
                              onClick={() => handleViewBranch(branch.id)}
                              className="hover:text-primary hover:underline text-left"
                            >
                          <div className="font-medium">{branch.name_en ?? 'N/A'}</div>
                          {branch.name_ar && (
                            <div className="text-sm text-muted-foreground">{branch.name_ar}</div>
                          )}
                          {branch.is_main_branch && (
                            <Badge variant="outline" className="mt-1 text-xs">Main Branch</Badge>
                          )}
                        </button>
                      </TableCell>
                      <TableCell className="font-mono">{branch.code ?? 'N/A'}</TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {branch.city && (
                            <div className="font-medium">{branch.city}</div>
                          )}
                          {branch.region && (
                            <div className="text-muted-foreground">{branch.region.replace(/_/g, ' ')}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {branch.address && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {branch.address}
                            </div>
                          )}
                          {branch.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              {branch.phone}
                            </div>
                          )}
                          {branch.email && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              {branch.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const totalUsdValue =
                            branchTotalUsd ??
                            (branchBalances.length
                              ? (() => {
                                  const sum = branchBalances.reduce((acc, balance) => {
                                    const usd = Number(balance.usd_value ?? balance.usd_equivalent)
                                    return Number.isFinite(usd) ? acc + usd : acc
                                  }, 0)

                                  return Number.isFinite(sum) ? sum : undefined
                                })()
                              : undefined)

                          return formatAmount(totalUsdValue)
                        })()}
                      </TableCell>
                          <TableCell>
                        <Badge variant={branch.is_active ? 'default' : 'secondary'}>
                          {branch.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <ActionIconButton
                                size="sm"
                                variant="ghost"
                                label="Edit branch"
                                onClick={() => openEditDialog(branch)}
                                icon={<PencilLine className="w-4 h-4" />}
                              />
                              <ActionIconButton
                                size="sm"
                                variant="ghost"
                                label="View users"
                                onClick={() => navigate(`/branches/${branch.id}/users`)}
                                icon={<Users className="w-4 h-4" />}
                              />
                              <ActionIconButton
                                size="sm"
                                variant="ghost"
                                label="View details"
                                onClick={() => handleViewBranch(branch.id)}
                                icon={<Eye className="w-4 h-4" />}
                              />
                              <ActionIconButton
                                size="sm"
                                variant="ghost"
                                label={isExpanded ? 'Hide balances' : 'Show balances'}
                                onClick={() => toggleBalances(branch.id)}
                                icon={
                                  <span className="flex items-center gap-1">
                                    <Wallet className="w-4 h-4" />
                                    {isExpanded ? (
                                      <ChevronUp className="w-3 h-3" />
                                    ) : (
                                      <ChevronDown className="w-3 h-3" />
                                    )}
                                  </span>
                                }
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                        {isExpanded && (
                          <TableRow className="bg-muted/40">
                            <TableCell colSpan={7}>
                              {!hasLocalBalances && balancesLoading && (
                                <div className="py-4 text-sm text-muted-foreground">
                                  Loading balances...
                                </div>
                              )}
                              {balancesError && (
                                <div className="py-4 text-sm text-destructive">
                                  Unable to load balances for this branch right now.
                                </div>
                              )}
                              {(branchBalances.length > 0 || (!hasLocalBalances && balancesData)) && (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <Wallet className="w-4 h-4" />
                                      <span className="font-medium text-foreground">
                                        {branch.name_en ?? branch.name ?? 'Branch balances'}
                                      </span>
                                    </div>
                                    {branchTotalUsd && (
                                      <span className="text-sm text-muted-foreground">
                                        Total USD Value: {formatAmount(branchTotalUsd)}
                                      </span>
                                    )}
                                  </div>
                                  {branchBalances.length === 0 ? (
                                    <div className="text-sm text-muted-foreground">
                                      No balances available for this branch.
                                    </div>
                                  ) : (
                                    <div className="rounded-md border bg-background">
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Currency</TableHead>
                                            <TableHead>Balance</TableHead>
                                            <TableHead>Available</TableHead>
                                            <TableHead>Reserved</TableHead>
                                            <TableHead>Min / Max</TableHead>
                                            <TableHead>Updated</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {branchBalances.map((balance) => (
                                              <TableRow key={`${balance.currency_code}-${balance.currency_id ?? ''}`}>
                                              <TableCell className="font-medium">
                                                <div>{balance.currency_code}</div>
                                                <div className="text-xs text-muted-foreground">
                                                  {balance.currency_name}
                                                </div>
                                              </TableCell>
                                              <TableCell>{formatAmount(balance.balance)}</TableCell>
                                              <TableCell>{formatAmount(balance.available_balance)}</TableCell>
                                              <TableCell>{formatAmount(balance.reserved_balance)}</TableCell>
                                              <TableCell className="text-sm text-muted-foreground">
                                                {formatAmount(balance.minimum_threshold)} /{' '}
                                                {formatAmount(balance.maximum_threshold)}
                                              </TableCell>
                                              <TableCell className="text-sm text-muted-foreground">
                                                {balance.last_updated ? new Date(balance.last_updated).toLocaleString() : '—'}
                                              </TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </div>
                                  )}
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                      </Fragment>
                    )
                  })}
              </TableBody>
            </Table>

              {/* Pagination */}
              {(() => {
                const totalPages = Math.ceil((data?.total || 0) / pageSize)
                return totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>

                    {getPageNumbers().map((pageNum, idx) =>
                      pageNum === '...' ? (
                        <span key={`ellipsis-${idx}`} className="px-2">
                          ...
                        </span>
                      ) : (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setPage(pageNum as number)}
                        >
                          {pageNum}
                        </Button>
                      )
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )
              })()}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={(open) => {
        setIsEditDialogOpen(open)
        if (!open) {
          setEditingBranch(null)
          resetForms()
        }
      }}>
        <DialogContent>
          <form onSubmit={handleEditBranch} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit Branch</DialogTitle>
              <DialogDescription>
                Update the details for {editingBranch?.name_en ?? editingBranch?.name ?? 'this branch'}.
              </DialogDescription>
            </DialogHeader>
            <BranchFormFields formState={editForm} setFormState={setEditForm} disabled={updatingBranch} />
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <DialogFooter>
              <Button type="submit" disabled={updatingBranch}>
                {updatingBranch ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
