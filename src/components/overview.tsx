import { CardsOverview } from "./cards-overview";
import Header from "./header";
import {
  ExpiringApiKeys,
  LatestBenchmarkRuns,
  MostActiveExperiments,
  NewestExperimentRuns,
  RecentModelActivity,
} from "./overview-insights";

export function Overview() {
  return (
    <div className="">
      <Header title={"Overview"}></Header>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <CardsOverview />
            <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2">
              <MostActiveExperiments />
              <NewestExperimentRuns />
              <RecentModelActivity />
              <LatestBenchmarkRuns />
              <ExpiringApiKeys />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
