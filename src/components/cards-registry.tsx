import type { RegistryResponse } from "@/api/mlsolid";
import { MetricsCard, TimeAgoCard } from "./card";

interface CardsExperimentProps {
  id: string;
  data: RegistryResponse | undefined;
  isLoading: boolean;
  error: Error | null;
}

export default function CardsRegistry({
  data,
  isLoading,
  error,
}: CardsExperimentProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <MetricsCard
        title="Name"
        data={data?.name}
        isLoading={isLoading}
        error={error}
      ></MetricsCard>
      <TimeAgoCard
        title="Last update"
        data={data && data.entriesInfo[data.lastVer].createdAt}
        isLoading={isLoading}
        error={error}
      />
      <MetricsCard
        title="Total entries"
        data={data?.entriesInfo && Object.keys(data!.entriesInfo).length}
        isLoading={isLoading}
        error={error}
      ></MetricsCard>
    </div>
  );
}
