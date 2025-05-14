import React, { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
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
  { month: 'January', revenue: 18600, expenses: 12400 },
  { month: 'February', revenue: 22500, expenses: 15200 },
  { month: 'March', revenue: 19800, expenses: 13500 },
  { month: 'April', revenue: 24500, expenses: 16800 },
  { month: 'May', revenue: 26700, expenses: 17900 },
  { month: 'June', revenue: 28400, expenses: 19200 },
]

const chartConfig = {
  revenue: { label: 'Revenue', color: '#3b82f6' },
  expenses: { label: 'Expenses', color: '#ef4444' },
}

export function RevenueChart() {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function fetchData() {
      try {
        const response = await analyticsService.getRevenueData()
        // API returns { success: true, data: [...] }
        const data = response.data.data.map(item => ({
          month: item.month,
          revenue: item.revenue,
          expenses: item.expenses,
        }));
        if (isMounted) setChartData(data)
      } catch (err) {
        console.error('Error fetching revenue data:', err)
        const msg = err.response?.data?.message || 'Unable to load revenue data.'
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
          <CardTitle>Revenue Trends</CardTitle>
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
          <CardTitle>Revenue Trends</CardTitle>
        </CardHeader>
        <CardContent className="py-10 text-center text-red-600">{error}</CardContent>
      </Card>
    )
  }

  // Use fetched data or fallback
  const dataToRender = chartData && chartData.length === 6 ? chartData : defaultChartData

  // Calculate percentage increase from previous month
  const calculateIncrease = () => {
    if (dataToRender.length < 2) return 0
    const last = dataToRender[dataToRender.length - 1].revenue
    const prev = dataToRender[dataToRender.length - 2].revenue
    return ((last - prev) / prev * 100).toFixed(1)
  }
  const increasePercentage = calculateIncrease()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
        <CardDescription>Monthly revenue breakdown for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={dataToRender} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={val => val.slice(0,3)} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent className="bg-white text-gray-800 shadow-lg border border-gray-100" />} />
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area dataKey="expenses" type="natural" fill="url(#fillExpenses)" fillOpacity={0.4} stroke="#ef4444" stackId="a" />
            <Area dataKey="revenue" type="natural" fill="url(#fillRevenue)" fillOpacity={0.4} stroke="#3b82f6" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Revenue increased by {increasePercentage}% this month <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Last 6 months financial performance
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

export default RevenueChart;