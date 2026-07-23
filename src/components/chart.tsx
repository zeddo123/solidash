import { type RunInfo } from "@/api/mlsolid";
import { metric } from "@/api/exps";
import { useQuery } from "@tanstack/react-query";
import SingleNumericChart from "@/components/single-numeric-chart";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import ContinuousChart from "@/components/continuous-chart";
import { useCallback, useMemo, useRef } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import TableChart from "./table-chart";

interface ChartProps {
  expId: string;
  metricId: string;
  runs: RunInfo[];
  selectedRuns: string[];
}

function formatStat(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(3);
}

function Chart({ expId, metricId, runs, selectedRuns }: ChartProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["metric", expId, metricId],
    staleTime: 1000 * 30,
    queryFn: async () => {
      return await metric(expId, metricId);
    },
  });

  const chartRef = useRef<HTMLDivElement>(null);
  const memMetric = useMemo(() => {
    if (!data?.metric) {
      return data?.metric;
    }

    if (selectedRuns.length === 0) {
      return data.metric;
    }

    return Object.fromEntries(
      selectedRuns.map((runId) => [runId, data.metric[runId] ?? []]),
    );
  }, [data, selectedRuns]);
  const memRuns = useMemo(() => {
    if (selectedRuns.length === 0) {
      return runs;
    }

    return runs.filter((run) => selectedRuns.includes(run.runId));
  }, [runs, selectedRuns]);
  const stats = useMemo(() => {
    if (!memMetric) {
      return null;
    }

    let min: number | null = null;
    let max: number | null = null;
    let minRun = "";
    let maxRun = "";
    let sum = 0;
    let count = 0;

    for (const [runId, values] of Object.entries(memMetric)) {
      for (const v of values) {
        if (typeof v !== "number") {
          continue;
        }

        if (min === null || v < min) {
          min = v;
          minRun = runId;
        }

        if (max === null || v > max) {
          max = v;
          maxRun = runId;
        }

        sum += v;
        count += 1;
      }
    }

    if (min === null || max === null) {
      return null;
    }

    return { min, max, minRun, maxRun, avg: sum / count };
  }, [memMetric]);
  const exportFunc = useCallback(async () => {
    if (chartRef.current == null) {
      return;
    }

    toPng(chartRef.current, { cacheBust: true, skipFonts: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${expId}-${metricId}.svg`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        toast.error("could not export chart: " + err);
      });
  }, [chartRef, expId, metricId]);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{metricId}</CardTitle>
        <CardDescription>{data?.kind}</CardDescription>
        {stats && (
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span>
              Min: {formatStat(stats.min)} ({stats.minRun})
            </span>
            <span>
              Max: {formatStat(stats.max)} ({stats.maxRun})
            </span>
            <span>Avg: {formatStat(stats.avg)}</span>
          </div>
        )}
        <CardAction>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="save"
            onClick={exportFunc}
          >
            <Save />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-full w-full" />
        ) : error ? (
          <div>someting went wrong</div>
        ) : data ? (
          <div ref={chartRef}>
            {data.kind == "metric/single-numeric" ? (
              <SingleNumericChart
                metric={memMetric!}
                name={metricId}
                runs={memRuns}
              />
            ) : data.kind == "metric/single" ? (
              <TableChart name={metricId} metric={memMetric!} />
            ) : data.kind == "metric/continuous" ? (
              <ContinuousChart
                metric={memMetric!}
                name={metricId}
                runs={memRuns}
              />
            ) : data.kind == "metric/multival" ? (
              <TableChart name={metricId} metric={memMetric!} />
            ) : data.kind == "metric/complex" ? (
              <>Complex chart</>
            ) : (
              <>Something went wrong</>
            )}
          </div>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
}

export default Chart;
