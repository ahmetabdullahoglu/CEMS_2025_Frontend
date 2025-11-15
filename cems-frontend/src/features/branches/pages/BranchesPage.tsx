import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Phone, Mail, Eye, PencilLine, Plus, Users } from 'lucide-react'
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
import type { Branch } from '@/types/branch.types'
import { useBranches, useCreateBranch, useUpdateBranch } from '@/hooks/useBranches'

type BranchFormState = {
  name: string
  code: string
  address: string
  city: string
  phone: string
  email: string
}

const defaultBranchForm: BranchFormState = {
  name: '',
  code: '',
  address: '',
  city: '',
  phone: '',
  email: '',
}

export default function BranchesPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const skip = (page - 1) * pageSize
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const { data, isLoading, isError } = useBranches({
    skip,
    limit: pageSize,
    search,
  })

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [createForm, setCreateForm] = useState<BranchFormState>(defaultBranchForm)
  const [editForm, setEditForm] = useState<BranchFormState>(defaultBranchForm)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

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
              <Label htmlFor="branch-name">Branch Name</Label>
              <Input
                id="branch-name"
                value={formState.name}
                onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g. Baghdad Central"
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
                <Label htmlFor="branch-city">City</Label>
                <Input
                  id="branch-city"
                  value={formState.city}
                  onChange={(e) => setFormState((prev) => ({ ...prev, city: e.target.value }))}
                  placeholder="Baghdad"
                  disabled={disabled}
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

  const handleCreateBranch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    try {
      await createBranch({
        name: createForm.name,
        code: createForm.code,
        address: createForm.address || undefined,
        city: createForm.city || undefined,
        phone: createForm.phone || undefined,
        email: createForm.email || undefined,
      })
      resetForms()
      setIsCreateDialogOpen(false)
    } catch (error) {
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
          name: editForm.name,
          code: editForm.code,
          address: editForm.address || undefined,
          city: editForm.city || undefined,
          phone: editForm.phone || undefined,
          email: editForm.email || undefined,
        },
      })
      setIsEditDialogOpen(false)
      setEditingBranch(null)
    } catch (error) {
      setFormError('Unable to update branch. Please try again.')
    }
  }

  const openEditDialog = (branch: Branch) => {
    setEditingBranch(branch)
    setEditForm({
      name: branch.name_en ?? branch.name ?? '',
      code: branch.code ?? '',
      address: branch.address ?? '',
      city: branch.city ?? '',
      phone: branch.phone ?? '',
      email: branch.email ?? '',
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Branches</CardTitle>
            {data && (
              <span className="text-sm text-muted-foreground">
                Showing {data.data?.length ?? 0} of {data.total} branches
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

          {data && (data.data?.length ?? 0) === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No branches found.
            </div>
          )}

          {data && (data.data?.length ?? 0) > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact Info</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data.data ?? []).map((branch) => (
                    <TableRow key={branch.id}>
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
                        <Badge variant={branch.is_active ? 'default' : 'secondary'}>
                          {branch.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditDialog(branch)}>
                            <PencilLine className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => navigate(`/branches/${branch.id}/users`)}
                          >
                            <Users className="w-4 h-4 mr-2" />
                            Users
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewBranch(branch.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
