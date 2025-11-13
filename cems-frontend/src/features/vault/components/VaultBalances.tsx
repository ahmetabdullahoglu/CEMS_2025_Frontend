import { formatDistanceToNow, format } from 'date-fns'
import { Vault, MapPin, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { VaultDetailsResponse } from '@/types/vault.types'

interface VaultBalancesProps {
  data: VaultDetailsResponse
  isLoading?: boolean
}

export default function VaultBalances({ data, isLoading }: VaultBalancesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Vault Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading vault information...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Vault Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Vault className="w-6 h-6" />
              <div>
                <CardTitle>{data.name ?? 'N/A'}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {data.vault_code ?? 'N/A'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={data.is_active ? 'default' : 'secondary'}>
                {data.is_active ? 'Active' : 'Inactive'}
              </Badge>
              <Badge variant="outline">
                {data.vault_type === 'main' ? 'Main Vault' : 'Branch Vault'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{data.description}</p>
              </div>
            )}
            {data.location && (
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>Location</span>
                </div>
                <p className="font-medium">{data.location}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="font-medium">
                {data.created_at ? format(new Date(data.created_at), 'PPP') : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">
                {data.updated_at ? formatDistanceToNow(new Date(data.updated_at), { addSuffix: true }) : 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Balances Card */}
      <Card>
        <CardHeader>
          <CardTitle>Currency Balances</CardTitle>
          <p className="text-sm text-muted-foreground">
            Total of {data.balances?.length ?? 0} currencies
          </p>
        </CardHeader>
        <CardContent>
          {(data?.balances ?? []).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No balances found in vault.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Last Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data?.balances ?? []).map((balance) => (
                  <TableRow key={balance.currency_code}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-bold">{balance.currency_code ?? 'N/A'}</div>
                        <div className="text-sm text-muted-foreground">
                          {balance.currency_name ?? 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-bold text-lg">
                        {Number(balance.balance ?? 0).toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {balance.last_updated
                          ? formatDistanceToNow(new Date(balance.last_updated), { addSuffix: true })
                          : 'N/A'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
