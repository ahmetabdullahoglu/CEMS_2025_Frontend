import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { KeyRound, Lock, PencilLine, Plus, Search, Shield, User as UserIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  useCreateUser,
  useResetUserPassword,
  useToggleLockUser,
  useUpdateUser,
  useUsers,
} from '@/hooks/useUsers'
import { useBranches } from '@/hooks/useBranches'
import type { User } from '@/types/user.types'
import { format } from 'date-fns'

type UserFormState = {
  username: string
  email: string
  password: string
  full_name: string
  phone_number: string
}

const defaultUserForm: UserFormState = {
  username: '',
  email: '',
  password: '',
  full_name: '',
  phone_number: '',
}

type UserUpdateFormState = {
  email: string
  full_name: string
  phone_number: string
  is_active: boolean
}

const defaultUpdateForm: UserUpdateFormState = {
  email: '',
  full_name: '',
  phone_number: '',
  is_active: true,
}

const usernamePattern = /^[A-Za-z0-9._-]{3,50}$/
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const createPhonePattern = /^\+[0-9\s]{9,19}$/

const validatePassword = (password: string): string | null => {
  if (password.length < 8) return 'Password must be at least 8 characters long'
  if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter'
  if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter'
  if (!/[0-9]/.test(password)) return 'Password must include at least one number'
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must include at least one special character'
  return null
}

const validateUserCreateForm = (form: UserFormState): string | null => {
  if (!usernamePattern.test(form.username)) {
    return 'Username can only contain letters, numbers, dots, hyphens, and underscores'
  }

  if (!emailPattern.test(form.email)) {
    return 'Please enter a valid email address'
  }

  if (form.full_name.trim().length < 2 || form.full_name.trim().length > 100) {
    return 'Full name must be between 2 and 100 characters'
  }

  const passwordError = validatePassword(form.password)
  if (passwordError) return passwordError

  if (form.phone_number) {
    const trimmedPhone = form.phone_number.trim()
    if (!createPhonePattern.test(trimmedPhone) || trimmedPhone.replace(/\s/g, '').length > 20) {
      return 'Invalid phone number format. Use international format (e.g., +90 555 123 4567)'
    }
  }

  return null
}

const validateUserUpdateForm = (form: UserUpdateFormState): string | null => {
  if (form.email && !emailPattern.test(form.email)) {
    return 'Please enter a valid email address'
  }

  if (form.full_name.trim().length < 2 || form.full_name.trim().length > 100) {
    return 'Full name must be between 2 and 100 characters'
  }

  if (form.phone_number) {
    const normalized = form.phone_number.trim()
    const numericLength = normalized.replace(/[^0-9]/g, '').length
    if (!/^\+?[0-9\s-]+$/.test(normalized) || numericLength < 10 || numericLength > 20) {
      return 'Invalid phone number format'
    }
  }

  return null
}

