import { registry } from "@/api/model_registries";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { toast } from "sonner";
import Header from "./header";
import CardsRegistry from "./cards-registry";
import { ModelEntry } from "./model-entry";

export function Registry() {
  const { id } = useParams();
  const { data, isLoading, error } = useQuery({
    queryKey: ["exp", id!],
    staleTime: 1000 * 60 * 30,
    queryFn: async () => {
      if (id) {
        console.log("featching experiment", id);

        try {
          const resp = await registry(id);
          toast.success(resp.details);

          return resp;
        } catch (e) {
          console.log("could not fetch registry", id, e);
          toast.error("could not fetch registry: " + e);
          throw e;
        }
      }
    },
  });

  let tags: string[] = [];
  if (data?.tags) {
    tags = Object.keys(data.tags);
  }

  return (
    <div>
      <Header title={`Registry ${id}`} />
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <CardsRegistry
            id={id!}
            data={data}
            isLoading={isLoading}
            error={error}
          />
          <div className="flex flex-col gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-2 dark:*:data-[slot=card]:bg-card">
            {isLoading ? (
              <>Loading metrics...</>
            ) : error ? (
              <>Something went wrong here...</>
            ) : (
              <></>
            )}

            {data &&
              data.entriesInfo &&
              Object.keys(data.entriesInfo)
                .reverse()
                .map((key) => (
                  <div key={key}>
                    <ModelEntry
                      version={key}
                      entry={data.entriesInfo[key]}
                      tags={tags}
                      registryTagMappings={data.tags}
                    />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
