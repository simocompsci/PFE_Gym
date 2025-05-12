import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

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
  { product: "Protein Powder", sales: 124 },
  { product: "Fitness Bands", sales: 98 },
  { product: "Gym Gloves", sales: 85 },
  { product: "Water Bottles", sales: 76 },
  { product: "Yoga Mats", sales: 62 },
]

const chartConfig = {
  sales: {
    label: "Units Sold",
    color: "#10b981", // Emerald color
  },
}

export function ProductsSalesChart({ data }) {
  // Use provided data or fall back to default
  const chartData = data || defaultChartData;
  
  // Find top selling product
  const getTopProduct = () => {
    if (!chartData || chartData.length === 0) return "None";
    
    return chartData.reduce((max, current) => 
      current.sales > max.sales ? current : max, chartData[0]).product;
  };
  
  // Calculate total sales
  const getTotalSales = () => {
    if (!chartData) return 0;
    return chartData.reduce((sum, product) => sum + product.sales, 0);
  };
  
  const topProduct = getTopProduct();
  const totalSales = getTotalSales();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Sales</CardTitle>
        <CardDescription>Top selling products</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: -20,
            }}
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
          Total of {totalSales} units sold this month
        </div>
      </CardFooter>
    </Card>
  )
}
