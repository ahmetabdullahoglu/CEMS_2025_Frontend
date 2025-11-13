import { DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { BranchBalancesResponse } from '@/types/branch.types'

interface BranchBalancesProps {
  data: BranchBalancesResponse
  isLoading?: boolean
}

export default function BranchBalances({ data, isLoading }: BranchBalancesProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Branch Balances</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading balances...
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Branch Balances</CardTitle>
          <div className="flex items-center gap-2 text-2xl font-bold">
            <DollarSign className="w-6 h-6" />
            {Number(data.total_usd_equivalent).toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Total USD Equivalent</p>
      </CardHeader>
      <CardContent>
        {data.balances.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No balances found for this branch.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Currency</TableHead>
                <TableHead className="text-right">Total Balance</TableHead>
                <TableHead className="text-right">Available</TableHead>
                <TableHead className="text-right">Reserved</TableHead>
                <TableHead className="text-right">Min Threshold</TableHead>
                <TableHead className="text-right">Max Threshold</TableHead>
                <TableHead className="text-right">USD Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.balances.map((balance) => (
                <TableRow key={balance.currency_code}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{balance.currency_code}</div>
                      <div className="text-sm text-muted-foreground">
                        {balance.currency_name}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {Number(balance.balance ?? 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    {balance.available_balance ? (
                      Number(balance.available_balance).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {balance.reserved_balance ? (
                      Number(balance.reserved_balance).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {balance.minimum_threshold ? (
                      Number(balance.minimum_threshold).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {balance.maximum_threshold ? (
                      Number(balance.maximum_threshold).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {balance.usd_value ? (
                      `$${Number(balance.usd_value).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    ) : balance.usd_equivalent ? (
                      `$${Number(balance.usd_equivalent).toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    ) : (
                      '-'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
