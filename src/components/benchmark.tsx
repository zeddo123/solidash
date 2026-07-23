import { useParams } from "react-router";
import Header from "./header";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetBenchmark,
  GetBenchmarkRuns,
  ToggleBenchmark,
} from "@/api/benchmarks";
import { Client } from "@/api/mlsolid";
import { toast } from "sonner";
import { Card, CardAction, CardContent, CardHeader, CardTitle } from "./ui/card";
import { BenchmarkDetails } from "./benchmark-details";
import { BenchmarkRunsTable } from "./benchmark-runs-table";
import { BenchmarkBestRuns } from "./benchmark-best-runs";
import { EditBenchmarkDialog } from "./edit-benchmark-dialog";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { EllipsisVertical, PauseIcon, PlayIcon, Pencil } from "lucide-react";
import { useState } from "react";

export default function Benchmark() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

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

  const runsQuery = useQuery({
    queryKey: ["benchmark-runs", id!],
    queryFn: async () => {
      const { data, error } = await GetBenchmarkRuns(Client, id!);
      if (error) {
        toast.error("could not fetch benchmark runs: " + error);
        throw error;
      }

      return data;
    },
  });

  const toggleBenchmark = async () => {
    if (!data) {
      return;
    }

    const { data: toggleData, error } = await ToggleBenchmark(
      Client,
      id!,
      !data.benchmark.paused,
    );

    if (error) {
      toast.error("could not toggle benchmark: " + error);
      return;
    }

    toast.success(toggleData.details);
    queryClient.invalidateQueries({ queryKey: ["benchmark", id!] });
  };

  return (
    <div>
      <Header title={"Benchmark"} />
      <div className="@container/main flex flex-1 flex-col gap-4 py-4 px-4">
        <Card>
          <CardHeader>
            <CardTitle>{data?.benchmark.name ?? id}</CardTitle>
            {data && (
              <CardAction>
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon-sm">
                        <EllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={toggleBenchmark}
                      >
                        {data.benchmark.paused ? <PlayIcon /> : <PauseIcon />}
                        {data.benchmark.paused ? "Resume" : "Pause"}
                      </DropdownMenuItem>
                      <DialogTrigger asChild>
                        <DropdownMenuItem className="cursor-pointer">
                          <Pencil />
                          Edit
                        </DropdownMenuItem>
                      </DialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <EditBenchmarkDialog
                    benchmark={data.benchmark}
                    onSuccess={() => setEditDialogOpen(false)}
                  />
                </Dialog>
              </CardAction>
            )}
          </CardHeader>
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
        <Card>
          <CardHeader>
            <CardTitle>Runs</CardTitle>
          </CardHeader>
          <CardContent>
            {runsQuery.isLoading ? (
              <div>Loading...</div>
            ) : runsQuery.error ? (
              <div>Error while fetching benchmark runs</div>
            ) : (
              <BenchmarkRunsTable runs={runsQuery.data?.runs ?? []} />
            )}
          </CardContent>
        </Card>
        {data && (
          <Card>
            <CardHeader>
              <CardTitle>Best runs</CardTitle>
            </CardHeader>
            <CardContent>
              <BenchmarkBestRuns
                benchId={id!}
                metrics={data.benchmark.metrics}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
