import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { type RunInfo } from "@/api/mlsolid";

interface MetricsCardProps {
  title: string;
  data?: string | number;
  isLoading: boolean;
  error: Error | null;
}

export function MetricsCard({
  title,
  data = "",
  isLoading,
  error,
}: MetricsCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>something went wrong</div>
        ) : (
          <CardTitle
            variant="accented"
            className="text-1xl font-semibold tabular-nums @[250px]/card:text-3xl"
          >
            <>{data}</>
          </CardTitle>
        )}
      </CardHeader>
    </Card>
  );
}

interface ListCardProps {
  title: string;
  list: RunInfo[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function ListCard({ title, list, isLoading, error }: ListCardProps) {
  if (error) {
    toast.error("could not load metrics: " + error);
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : !error && list ? (
          <div>
            <ScrollArea className="h-32 w-full rounded-md ">
              <div>
                <ul>
                  {list &&
                    list.map((item, index) => (
                      <React.Fragment key={index}>
                        <div className="text-sm">
                          <span
                            style={{
                              display: "inline-block",
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: item.color,
                            }}
                          />
                          {" " + item.runId}
                        </div>
                        <Separator className="my-2" />
                      </React.Fragment>
                    ))}
                </ul>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <></>
        )}
      </CardContent>
    </Card>
  );
}
