import type { MetricValues } from "@/api/mlsolid";
import { DataTable } from "./metrics-table/data-table";
import { Columns } from "./metrics-table/columns";
import { ScrollArea } from "@/components/ui/scroll-area";

function TableChart({ name, metric }: { name: string; metric: MetricValues }) {
  const data = Object.keys(metric).map((runId) => {
    return {
      runId: runId,
      value:
        metric[runId].length > 1
          ? `[${metric[runId].join(", ")}]`
          : String(metric[runId][0]),
    };
  });

  return (
    <div className="rounded-md border inset-shadow-sm">
      <ScrollArea className="h-99 pb-auto ">
        <DataTable columns={Columns(name)} data={data} />
      </ScrollArea>
    </div>
  );
}

export default TableChart;
