import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { GetBestBenchmarkRuns } from "@/api/benchmarks";
import { Client } from "@/api/mlsolid";
import { toast } from "sonner";
import type { components } from "@/api/generated";

type BenchMetric = components["schemas"]["BenchMetric"];

export function BenchmarkBestRuns({
  benchId,
  metrics,
}: {
  benchId: string;
  metrics: BenchMetric[];
}) {
  const [selected, setSelected] = useState<string[]>([]);

  const bestQuery = useQuery({
    queryKey: ["best-runs", benchId, selected],
    queryFn: async () => {
      const { data, error } = await GetBestBenchmarkRuns(
        Client,
        benchId,
        selected,
      );

      if (error) {
        toast.error("could not fetch best runs: " + error);
        throw error;
      }

      return data;
    },
    enabled: false,
  });

  const toggleMetric = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name],
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {metrics.length === 0 ? (
          <span className="text-muted-foreground text-sm">
            No metrics defined
          </span>
        ) : (
          metrics.map((metric) => (
            <Badge
              key={metric.name}
              variant={selected.includes(metric.name) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleMetric(metric.name)}
            >
              {metric.name}
            </Badge>
          ))
        )}
      </div>
      <Button
        size="sm"
        disabled={selected.length === 0}
        onClick={() => bestQuery.refetch()}
      >
        Compare
      </Button>
      {bestQuery.isFetching ? (
        <div>Loading...</div>
      ) : bestQuery.data ? (
        <div className="space-y-2">
          {Object.entries(bestQuery.data.runs).length === 0 ? (
            <span className="text-muted-foreground text-sm">
              No matching runs
            </span>
          ) : (
            Object.entries(bestQuery.data.runs).map(([metric, run]) => (
              <div
                key={metric}
                className="flex justify-between items-center gap-2 p-2 bg-muted/30 rounded-md"
              >
                <span className="text-sm font-medium">{metric}</span>
                <span className="text-sm">
                  {run.registry ? (
                    <Link
                      to={`/registry/${run.registry}`}
                      className="hover:underline"
                    >
                      {run.registry}
                    </Link>
                  ) : (
                    "—"
                  )}{" "}
                  v{run.version ?? "—"}
                </span>
                <span className="font-mono text-sm">
                  {run.metrics?.[metric] ?? "—"}
                </span>
              </div>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}
