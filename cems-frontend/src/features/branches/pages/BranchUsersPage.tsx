import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Lock, Search, Shield, UserPlus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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
import { Badge } from '@/components/ui/badge'
import {
  useAssignUserToBranch,
  useBranch,
  useRemoveUserFromBranch,
} from '@/hooks/useBranches'
import { useUsers } from '@/hooks/useUsers'

export default function BranchUsersPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const branchId = id || ''

  const { data: branch, isLoading: branchLoading } = useBranch(branchId, !!branchId)
  const [assignedSearch, setAssignedSearch] = useState('')
  const [assignedPage, setAssignedPage] = useState(1)
  const assignedPageSize = 10
  const assignedSkip = (assignedPage - 1) * assignedPageSize
  const [sortField, setSortField] = useState<'name' | 'created_at'>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const { data: assignedUsers, isLoading: assignedLoading } = useUsers({
    skip: assignedSkip,
    limit: assignedPageSize,
    search: assignedSearch,
    branch_id: branchId,
  })

  const [assignSearch, setAssignSearch] = useState('')
  const [selectedUserId, setSelectedUserId] = useState('')
  const { data: availableUsers } = useUsers({ limit: 25, search: assignSearch })
  const { mutateAsync: assignUser, isPending: assigningUser } = useAssignUserToBranch()
  const { mutateAsync: removeUserFromBranch } = useRemoveUserFromBranch()
  const [assignStatus, setAssignStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [removingUserId, setRemovingUserId] = useState<string | null>(null)

  const sortedUsers = useMemo(() => {
    if (!assignedUsers?.data) return []
    const data = [...assignedUsers.data]
    return data.sort((a, b) => {
      let first = ''
      let second = ''
      if (sortField === 'name') {
        first = a.full_name ?? ''
        second = b.full_name ?? ''
      } else {
        first = a.created_at ?? ''
        second = b.created_at ?? ''
      }

      if (sortDirection === 'asc') {
        return first.localeCompare(second)
      }
      return second.localeCompare(first)
    })
  }, [assignedUsers?.data, sortDirection, sortField])

  const handleAssignUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedUserId || !branchId) return
    try {
      setAssignStatus('idle')
      await assignUser({ id: branchId, userId: selectedUserId })
      setAssignStatus('success')
      setSelectedUserId('')
    } catch (error) {
      setAssignStatus('error')
    }
  }

  const handleRemoveUser = async (userId: string) => {
    if (!branchId) return
    setRemovingUserId(userId)
    try {
      await removeUserFromBranch({ id: branchId, userId })
    } finally {
      setRemovingUserId(null)
    }
  }

  const totalPages = assignedUsers ? assignedUsers.total_pages : 1

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Branch Users</h1>
          {branch && (
            <p className="text-muted-foreground">
              Manage user assignments for {branch.name_en ?? branch.name}
            </p>
          )}
        </div>
      </div>

      {branchLoading && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Loading branch information...
          </CardContent>
        </Card>
      )}

      {branch && (
        <Card>
          <CardHeader>
            <CardTitle>{branch.name_en ?? branch.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{branch.code}</p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs uppercase text-muted-foreground">City</p>
                <p className="font-medium">{branch.city ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Region</p>
                <p className="font-medium">{branch.region?.replace(/_/g, ' ') ?? '-'}</p>
              </div>
              <div>
                <p className="text-xs uppercase text-muted-foreground">Status</p>
                <Badge variant={branch.is_active ? 'default' : 'secondary'}>
                  {branch.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <Card className="order-2 lg:order-1">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Assigned Users</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Use search and sorting to locate branch staff quickly.
                </p>
              </div>
              <div className="flex flex-col gap-2 md:flex-row md:items-center">
                <Input
                  placeholder="Search users..."
                  value={assignedSearch}
                  onChange={(e) => {
                    setAssignedSearch(e.target.value)
                    setAssignedPage(1)
                  }}
                  className="md:w-56"
                />
                <Select value={sortField} onValueChange={(value: 'name' | 'created_at') => setSortField(value)}>
                  <SelectTrigger className="md:w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="created_at">Created Date</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortDirection} onValueChange={(value: 'asc' | 'desc') => setSortDirection(value)}>
                  <SelectTrigger className="md:w-32">
                    <SelectValue placeholder="Direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Asc</SelectItem>
                    <SelectItem value="desc">Desc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {assignedLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading assigned users...
              </div>
            ) : sortedUsers.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">No users assigned.</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Shield className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{user.full_name ?? '-'}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">@{user.username}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{user.email}</div>
                            {user.phone_number && (
                              <div className="text-muted-foreground">{user.phone_number}</div>
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
                                <Lock className="w-3 h-3 mr-1" /> Locked
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveUser(user.id)}
                            disabled={removingUserId === user.id}
                          >
                            {removingUserId === user.id ? 'Removing...' : 'Remove'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {totalPages > 1 && (
                  <div className="mt-4 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAssignedPage((prev) => Math.max(1, prev - 1))}
                      disabled={assignedPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {assignedPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAssignedPage((prev) => prev + 1)}
                      disabled={assignedPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card className="order-1 lg:order-2">
          <CardHeader>
            <CardTitle>Assign User</CardTitle>
            <p className="text-sm text-muted-foreground">
              Use quick filters to attach staff to this branch via the /branches/{'{id}'}/users route.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAssignUser} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assign-search">Search available users</Label>
                <div className="flex gap-2">
                  <Input
                    id="assign-search"
                    placeholder="Search by name or username"
                    value={assignSearch}
                    onChange={(e) => setAssignSearch(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={() => setAssignSearch('')}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Select user</Label>
                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {(availableUsers?.data ?? []).map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name ?? user.username}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {assignStatus === 'success' && (
                <p className="text-sm text-green-600">User assigned successfully.</p>
              )}
              {assignStatus === 'error' && (
                <p className="text-sm text-destructive">Failed to assign user. Please retry.</p>
              )}

              <Button type="submit" disabled={!selectedUserId || assigningUser} className="w-full">
                <UserPlus className="w-4 h-4 mr-2" />
                {assigningUser ? 'Assigning...' : 'Assign to Branch'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
