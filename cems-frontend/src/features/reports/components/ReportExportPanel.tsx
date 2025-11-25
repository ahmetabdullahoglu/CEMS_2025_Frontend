import { useMemo, useState } from 'react'
import { DownloadCloud } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useReportExport } from '@/hooks/useReports'
import { useBranches } from '@/hooks/useBranches'
import { formatBranchLabel } from '@/utils/branch'

type ExportReportType = 'daily_summary' | 'monthly_revenue' | 'branch_performance' | 'balance_snapshot'
type ExportFormat = 'pdf' | 'excel' | 'json'

const today = new Date()
const todayDate = today.toISOString().slice(0, 10)
const currentYear = today.getFullYear()
const currentMonth = String(today.getMonth() + 1).padStart(2, '0')

export default function ReportExportPanel() {
  const [reportType, setReportType] = useState<ExportReportType>('daily_summary')
  const [format, setFormat] = useState<ExportFormat>('pdf')
  const [branchId, setBranchId] = useState<string>('all')
  const [date, setDate] = useState<string>(todayDate)
  const [snapshotDate, setSnapshotDate] = useState<string>(todayDate)
  const [year, setYear] = useState<string>(String(currentYear))
  const [month, setMonth] = useState<string>(currentMonth)
  const [startDate, setStartDate] = useState<string>(todayDate)
  const [endDate, setEndDate] = useState<string>(todayDate)

  const exportMutation = useReportExport()
  const branchesQuery = useBranches({ limit: 100 })

  const selectedBranchId = branchId === 'all' ? undefined : branchId

  const filters = useMemo(() => {
    switch (reportType) {
      case 'daily_summary':
        return { branch_id: selectedBranchId, date }
      case 'monthly_revenue':
        return {
          branch_id: selectedBranchId,
          year: Number(year) || undefined,
          month: Number(month) || undefined,
        }
      case 'branch_performance':
        return { start_date: startDate, end_date: endDate }
      case 'balance_snapshot':
        return {
          branch_id: selectedBranchId,
          date: snapshotDate,
          snapshot_date: snapshotDate,
          target_date: snapshotDate,
        }
      default:
        return {}
    }
  }, [date, endDate, month, reportType, selectedBranchId, snapshotDate, startDate, year])

  const handleExport = (event: React.FormEvent) => {
    event.preventDefault()
    exportMutation.mutate({
      report_type: reportType,
      format,
      filters,
    })
  }

  const branchOptions = branchesQuery.data?.data ?? []

  const renderBranchSelect = reportType !== 'branch_performance'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DownloadCloud className="h-5 w-5" /> Export Reports
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Build a report payload (JSON/Excel/PDF) tailored to the selected time frame.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleExport}>
          <div className="md:col-span-2">
            <Label htmlFor="report-type">Report Type</Label>
            <Select value={reportType} onValueChange={(value: ExportReportType) => setReportType(value)}>
              <SelectTrigger id="report-type">
                <SelectValue placeholder="Select report" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily_summary">Daily Summary</SelectItem>
                <SelectItem value="monthly_revenue">Monthly Revenue</SelectItem>
                <SelectItem value="branch_performance">Branch Performance</SelectItem>
                <SelectItem value="balance_snapshot">Balance Snapshot</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderBranchSelect && (
            <div>
              <Label htmlFor="branch-filter">Branch (optional)</Label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger id="branch-filter">
                  <SelectValue placeholder="All branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All branches</SelectItem>
                  {branchOptions
                    .filter((branch) => !!branch.id)
                    .map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {formatBranchLabel(branch)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {reportType === 'daily_summary' && (
            <div>
              <Label htmlFor="daily-date">Date</Label>
              <Input id="daily-date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </div>
          )}

          {reportType === 'monthly_revenue' && (
            <>
              <div>
                <Label htmlFor="month">Month</Label>
                <Input
                  id="month"
                  type="number"
                  min={1}
                  max={12}
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min={2000}
                  max={2100}
                  value={year}
                  onChange={(event) => setYear(event.target.value)}
                />
              </div>
            </>
          )}

          {reportType === 'branch_performance' && (
            <>
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                />
              </div>
            </>
          )}

          {reportType === 'balance_snapshot' && (
            <div>
              <Label htmlFor="snapshot-date">Snapshot date</Label>
              <Input
                id="snapshot-date"
                type="date"
                value={snapshotDate}
                onChange={(event) => setSnapshotDate(event.target.value)}
              />
            </div>
          )}

          <div>
            <Label>Format</Label>
            <Select value={format} onValueChange={(value: ExportFormat) => setFormat(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="json">JSON</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end md:col-span-2">
            <Button type="submit" disabled={exportMutation.isPending} className="w-full md:w-auto">
              {exportMutation.isPending ? 'Preparing...' : 'Export report'}
            </Button>
          </div>
        </form>

        {exportMutation.isSuccess && exportMutation.data && (
          <p className="text-sm text-muted-foreground mt-4">
            {exportMutation.data.file_name ? `${exportMutation.data.file_name} ready. ` : 'File ready. '}
            <a className="text-primary underline" href={exportMutation.data.download_url}>
              Download
            </a>
          </p>
        )}
        {exportMutation.isError && (
          <p className="text-sm text-destructive mt-4">Export failed. Please verify the filters and try again.</p>
        )}
      </CardContent>
    </Card>
  )
}
