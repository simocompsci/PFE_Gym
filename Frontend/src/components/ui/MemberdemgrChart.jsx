import React, { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
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
  { ageGroup: '18-24', members: 42 },
  { ageGroup: '25-34', members: 78 },
  { ageGroup: '35-44', members: 65 },
  { ageGroup: '45-54', members: 39 },
  { ageGroup: '55+',   members: 24 },
]

const chartConfig = {
  members: {
    label: 'Members',
    color: '#3b82f6', // Blue color
  },
}

export function MemberdemgrChart() {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function fetchData() {
      try { 
        const response = await analyticsService.getAgeDistribution()
        const data = response.data.data
        if (isMounted) setChartData(data)
      } catch (err) {
        console.error('Error fetching age distribution:', err)
        const msg = err.response?.data?.message || 'Unable to load age demographics.'
        if (isMounted) setError(msg)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchData()
    return () => { isMounted = false }
  }, [])

  // Render loading state
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Member Demographics</CardTitle>
        </CardHeader>
        <CardContent className="py-10 text-center">Loading...</CardContent>
      </Card>
    )
  }

  // Render error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Member Demographics</CardTitle>
        </CardHeader>
        <CardContent className="py-10 text-center text-red-600">
          {error}
        </CardContent>
      </Card>
    )
  }

  // Use fetched data or fallback
  const dataToRender = chartData && chartData.length > 0 ? chartData : defaultChartData

  // Find largest age group
  const largestGroup = dataToRender.reduce((max, curr) => 
    curr.members > max.members ? curr : max, dataToRender[0]
  ).ageGroup

  // Calculate total members
  const totalMembers = dataToRender.reduce((sum, grp) => sum + grp.members, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Demographics</CardTitle>
        <CardDescription>Age group distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={dataToRender}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="ageGroup"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  className="bg-white text-gray-800 shadow-lg border border-gray-100"
                />
              }
            />
            <Bar dataKey="members" fill="#3b82f6" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {largestGroup} age group is the largest segment <TrendingUp className="h-4 w-4 text-blue-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total of {totalMembers.toLocaleString()} members across all age groups
        </div>
      </CardFooter>
    </Card>
  )
}
export default MemberdemgrChart;