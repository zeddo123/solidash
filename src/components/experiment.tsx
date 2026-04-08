import { experiment } from "@/api/mlsolid";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import CardsExperiment from "./cards-experiment";
import Chart from "./chart";
import { toast } from "sonner";
import Header from "./header";

function Experiment() {
  const { id } = useParams();
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

  return (
    <div>
      <Header title={`Experiment ${id}`} />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <CardsExperiment
            id={id!}
            data={data}
            isLoading={isLoading}
            error={error}
          />
          <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2 dark:*:data-[slot=card]:bg-card">
            {isLoading ? (
              <>Loading metrics...</>
            ) : error ? (
              <>Something went wrong here...</>
            ) : (
              <></>
            )}
            {data &&
              data.metrics &&
              data.metrics.sort().map((item) => (
                <div className="h-[500px] md:h-[500px] lg:h-[580px]" key={item}>
                  <Chart
                    expId={id!}
                    metricId={item}
                    key={item}
                    runs={data.runs!}
                  ></Chart>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Experiment;
