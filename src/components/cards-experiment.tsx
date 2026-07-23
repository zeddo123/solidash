import { Fragment } from "react";
import {
  ExperimentMetricsCount,
  ExperimentRunsCount,
  RunArtifacts,
  type Artifacts,
  type Experiment,
} from "@/api/exps";
import { artifactURL, GetRunInfo } from "@/api/mlsolid";
import { ListCard, MetricsCard, StringListCard, TimeAgoCard } from "./card";

interface CardsExperimentProps {
  id: string;
  data: Experiment | undefined;
  isLoading: boolean;
  error: Error | null;
  selectedRuns: string[];
  artifacts?: Artifacts;
  artifactsLoading?: boolean;
  artifactsError?: Error | null;
}

export default function CardsExperiment({
  data,
  isLoading,
  error,
  id,
  selectedRuns,
  artifacts,
  artifactsLoading = false,
  artifactsError = null,
}: CardsExperimentProps) {
  if (selectedRuns.length > 0) {
    const multiple = selectedRuns.length > 1;

    return (
      <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
        <MetricsCard
          title={multiple ? "Runs selected" : "Run"}
          data={multiple ? selectedRuns.length : selectedRuns[0]}
          isLoading={isLoading}
          error={error}
        ></MetricsCard>
        <MetricsCard
          title="Metrics"
          data={ExperimentMetricsCount(data)}
          isLoading={isLoading}
          error={error}
        ></MetricsCard>
        {selectedRuns.map((runId) => {
          const runInfo = GetRunInfo(data?.runs, runId);

          return (
            <Fragment key={runId}>
              <TimeAgoCard
                title={multiple ? `${runId} created` : "Created"}
                data={runInfo?.createdAt}
                isLoading={isLoading}
                error={error}
              ></TimeAgoCard>
              <StringListCard
                title={multiple ? `${runId} artifacts` : "Artifacts"}
                list={artifacts ? RunArtifacts(artifacts, runId) : undefined}
                isLoading={artifactsLoading}
                error={artifactsError}
                linkBuilder={(aid) => artifactURL(runId, aid)}
              ></StringListCard>
            </Fragment>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <MetricsCard
        title="Name"
        data={id}
        isLoading={isLoading}
        error={error}
      ></MetricsCard>
      <ListCard
        title="Runs"
        list={data?.runs}
        isLoading={isLoading}
        error={error}
      ></ListCard>
      <MetricsCard
        title="Total metrics"
        data={ExperimentMetricsCount(data)}
        isLoading={isLoading}
        error={error}
      ></MetricsCard>
      <MetricsCard
        title="Total runs"
        data={ExperimentRunsCount(data)}
        isLoading={isLoading}
        error={error}
      ></MetricsCard>
    </div>
  );
}
