
import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

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
  { plan: "gold", members: 85, fill: "#fbbf24" },
  { plan: "silver", members: 112, fill: "#94a3b8" },
  { plan: "bronze", members: 51, fill: "#b45309" },
]

const chartConfig = {
  members: {
    label: "Members",
  },
  gold: {
    label: "Gold",
    color: "#fbbf24", // Amber/gold color
  },
  silver: {
    label: "Silver",
    color: "#94a3b8", // Silver color
  },
  bronze: {
    label: "Bronze",
    color: "#b45309", // Bronze color
  },
}

export function MembershipStatsChart() {
  const totalMembers = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.members, 0)
  }, [])

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Membership Distribution</CardTitle>
        <CardDescription>Current active memberships</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
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
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Members
                        </tspan>
                      </text>
                    )
                  }
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
