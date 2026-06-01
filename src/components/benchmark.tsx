import { useParams } from "react-router";
import Header from "./header";
import { useQuery } from "@tanstack/react-query";
import { GetBenchmark } from "@/api/benchmarks";
import { Client } from "@/api/mlsolid";
import { toast } from "sonner";
import { Card, CardContent } from "./ui/card";
import { BenchmarkDetails } from "./benchmark-details";

export default function Benchmark() {
  const { id } = useParams();
  const { data, error, isLoading } = useQuery({
    queryKey: ["benchmark", id!],
    queryFn: async () => {
      const { data, error } = await GetBenchmark(Client, id!);
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
      <Header title={"Benchmark"} />
      <div className="@container/main flex flex-1 flex-col gap-4 py-4 px-4">
        <Card>
          <CardContent>
            {isLoading ? (
              <div>Loading...</div>
            ) : data ? (
              <div>
                <BenchmarkDetails benchmark={data.benchmark} />
              </div>
            ) : error ? (
              <div>Error while fetching benchmark</div>
            ) : (
              <></>
            )}
          </CardContent>
        </Card>
        <div>
          <h3>Runs</h3>
        </div>
      </div>
    </div>
  );
}
