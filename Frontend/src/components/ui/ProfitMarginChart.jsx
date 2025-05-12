import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Default data if API data is not available yet
const defaultChartData = [
  { month: "January", margin: 28.4 },
  { month: "February", margin: 31.2 },
  { month: "March", margin: 29.8 },
  { month: "April", margin: 33.5 },
  { month: "May", margin: 30.7 },
  { month: "June", margin: 32.8 },
]

const chartConfig = {
  margin: {
    label: "Profit Margin %",
    color: "#8b5cf6", // Purple color
  },
}

export function ProfitMarginChart({ data }) {
  // Use provided data or fall back to default
  const chartData = data || defaultChartData;
  
  // Get current margin (last month in data)
  const getCurrentMargin = () => {
    if (!chartData || chartData.length === 0) return 0;
    return chartData[chartData.length - 1].margin;
  };
  
  // Calculate average margin
  const getAverageMargin = () => {
    if (!chartData || chartData.length === 0) return 0;
    const total = chartData.reduce((sum, month) => sum + month.margin, 0);
    return (total / chartData.length).toFixed(1);
  };
  
  const currentMargin = getCurrentMargin();
  const averageMargin = getAverageMargin();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profit Margins</CardTitle>
        <CardDescription>Monthly profit margin percentage</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
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
            <Line
              dataKey="margin"
              type="natural"
              stroke="#8b5cf6"
              strokeWidth={2}
              dot={{
                fill: "#8b5cf6",
              }}
              activeDot={{
                r: 6,
              }}
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
