import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { TooltipProps } from 'recharts/types/component/Tooltip'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { RevenueData } from '@/types/dashboard.types'

type RevenueTooltipPayload = {
  value?: number | string
  payload?: RevenueData
}

type RevenueTooltipProps = TooltipProps<number, string> & {
  payload?: ReadonlyArray<RevenueTooltipPayload>
}

const renderRevenueTooltip = ({ active, payload }: RevenueTooltipProps) => {
  if (!active || !payload?.length) {
    return null
  }

  const [firstPoint] = payload
  const revenuePoint = (firstPoint?.payload as RevenueData) ?? { date: '', revenue: 0 }
  const value = typeof firstPoint?.value === 'number' ? firstPoint.value : Number(firstPoint?.value ?? 0)

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
          <span className="font-bold text-muted-foreground">
            {new Date(revenuePoint.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">Revenue</span>
          <span className="font-bold">${value.toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}

interface RevenueChartProps {
  data: RevenueData[]
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trend</CardTitle>
        <CardDescription>Daily revenue over the past 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: string) => {
                  const date = new Date(value)
                  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                }}
              />
              <YAxis
                className="text-xs"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={renderRevenueTooltip} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
