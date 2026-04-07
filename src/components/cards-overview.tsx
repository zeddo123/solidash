import { experiments, TotalExperiments, TotalRuns } from "@/api/mlsolid";
import { useQuery } from "@tanstack/react-query";
import { MetricsCard } from "./card";

export function CardsOverview() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["exps"],
    queryFn: async () => {
      return await experiments();
    },
  });

  console.log(data, isLoading, error);

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <MetricsCard
        title="Experiments"
        data={data && TotalExperiments(data)}
        isLoading={isLoading}
        error={error}
      ></MetricsCard>
      <MetricsCard
        title="Runs"
        data={data && TotalRuns(data)}
        isLoading={isLoading}
        error={error}
      ></MetricsCard>
      <MetricsCard
        title="Artifacts"
        data={data && TotalRuns(data) + TotalExperiments(data)}
        isLoading={isLoading}
        error={error}
      ></MetricsCard>
      <MetricsCard
        title="Models"
        data={data && TotalRuns(data) + TotalExperiments(data)}
        isLoading={isLoading}
        error={error}
      ></MetricsCard>
    </div>
  );
}
