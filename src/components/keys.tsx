import { useQuery } from "@tanstack/react-query";
import Header from "./header";
import { GetAPIKeyLabels } from "@/api/api_keys";
import { Client } from "@/api/mlsolid";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { KeySquare, Timer } from "lucide-react";
import TimeAgo from "react-timeago";

export default function Keys() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const { data, error } = await GetAPIKeyLabels(Client);
      if (error) {
        toast.error("" + error);

        throw error;
      }

      toast.success(data.details);

      return data;
    },
  });

  return (
    <div>
      <Header title={"Keys"}></Header>
      {isLoading ? (
        <div>Loading keys...</div>
      ) : error ? (
        <div>Error {error.message}</div>
      ) : data ? (
        <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6">
          {Object.keys(data.labels).map((label) => (
            <Card>
              <CardHeader>
                <KeySquare />
              </CardHeader>
              <CardContent>Label: {label}</CardContent>
              <CardFooter>
                <Timer />
                <div>
                  {" Expires "}
                  {<TimeAgo date={data.labels[label]} live={false} />}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
