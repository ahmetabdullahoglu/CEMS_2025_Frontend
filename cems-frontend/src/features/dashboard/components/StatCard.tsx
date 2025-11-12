import { TrendingUp, TrendingDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: LucideIcon
  description?: string
}

export default function StatCard({ title, value, change, icon: Icon, description }: StatCardProps) {
  const showTrend = typeof change === 'number'
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="w-5 h-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {showTrend && (
          <div className="flex items-center mt-1 text-xs">
            {isPositive && (
              <>
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                <span className="text-green-500">+{change}%</span>
              </>
            )}
            {isNegative && (
              <>
                <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
                <span className="text-red-500">{change}%</span>
              </>
            )}
            {!isPositive && !isNegative && (
              <span className="text-muted-foreground">{change}%</span>
            )}
            <span className="ml-1 text-muted-foreground">from last month</span>
          </div>
        )}
        {description && !showTrend && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
