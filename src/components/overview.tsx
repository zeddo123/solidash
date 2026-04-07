import { CardsOverview } from "./cards-overview";
import Header from "./header";

export function Overview() {
  return (
    <div className="">
      <Header title={"Overview"}></Header>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <CardsOverview />
            <div className="px-4 lg:px-6">
              <div>Coming soon...</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
