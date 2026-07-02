import {
  ExperimentMetricsCount,
  ExperimentRunsCount,
  GetRunInfo,
  RunArtifacts,
  type Artifacts,
  type Experiment,
} from "@/api/mlsolid";
import { ListCard, MetricsCard, StringListCard, TimeAgoCard } from "./card";

interface CardsExperimentProps {
  id: string;
  data: Experiment | undefined;
  isLoading: boolean;
  error: Error | null;
  selectedRun?: string;
  artifacts?: Artifacts;
  artifactsLoading?: boolean;
  artifactsError?: Error | null;
}

export default function CardsExperiment({
  data,
  isLoading,
  error,
  id,
  selectedRun,
  artifacts,
  artifactsLoading = false,
  artifactsError = null,
}: CardsExperimentProps) {
  if (selectedRun) {
    const runInfo = GetRunInfo(data?.runs, selectedRun);

    return (
      <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
        <MetricsCard
          title="Run"
          data={selectedRun}
          isLoading={isLoading}
          error={error}
        ></MetricsCard>
        <TimeAgoCard
          title="Created"
          data={runInfo?.createdAt}
          isLoading={isLoading}
          error={error}
        ></TimeAgoCard>
        <MetricsCard
          title="Metrics"
          data={ExperimentMetricsCount(data)}
          isLoading={isLoading}
          error={error}
        ></MetricsCard>
        <StringListCard
          title="Artifacts"
          list={artifacts ? RunArtifacts(artifacts, selectedRun) : undefined}
          isLoading={artifactsLoading}
          error={artifactsError}
        ></StringListCard>
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