export default function UsersPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const skip = (page - 1) * pageSize
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [branchFilter, setBranchFilter] = useState('all')

  const { data: branchesData } = useBranches({ limit: 100 })
  const branchFilterLabel = branchesData?.data?.find((branch) => branch.id === branchFilter)?.name_en

  const { data, isLoading, isError } = useUsers({
    skip,
    limit: pageSize,
    search,
    branch_id: branchFilter === 'all' ? undefined : branchFilter,
  })

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [createForm, setCreateForm] = useState<UserFormState>(defaultUserForm)
  const [editForm, setEditForm] = useState<UserUpdateFormState>(defaultUpdateForm)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [resetUser, setResetUser] = useState<User | null>(null)
  const [resetPasswordValue, setResetPasswordValue] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [resetStatus, setResetStatus] = useState<'idle' | 'error' | 'success'>('idle')

  const { mutateAsync: createUser, isPending: creatingUser } = useCreateUser()
  const { mutateAsync: updateUser, isPending: updatingUser } = useUpdateUser()
  const { mutate: toggleLockUser, isPending: lockingUser } = useToggleLockUser()
  const { mutateAsync: resetUserPassword, isPending: resettingPassword } = useResetUserPassword()

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    if (!data) return []
    const totalPages = data.total_pages
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

  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormError(null)
    const validationError = validateUserCreateForm(createForm)
    if (validationError) {
      setFormError(validationError)
      return
    }

    const normalizedPhone = createForm.phone_number.trim()
    const phoneNumber = normalizedPhone ? normalizedPhone.replace(/\s+/g, ' ') : undefined

    try {
      await createUser({
        username: createForm.username,
        email: createForm.email,
        password: createForm.password,
        full_name: createForm.full_name.trim(),
        phone_number: phoneNumber,
      })
      setCreateForm(defaultUserForm)
      setCreateDialogOpen(false)
    } catch {
      setFormError('Failed to create user. Please verify the data and try again.')
    }
  }

  const handleEditUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingUser) return
    setFormError(null)

    const validationError = validateUserUpdateForm(editForm)
    if (validationError) {
      setFormError(validationError)
      return
    }

    const normalizedPhone = editForm.phone_number.trim()
    const phoneNumber = normalizedPhone ? normalizedPhone.replace(/\s+/g, ' ') : undefined

    try {
      await updateUser({
        id: editingUser.id,
        data: {
          email: editForm.email,
          full_name: editForm.full_name.trim(),
          phone_number: phoneNumber,
          is_active: editForm.is_active,
        },
      })
      setEditDialogOpen(false)
      setEditingUser(null)
    } catch {
      setFormError('Unable to update user. Please try again.')
    }
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setEditForm({
      email: user.email ?? '',
      full_name: user.full_name ?? '',
      phone_number: user.phone_number ?? '',
      is_active: user.is_active,
    })
    setFormError(null)
    setEditDialogOpen(true)
  }

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!resetUser || !resetPasswordValue) return
    try {
      setResetStatus('idle')
      await resetUserPassword({ id: resetUser.id, newPassword: resetPasswordValue })
      setResetStatus('success')
      setResetPasswordValue('')
    } catch {
      setResetStatus('error')
    }
  }

  const openResetDialog = (user: User) => {
    setResetUser(user)
    setResetPasswordValue('')
    setResetStatus('idle')
    setResetDialogOpen(true)
  }

  const handleToggleLock = (user: User) => {
    toggleLockUser({ id: user.id, lock: !user.is_locked })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground">Manage system users and permissions</p>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Search Users</CardTitle>
            <Dialog
              open={createDialogOpen}
              onOpenChange={(open) => {
                setCreateDialogOpen(open)
                if (!open) {
                  setCreateForm(defaultUserForm)
                  setFormError(null)
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <DialogHeader>
                    <DialogTitle>Create User</DialogTitle>
                    <DialogDescription>Invite a new teammate to CEMS.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="create-username">Username</Label>
                      <Input
                        id="create-username"
                        value={createForm.username}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, username: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="create-email">Email</Label>
                      <Input
                        id="create-email"
                        type="email"
                        value={createForm.email}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="create-password">Temporary Password</Label>
                      <Input
                        id="create-password"
                        type="password"
                        value={createForm.password}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="create-name">Full Name</Label>
                      <Input
                        id="create-name"
                        value={createForm.full_name}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, full_name: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="create-phone">Phone Number</Label>
                      <Input
                        id="create-phone"
                        value={createForm.phone_number}
                        onChange={(e) => setCreateForm((prev) => ({ ...prev, phone_number: e.target.value }))}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                  {formError && <p className="text-sm text-destructive">{formError}</p>}
                  <DialogFooter>
                    <Button type="submit" disabled={creatingUser}>
                      {creatingUser ? 'Saving...' : 'Create User'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Search by username, email, or full name..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <div className="flex gap-2">
              <Select
                value={branchFilter}
                onValueChange={(value) => {
                  setBranchFilter(value)
                  setPage(1)
                }}
              >
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Filter by branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All branches</SelectItem>
                  {(branchesData?.data ?? []).map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name_en ?? branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleSearch}>
                <Search className="w-4 h-4 mr-2" />
                Apply
              </Button>
            </div>
          </div>
          {branchFilter !== 'all' && (
            <p className="mt-2 text-sm text-muted-foreground">
              Viewing users assigned to {branchFilterLabel ?? 'selected branch'}.{' '}
              <Button
                variant="link"
                className="px-0"
                onClick={() => navigate(`/branches/${branchFilter}/users`)}
              >
                Manage assignments
              </Button>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Users</CardTitle>
            {data && (
              <span className="text-sm text-muted-foreground">
                Showing {data.data?.length ?? 0} of {data.total} users
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="text-center py-8 text-muted-foreground">
              Loading users...
            </div>
          )}

          {isError && (
            <div className="text-center py-8 text-red-500">
              Error loading users. Please try again.
            </div>
          )}

          {data && (data.data?.length ?? 0) === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found.
            </div>
          )}

          {data && (data.data?.length ?? 0) > 0 && (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(data.data ?? []).map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{user.full_name ?? 'N/A'}</span>
                            {user.is_superuser && (
                              <Shield className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">@{user.username ?? 'N/A'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          <div>{user.email ?? 'N/A'}</div>
                          {user.phone_number && (
                            <div className="text-muted-foreground">{user.phone_number}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <Badge key={role.id} variant="outline" className="text-xs">
                                {role.display_name_ar ?? role.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground">No roles</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge variant={user.is_active ? 'default' : 'secondary'}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          {user.is_locked && (
                            <Badge variant="destructive" className="text-xs">
                              <Lock className="w-3 h-3 mr-1" />
                              Locked
                            </Badge>
                          )}
                          {user.failed_login_attempts > 0 && (
                            <span className="text-xs text-orange-600">
                              {user.failed_login_attempts} failed attempts
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.last_login ? (
                          <div className="text-sm">
                            <div>{format(new Date(user.last_login), 'PPp')}</div>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Never</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditDialog(user)}>
                            <PencilLine className="w-4 h-4 mr-1" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleToggleLock(user)}
                            disabled={lockingUser}
                          >
                            <Lock className="w-4 h-4 mr-1" />
                            {user.is_locked ? 'Unlock' : 'Lock'}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => openResetDialog(user)}>
                            <KeyRound className="w-4 h-4 mr-1" /> Reset
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {(() => {
                const totalPages = data.total_pages
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

      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open)
          if (!open) {
            setEditingUser(null)
            setEditForm(defaultUpdateForm)
            setFormError(null)
          }
        }}
      >
        <DialogContent>
          <form onSubmit={handleEditUser} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update profile information for {editingUser?.full_name ?? editingUser?.username}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-name">Full Name</Label>
                <Input
                  id="edit-name"
                  value={editForm.full_name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, full_name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={editForm.phone_number}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, phone_number: e.target.value }))}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-active"
                  checked={editForm.is_active}
                  onCheckedChange={(checked) =>
                    setEditForm((prev) => ({ ...prev, is_active: checked === true }))
                  }
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
            </div>
            {formError && <p className="text-sm text-destructive">{formError}</p>}
            <DialogFooter>
              <Button type="submit" disabled={updatingUser}>
                {updatingUser ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={resetDialogOpen}
        onOpenChange={(open) => {
          setResetDialogOpen(open)
          if (!open) {
            setResetUser(null)
            setResetPasswordValue('')
            setResetStatus('idle')
          }
        }}
      >
        <DialogContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Issue a one-time password for {resetUser?.full_name ?? resetUser?.username}
              </DialogDescription>
            </DialogHeader>
            <div>
              <Label htmlFor="reset-password">New Password</Label>
              <Input
                id="reset-password"
                type="password"
                value={resetPasswordValue}
                onChange={(e) => setResetPasswordValue(e.target.value)}
                required
              />
            </div>
            {resetStatus === 'success' && (
              <p className="text-sm text-green-600">Password reset successfully.</p>
            )}
            {resetStatus === 'error' && (
              <p className="text-sm text-destructive">Unable to reset password. Please try again.</p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={resettingPassword}>
                {resettingPassword ? 'Resetting...' : 'Reset Password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
