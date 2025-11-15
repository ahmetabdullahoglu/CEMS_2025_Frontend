import { useState } from 'react'
import { DownloadCloud } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useReportExport } from '@/hooks/useReports'

export default function ReportExportPanel() {
  const [reportName, setReportName] = useState('executive-summary')
  const [format, setFormat] = useState<'pdf' | 'excel' | 'csv'>('pdf')
  const [startDate, setStartDate] = useState('2024-01-01')
  const [endDate, setEndDate] = useState('2024-12-31')

  const exportMutation = useReportExport()

  const handleExport = (event: React.FormEvent) => {
    event.preventDefault()
    exportMutation.mutate({
      report_name: reportName,
      format,
      start_date: startDate,
      end_date: endDate,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DownloadCloud className="h-5 w-5" /> Export Reports
        </CardTitle>
        <p className="text-sm text-muted-foreground">Deliver reports to auditors or executives</p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleExport}>
          <div className="md:col-span-2">
            <Label htmlFor="report-name">Report Name</Label>
            <Input
              id="report-name"
              value={reportName}
              onChange={(event) => setReportName(event.target.value)}
              placeholder="finance-weekly"
            />
          </div>
          <div>
            <Label htmlFor="export-start-date">Start Date</Label>
            <Input
              id="export-start-date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="export-end-date">End Date</Label>
            <Input
              id="export-end-date"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
          <div>
            <Label>Format</Label>
            <Select value={format} onValueChange={(value: 'pdf' | 'excel' | 'csv') => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={exportMutation.isPending} className="w-full">
              {exportMutation.isPending ? 'Preparing...' : 'Export'}
            </Button>
          </div>
        </form>
        {exportMutation.isSuccess && exportMutation.data && (
          <p className="text-sm text-muted-foreground mt-4">
            File ready: <a className="text-primary underline" href={exportMutation.data.download_url}>Download</a>
          </p>
        )}
        {exportMutation.isError && (
          <p className="text-sm text-destructive mt-4">Export failed. Please retry.</p>
        )}
      </CardContent>
    </Card>
  )
}
