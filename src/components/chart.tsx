import { metric, type RunInfo } from "@/api/mlsolid";
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
}

function Chart({ expId, metricId, runs }: ChartProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["metric", expId, metricId],
    staleTime: 1000 * 30,
    queryFn: async () => {
      return await metric(expId, metricId);
    },
  });

  const chartRef = useRef<HTMLDivElement>(null);
  const memMetric = useMemo(() => data?.metric, [data]);
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
          <div>Loading...</div>
        ) : error ? (
          <div>someting went wrong</div>
        ) : data ? (
          <div ref={chartRef}>
            {data.kind == "metric/single-numeric" ? (
              <SingleNumericChart
                metric={memMetric!}
                name={metricId}
                runs={runs}
              />
            ) : data.kind == "metric/single" ? (
              <TableChart name={metricId} metric={memMetric!} />
            ) : data.kind == "metric/continuous" ? (
              <ContinuousChart
                metric={memMetric!}
                name={metricId}
                runs={runs}
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
