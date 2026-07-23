import { artifacts, experiment } from "@/api/exps";
import { useQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router";
import { useState } from "react";
import CardsExperiment from "./cards-experiment";
import Chart from "./chart";
import { toast } from "sonner";
import Header from "./header";
import RunBreadcrumb from "./run-breadcrumb";
import { Input } from "./ui/input";
import { Skeleton } from "./ui/skeleton";
import { Filter } from "lucide-react";

function Experiment() {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedRuns = searchParams.getAll("run");
  const [metricQuery, setMetricQuery] = useState("");

  const toggleRun = (runId: string) => {
    const next = selectedRuns.includes(runId)
      ? selectedRuns.filter((r) => r !== runId)
      : [...selectedRuns, runId];
    setSearchParams(next.map((r): [string, string] => ["run", r]));
  };

  const clearRuns = () => setSearchParams([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["exp", id!],
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      if (id) {
        console.log("featching experiment", id);

        try {
          const resp = await experiment(id);
          toast.success("experiment fetched successfully");

          return resp;
        } catch (e) {
          console.log("could not fetch experiment", id, e);
          toast.error("could not fetch experiment: " + e);
          throw e;
        }
      }
    },
  });

  const {
    data: artifactsData,
    isLoading: artifactsLoading,
    error: artifactsError,
  } = useQuery({
    queryKey: ["artifacts", id!],
    staleTime: 1000 * 60 * 30,
    enabled: !!id && selectedRuns.length > 0,
    queryFn: async () => {
      return await artifacts(id!);
    },
  });

  const allMetrics = data?.metrics ?? [];
  const filteredMetrics = allMetrics
    .filter((m) => m.toLowerCase().includes(metricQuery.toLowerCase()))
    .sort();

  return (
    <div>
      <Header
        title={`Experiment ${id}`}
        right={
          <div className="relative">
            <Filter className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter metrics..."
              value={metricQuery}
              onChange={(e) => setMetricQuery(e.target.value)}
              className="w-56 pl-8"
            />
          </div>
        }
      />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <RunBreadcrumb
            expId={id!}
            runs={data?.runs}
            selectedRuns={selectedRuns}
            onToggleRun={toggleRun}
            onClear={clearRuns}
          />
          <CardsExperiment
            id={id!}
            data={data}
            isLoading={isLoading}
            error={error}
            selectedRuns={selectedRuns}
            artifacts={artifactsData}
            artifactsLoading={artifactsLoading}
            artifactsError={artifactsError}
          />
          <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2 dark:*:data-[slot=card]:bg-card">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-[500px] md:h-[500px] lg:h-[580px] rounded-xl"
                />
              ))
            ) : error ? (
              <>Something went wrong here...</>
            ) : allMetrics.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                This experiment has no metrics yet
              </div>
            ) : filteredMetrics.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No metrics match &quot;{metricQuery}&quot;
              </div>
            ) : (
              filteredMetrics.map((item) => (
                <div className="h-[500px] md:h-[500px] lg:h-[580px]" key={item}>
                  <Chart
                    expId={id!}
                    metricId={item}
                    key={item}
                    runs={data!.runs!}
                    selectedRuns={selectedRuns}
                  ></Chart>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Experiment;
