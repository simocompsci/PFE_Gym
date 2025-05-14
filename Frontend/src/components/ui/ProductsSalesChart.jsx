import React, { useState, useEffect } from 'react'
import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'
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
  { product: 'Protein Powder', sales: 124 },
  { product: 'Fitness Bands',  sales: 98  },
  { product: 'Gym Gloves',     sales: 85  },
  { product: 'Water Bottles',   sales: 76  },
  { product: 'Yoga Mats',       sales: 62  },
]

const chartConfig = {
  sales: {
    label: 'Units Sold',
    color: '#10b981', // Emerald color
  },
}

export function ProductsSalesChart() {
  const [chartData, setChartData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    async function fetchData() {
      try {
        const response = await analyticsService.getProductSales()
        // API returns { success: true, data: [...] }
        const data = response.data.data.map(item => ({
          product: item.product,
          sales: item.sales,
        }))
        if (isMounted) setChartData(data)
      } catch (err) {
        console.error('Error fetching product sales:', err)
        const msg = err.response?.data?.message || 'Unable to load product sales.'
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
          <CardTitle>Product Sales</CardTitle>
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
          <CardTitle>Product Sales</CardTitle>
        </CardHeader>
        <CardContent className="py-10 text-center text-red-600">{error}</CardContent>
      </Card>
    )
  }

  // Use fetched data or fallback
  const dataToRender = chartData && chartData.length > 0 ? chartData : defaultChartData

  // Determine top-selling product
  const topProduct = dataToRender.reduce((max, curr) =>
    curr.sales > max.sales ? curr : max, dataToRender[0]
  ).product

  // Calculate total units sold
  const totalSales = dataToRender.reduce((sum, item) => sum + item.sales, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Sales</CardTitle>
        <CardDescription>Top selling products</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={dataToRender}
            layout="vertical"
            margin={{ left: -20 }}
            accessibilityLayer
          >
            <XAxis type="number" dataKey="sales" hide />
            <YAxis
              dataKey="product"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={120}
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
            <Bar dataKey="sales" fill="#10b981" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {topProduct} is the best seller <TrendingUp className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Total of {totalSales.toLocaleString()} units sold this month
        </div>
      </CardFooter>
    </Card>
  )
}
export default ProductsSalesChart;