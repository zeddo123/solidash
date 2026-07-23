import { experiments, TotalExperiments, TotalRuns } from "@/api/exps";
import { registries } from "@/api/model_registries";
import { useQuery } from "@tanstack/react-query";
import { MetricsCard } from "./card";

export function CardsOverview() {
  const expsQuery = useQuery({
    queryKey: ["exps"],
    queryFn: async () => {
      return await experiments();
    },
  });

  const registriesQuery = useQuery({
    queryKey: ["registries"],
    queryFn: async () => {
      return await registries();
    },
  });

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <MetricsCard
        title="Experiments"
        data={expsQuery.data && TotalExperiments(expsQuery.data)}
        isLoading={expsQuery.isLoading}
        error={expsQuery.error}
      ></MetricsCard>
      <MetricsCard
        title="Runs"
        data={expsQuery.data && TotalRuns(expsQuery.data)}
        isLoading={expsQuery.isLoading}
        error={expsQuery.error}
      ></MetricsCard>
      <MetricsCard
        title="Artifacts"
        data={
          expsQuery.data &&
          TotalRuns(expsQuery.data) + TotalExperiments(expsQuery.data)
        }
        isLoading={expsQuery.isLoading}
        error={expsQuery.error}
      ></MetricsCard>
      <MetricsCard
        title="Models"
        data={registriesQuery.data && registriesQuery.data.registries.length}
        isLoading={registriesQuery.isLoading}
        error={registriesQuery.error}
      ></MetricsCard>
    </div>
  );
}
