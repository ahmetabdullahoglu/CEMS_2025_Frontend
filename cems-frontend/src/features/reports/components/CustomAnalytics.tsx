import { useState } from 'react'
import { format, subDays } from 'date-fns'
import { FileSearch, Download } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { CustomReportParams } from '@/types/report.types'
import { useCustomReport, useReportExport } from '@/hooks/useReports'

const METRICS = ['count', 'sum', 'average']

export default function CustomAnalytics() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const defaultStart = format(subDays(new Date(), 7), 'yyyy-MM-dd')
  const [formState, setFormState] = useState<CustomReportParams>({
    report_type: 'transactions',
    start_date: defaultStart,
    end_date: today,
    group_by: 'day',
    metrics: ['count', 'sum'],
  })
  const [submittedParams, setSubmittedParams] = useState<CustomReportParams | undefined>(undefined)

  const { data, isLoading, isFetching } = useCustomReport(submittedParams, !!submittedParams)
  const exportMutation = useReportExport()

  const handleChange = <K extends keyof CustomReportParams>(key: K, value: CustomReportParams[K]) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const toggleMetric = (metric: string) => {
    setFormState((prev) => ({
      ...prev,
      metrics: prev.metrics?.includes(metric)
        ? prev.metrics?.filter((m) => m !== metric)
        : [...(prev.metrics ?? []), metric],
    }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    setSubmittedParams(formState)
  }

  const handleExport = () => {
    exportMutation.mutate({
      report_type: `${formState.report_type}-custom`,
      format: 'csv',
      filters: formState,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSearch className="h-5 w-5" /> Custom Analytics Builder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div>
              <Label>Report Type</Label>
              <Select value={formState.report_type} onValueChange={(value: CustomReportParams['report_type']) => handleChange('report_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transactions">Transactions</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="balances">Balances</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="exchanges">Exchanges</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Group By</Label>
              <Select value={formState.group_by} onValueChange={(value: NonNullable<CustomReportParams['group_by']>) => handleChange('group_by', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Daily</SelectItem>
                  <SelectItem value="week">Weekly</SelectItem>
                  <SelectItem value="month">Monthly</SelectItem>
                  <SelectItem value="branch">Branch</SelectItem>
                  <SelectItem value="currency">Currency</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={formState.start_date}
                max={formState.end_date}
                onChange={(event) => handleChange('start_date', event.target.value)}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={formState.end_date}
                min={formState.start_date}
                max={today}
                onChange={(event) => handleChange('end_date', event.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Metrics</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {METRICS.map((metric) => (
                  <Button
                    type="button"
                    key={metric}
                    variant={formState.metrics?.includes(metric) ? 'default' : 'outline'}
                    onClick={() => toggleMetric(metric)}
                    size="sm"
                  >
                    {metric}
                  </Button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <Button type="submit" disabled={isLoading || isFetching}>
                {isLoading || isFetching ? 'Generating...' : 'Run Analytics'}
              </Button>
              <Button type="button" variant="secondary" onClick={handleExport} disabled={exportMutation.isPending}>
                <Download className="h-4 w-4 mr-2" />
                {exportMutation.isPending ? 'Exporting...' : 'Export'}
              </Button>
              {exportMutation.isSuccess && exportMutation.data && (
                <a className="text-sm text-primary underline" href={exportMutation.data.download_url}>
                  Download ready report
                </a>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {submittedParams && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground">Loading custom analytics...</p>
            ) : data ? (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {Object.keys(data.data?.[0] ?? {}).map((column) => (
                        <TableHead key={column} className="capitalize">
                          {column.replace(/_/g, ' ')}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data?.slice(0, 8).map((row, index) => (
                      <TableRow key={index}>
                        {Object.keys(row).map((key) => (
                          <TableCell key={key}>{String(row[key])}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <pre className="bg-muted rounded-md p-4 text-sm overflow-x-auto">
                  {JSON.stringify(data.summary, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-muted-foreground">No data generated yet.</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
