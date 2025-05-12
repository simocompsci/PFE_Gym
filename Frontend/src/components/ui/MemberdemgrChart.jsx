import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

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
  { ageGroup: "18-24", members: 42 },
  { ageGroup: "25-34", members: 78 },
  { ageGroup: "35-44", members: 65 },
  { ageGroup: "45-54", members: 39 },
  { ageGroup: "55+", members: 24 },
]

const chartConfig = {
  members: {
    label: "Members",
    color: "#3b82f6", // Blue color
  },
}

export function MemberdemgrChart({ data }) {
  // Use provided data or fall back to default
  const chartData = data || defaultChartData;
  
  // Find the age group with most members
  const getLargestGroup = () => {
    if (!chartData || chartData.length === 0) return "None";
    
    return chartData.reduce((max, current) => 
      current.members > max.members ? current : max, chartData[0]).ageGroup;
  };
  
  // Calculate total members
  const getTotalMembers = () => {
    if (!chartData) return 0;
    return chartData.reduce((sum, group) => sum + group.members, 0);
  };
  
  const largestGroup = getLargestGroup();
  const totalMembers = getTotalMembers();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Demographics</CardTitle>
        <CardDescription>Age group distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
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
          Total of {totalMembers} members across all age groups
        </div>
      </CardFooter>
    </Card>
  )
}
