import { useEffect, useMemo, useState } from 'react'
import { RefreshCw, Zap } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useActiveCurrencies } from '@/hooks/useCurrencies'
import {
  useApproveRateSync,
  useInitiateRateSync,
  useRateSyncRequest,
  useRejectRateSync,
} from '@/hooks/useRateSync'
import type { RateSyncInitiateResponse, RateSyncRateEntry } from '@/types/rate-sync.types'

interface RateSyncDialogProps {
  open: boolean
  onClose: () => void
  onApproveSuccess?: () => void
  onRejectSuccess?: () => void
}

export function RateSyncDialog({ open, onClose, onApproveSuccess, onRejectSuccess }: RateSyncDialogProps) {
  const { data: activeCurrencies } = useActiveCurrencies()
  const [source, setSource] = useState('auto')
  const [selectedTargets, setSelectedTargets] = useState<string[]>([])
  const [lastRequestId, setLastRequestId] = useState<string | undefined>()
  const [lastResponse, setLastResponse] = useState<RateSyncInitiateResponse | undefined>()
  const [approveNotes, setApproveNotes] = useState('')
  const [approveSpread, setApproveSpread] = useState('')
  const [rejectNotes, setRejectNotes] = useState('')

  const baseCurrency = useMemo(
    () => activeCurrencies?.find((entry) => entry.is_base_currency),
    [activeCurrencies]
  )

  const targetCurrencies = useMemo(
    () => activeCurrencies?.filter((entry) => entry.id !== baseCurrency?.id) ?? [],
    [activeCurrencies, baseCurrency?.id]
  )

  useEffect(() => {
    if (open && targetCurrencies.length > 0 && selectedTargets.length === 0) {
      setSelectedTargets(targetCurrencies.map((c) => c.code))
    }
  }, [open, targetCurrencies, selectedTargets.length])

  useEffect(() => {
    if (!open) {
      setLastRequestId(undefined)
      setLastResponse(undefined)
      setApproveNotes('')
      setApproveSpread('')
      setRejectNotes('')
    }
  }, [open])

  const { mutate: initiateSync, isPending: isInitiating } = useInitiateRateSync()
  const { data: requestDetails, refetch: refetchRequest, isFetching: isLoadingRequest } =
    useRateSyncRequest(lastRequestId, open)
  const { mutate: approveRequest, isPending: isApproving } = useApproveRateSync()
  const { mutate: rejectRequest, isPending: isRejecting } = useRejectRateSync()

  const summary = requestDetails ?? lastResponse
  const hasSelection = selectedTargets.length > 0

  const handleToggleTarget = (code: string) => {
    setSelectedTargets((prev) =>
      prev.includes(code) ? prev.filter((item) => item !== code) : [...prev, code]
    )
  }

  const handleInitiate = () => {
    if (!baseCurrency || !hasSelection) return
    initiateSync(
      {
        base_currency: baseCurrency.code,
        source,
        target_currencies: selectedTargets,
      },
      {
        onSuccess: (data) => {
          setLastRequestId(data.request_id)
          setLastResponse(data)
        },
      }
    )
  }

  const handleApprove = () => {
    if (!lastRequestId) return
    approveRequest(
      {
        requestId: lastRequestId,
        payload: {
          notes: approveNotes || undefined,
          spread_percentage: approveSpread ? Number(approveSpread) : undefined,
        },
      },
      {
        onSuccess: () => {
          refetchRequest()
          onApproveSuccess?.()
          onClose()
        },
      }
    )
  }

  const handleReject = () => {
    if (!lastRequestId) return
    rejectRequest(
      { requestId: lastRequestId, payload: { notes: rejectNotes || undefined } },
      {
        onSuccess: () => {
          refetchRequest()
          onRejectSuccess?.()
          onClose()
        },
      }
    )
  }

  const ratesEntries = useMemo(() => {
    if (!summary?.rates) return []
    return Object.entries(summary.rates).map(([pair, details]) => ({ pair, details }))
  }, [summary?.rates])

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" /> Initiate Rate Sync
          </DialogTitle>
          <DialogDescription>
            Fetch latest exchange rates from the external source, create a pending request, and review the
            proposed updates before applying.
          </DialogDescription>
        </DialogHeader>

        {!baseCurrency ? (
          <div className="text-center py-10 text-muted-foreground">Base currency not found.</div>
        ) : (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <Card>
              <CardHeader>
                <CardTitle>Request configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Base currency</Label>
                    <Input value={`${baseCurrency.code} — ${baseCurrency.name}`} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Source</Label>
                    <Select value={source} onValueChange={(val) => setSource(val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Auto</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label>Target currencies</Label>
                    <div className="flex gap-2 text-sm">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTargets(targetCurrencies.map((c) => c.code))}
                      >
                        Select all
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTargets([])}
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {targetCurrencies.map((currency) => (
                      <label
                        key={currency.id}
                        className="flex items-center gap-2 rounded border p-2 text-sm cursor-pointer hover:bg-muted"
                      >
                        <Checkbox
                          checked={selectedTargets.includes(currency.code)}
                          onCheckedChange={() => handleToggleTarget(currency.code)}
                        />
                        <span className="font-medium">{currency.code}</span>
                        <span className="text-muted-foreground">{currency.name}</span>
                      </label>
                    ))}
                    {targetCurrencies.length === 0 && (
                      <div className="text-muted-foreground text-sm">No targets available.</div>
                    )}
                  </div>
                  {!hasSelection && (
                    <p className="text-sm text-red-600">Select at least one target currency.</p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isInitiating || isApproving || isRejecting}
                  >
                    Close
                  </Button>
                  <Button
                    type="button"
                    onClick={handleInitiate}
                    disabled={!hasSelection || isInitiating}
                  >
                    {isInitiating ? 'Starting sync...' : 'Initiate sync'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {lastRequestId && (
              <Card>
                <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-base">Request {lastRequestId}</CardTitle>
                  <div className="flex gap-2 items-center text-sm text-muted-foreground">
                    <Badge variant="outline">Status: {summary?.status ?? 'pending'}</Badge>
                    {summary?.expires_at && <span>Expires {new Date(summary.expires_at).toLocaleString()}</span>}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => refetchRequest()}
                      disabled={isLoadingRequest}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" /> Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                    <div>
                      <div className="font-semibold text-foreground">Source</div>
                      {summary?.source ?? '—'}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Rates fetched</div>
                      {summary?.rates_count ?? ratesEntries.length} pairs
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">Base</div>
                      {summary?.base_currency}
                    </div>
                  </div>

                  <div className="rounded border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pair</TableHead>
                          <TableHead className="text-right">Current</TableHead>
                          <TableHead className="text-right">Fetched</TableHead>
                          <TableHead className="text-right">Change</TableHead>
                          <TableHead className="text-right">Δ %</TableHead>
                          <TableHead>Source</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ratesEntries.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                              No rate comparisons returned.
                            </TableCell>
                          </TableRow>
                        ) : (
                          ratesEntries.map(({ pair, details }) => (
                            <RateRow key={pair} pair={pair} details={details} />
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <div className="font-semibold">Approve and apply</div>
                      <Input
                        placeholder="Notes (optional)"
                        value={approveNotes}
                        onChange={(e) => setApproveNotes(e.target.value)}
                        disabled={isApproving || isRejecting}
                      />
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="Spread percentage (optional)"
                        value={approveSpread}
                        onChange={(e) => setApproveSpread(e.target.value)}
                        disabled={isApproving || isRejecting}
                      />
                      <Button
                        type="button"
                        onClick={handleApprove}
                        disabled={isApproving || isRejecting}
                      >
                        {isApproving ? 'Applying rates...' : 'Approve request'}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="font-semibold">Reject request</div>
                      <Input
                        placeholder="Rejection notes (optional)"
                        value={rejectNotes}
                        onChange={(e) => setRejectNotes(e.target.value)}
                        disabled={isRejecting || isApproving}
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleReject}
                        disabled={isRejecting || isApproving}
                      >
                        {isRejecting ? 'Rejecting...' : 'Reject request'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DialogFooter className="hidden" />
      </DialogContent>
    </Dialog>
  )
}

function RateRow({ pair, details }: { pair: string; details: RateSyncRateEntry }) {
  const changeNumber = Number(details.change_percentage)
  const changeLabel = isNaN(changeNumber) ? null : `${changeNumber.toFixed(2)}%`
  return (
    <TableRow>
      <TableCell className="font-medium">{pair}</TableCell>
      <TableCell className="text-right">{details.current_rate ?? '—'}</TableCell>
      <TableCell className="text-right">{details.fetched_rate}</TableCell>
      <TableCell className="text-right">{details.change}</TableCell>
      <TableCell className={`text-right ${changeNumber > 0 ? 'text-green-600' : changeNumber < 0 ? 'text-red-600' : ''}`}>
        {changeLabel ?? '—'}
      </TableCell>
      <TableCell>{details.source}</TableCell>
    </TableRow>
  )
}
