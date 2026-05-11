import { registry } from "@/api/mlsolid";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { toast } from "sonner";
import Header from "./header";
import CardsRegistry from "./cards-registry";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";

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

  function formatDateIntl(date: Date): string {
    const datePart = new Intl.DateTimeFormat(navigator.language, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);

    const timePart = date.toLocaleTimeString(navigator.language, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return `${datePart} ${timePart}`;
  }

  console.log(data);

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
                    <Card>
                      <CardHeader>
                        <CardTitle>v{key}</CardTitle>
                        <CardDescription>
                          Added{" "}
                          {formatDateIntl(
                            new Date(data.entriesInfo[key].createdAt),
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        Name: coming soon Url: coming soon
                      </CardContent>
                      <CardFooter>
                        <div className="flex w-full flex-wrap justify-right gap-2">
                          {data.entriesInfo[key].tags.map((tag) => (
                            <Badge
                              variant={
                                !tags.includes(tag)
                                  ? "secondary"
                                  : String(data.tags[tag][0]) == key
                                    ? "default"
                                    : "outline"
                              }
                              key={tag}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}
