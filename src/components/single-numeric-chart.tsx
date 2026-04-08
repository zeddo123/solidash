import { GetRunColor, type MetricValues, type RunInfo } from "@/api/mlsolid";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

interface SingleNumericChartProps {
  name: string;
  metric: MetricValues;
  runs: RunInfo[];
}

function SingleNumericChart({ name, metric, runs }: SingleNumericChartProps) {
  const data = Object.keys(metric).map((id) => {
    return {
      run: id,
      val: metric[id][0],
    };
  });

  const chartConfig = Object.keys(metric).reduce((config, runId) => {
    const color = GetRunColor(runs, runId);
    config[runId] = {
      label: runId + ":" + name,
      color: `${color}`,
    };
    return config;
  }, {} as ChartConfig);

  console.log("re-rendering single numeric");

  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer margin={{ top: 30 }} data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="run"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey={"val"} fill="var(--primary)" radius={8}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export default SingleNumericChart;
