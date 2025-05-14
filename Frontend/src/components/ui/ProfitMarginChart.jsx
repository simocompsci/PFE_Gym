import React, { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { analyticsService } from '@/lib/api'

// Default data if API data is not available yet
const defaultChartData = [
  { month: 'January', margin: 28.4 },
  { month: 'February', margin: 31.2 },
  { month: 'March', margin: 29.8 },
  { month: 'April', margin: 33.5 },
  { month: 'May', margin: 30.7 },
  { month: 'June', margin: 32.8 },
]

const chartConfig = {
  margin: {
    label: 'Profit Margin %',
    color: '#8b5cf6', // Purple color
  },
}

export function ProfitMarginChart() {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function fetchData() {
      try {
        const response = await analyticsService.getProfitMargins()
        // API returns { success: true, data: [...] }
        const data = response.data.data.map(item => ({
          month: item.month,
          margin: item.margin,
        }))
        if (isMounted) setChartData(data)
          
      } catch (err) {
        console.error('Error fetching profit margins:', err)
        const msg = err.response?.data?.message || 'Unable to load profit margins.'
        if (isMounted) setError(msg)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchData()
    return () => { isMounted = false }
  }, [])

  // Loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profit Margins</CardTitle>
        </CardHeader>
        <CardContent className="py-10 text-center">Loading...</CardContent>
      </Card>
    )
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profit Margins</CardTitle>
        </CardHeader>
        <CardContent className="py-10 text-center text-red-600">{error}</CardContent>
      </Card>
    )
  }

  // Use fetched data or fallback
  const dataToRender = chartData && chartData.length === 6 ? chartData : defaultChartData

  // Get current and average margin
  const currentMargin = dataToRender[dataToRender.length - 1].margin
  const averageMargin = (
    dataToRender.reduce((sum, m) => sum + m.margin, 0) / dataToRender.length
  ).toFixed(1)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit Margins</CardTitle>
        <CardDescription>Monthly profit margin percentage</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart data={dataToRender} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={val => val.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent className="bg-white text-gray-800 shadow-lg border border-gray-100" />}
            />
            <Line
              dataKey="margin"
              type="natural"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{ fill: '#8b5cf6' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Current margin: {currentMargin}% <TrendingUp className="h-4 w-4 text-purple-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Average margin: {averageMargin}% over the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
export default ProfitMarginChart