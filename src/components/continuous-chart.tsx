import {
  GetRunColor,
  MaxLength,
  type MetricValues,
  type RunInfo,
} from "@/api/mlsolid";
import { LineChart, CartesianGrid, XAxis, YAxis, Legend, Line } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

interface ContinousChartProps {
  name: string;
  metric: MetricValues;
  runs: RunInfo[];
}

function ContinuousChart({ name, metric, runs }: ContinousChartProps) {
  const arrayLength = MaxLength(metric);

  let lowerBound: number | null = null;
  let upperBound: number | null = null;

  const chartData = Array.from({ length: arrayLength }, (_, idx) => {
    const point: { [m: string]: number | string } = { x: idx };
    for (const [m, values] of Object.entries(metric)) {
      const val = values[idx];
      point[m] = val;

      if (typeof val === "number") {
        lowerBound = !lowerBound ? val : Math.min(lowerBound, val);
        upperBound = !upperBound ? val : Math.max(upperBound, val);
      }
    }
    return point;
  });

  if (lowerBound == null) {
    lowerBound = 0;
  }
  if (upperBound == null) {
    upperBound = 100;
  }

  const chartConfig = Object.keys(metric).reduce((config, runId) => {
    const color = GetRunColor(runs, runId);
    config[runId] = {
      label: runId + ":" + name,
      color: `${color}`,
    };
    return config;
  }, {} as ChartConfig);
  console.log(runs);
  console.log(chartConfig);

  return (
    <ChartContainer config={chartConfig} className="h-[400px] w-full">
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="x"
          label={{
            value: "Index (position)",
            position: "insideBottomRight",
            offset: -5,
          }}
        />
        <YAxis
          label={{ value: "Value", angle: -90, position: "insideLeft" }}
          domain={[lowerBound, upperBound]}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Legend
          verticalAlign="bottom"
          wrapperStyle={{
            paddingTop: "30px",
            paddingBottom: "10px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
          }}
        />
        {Object.keys(chartConfig).map((metricKey) => (
          <Line
            key={metricKey}
            type="monotone"
            dataKey={metricKey}
            stroke={`var(--color-${metricKey})`}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        ))}
      </LineChart>
    </ChartContainer>
  );
}

export default ContinuousChart;
