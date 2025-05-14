import React, { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import { Label, Pie, PieChart } from 'recharts'
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

// Chart fill colors config
const chartConfig = {
  Gold: { color: '#fbbf24' },
  Silver: { color: '#94a3b8' },
  Bronze: { color: '#b45309' },
}

export function MembershipStatsChart() {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function fetchData() {
      try {
        const response = await analyticsService.getMembershipDistribution()
        // API returns { success: true, data: [...] }
        const data = response.data.data
        // add fill color based on plan
        const formatted = data.map(item => ({
          plan: item.plan,
          members: item.members,
          fill: chartConfig[item.plan]?.color || '#ccc',
        }))
        if (isMounted) setChartData(formatted)
      } catch (err) {
        console.error('Error fetching membership distribution:', err)
        if (isMounted) setError('Unable to load membership stats.')
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
          <CardTitle>Membership Distribution</CardTitle>
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
          <CardTitle>Membership Distribution</CardTitle>
        </CardHeader>
        <CardContent className="py-10 text-center text-red-600">
          {error}
        </CardContent>
      </Card>
    )
  }

  // Calculate total members
  const totalMembers = chartData.reduce((sum, { members }) => sum + members, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Membership Distribution</CardTitle>
        <CardDescription>Current active memberships</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{ members: { label: 'Members' } }}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  className="bg-white text-gray-800 shadow-lg border border-gray-100"
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="members"
              nameKey="plan"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (!viewBox || typeof viewBox.cx !== 'number') return null
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalMembers.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy + 24}
                        className="fill-muted-foreground"
                      >
                        Members
                      </tspan>
                    </text>
                  )
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Membership growth of 8.3% this month <TrendingUp className="h-4 w-4 text-green-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Gold plan showing highest growth rate
        </div>
      </CardFooter>
    </Card>
  )
}

export default MembershipStatsChart;