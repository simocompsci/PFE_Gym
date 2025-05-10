
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
const chartData = [
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

export function ProfitMarginChart() {
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
              content={<ChartTooltipContent hideLabel />}
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
          Current margin: 32.8% <TrendingUp className="h-4 w-4 text-purple-500" />
        </div>
        <div className="leading-none text-muted-foreground">
          Average margin: 31.1% over the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
