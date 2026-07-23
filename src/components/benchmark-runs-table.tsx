import { Link } from "react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { formatDateIntl } from "@/utils/date";
import type { components } from "@/api/generated";

type BenchRun = components["schemas"]["BenchRun"];

export function BenchmarkRunsTable({ runs }: { runs: BenchRun[] }) {
  if (runs.length === 0) {
    return <span className="text-muted-foreground text-sm">No runs yet</span>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Registry</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Metrics</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {runs.map((run, index) => (
            <TableRow key={index}>
              <TableCell>
                {run.registry ? (
                  <Link
                    to={`/registry/${run.registry}`}
                    className="hover:underline"
                  >
                    {run.registry}
                  </Link>
                ) : (
                  "—"
                )}
              </TableCell>
              <TableCell>{run.version ?? "—"}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {run.metrics && Object.keys(run.metrics).length > 0
                    ? Object.entries(run.metrics).map(([name, value]) => (
                        <Badge variant="secondary" key={name}>
                          {name}: {value}
                        </Badge>
                      ))
                    : "—"}
                </div>
              </TableCell>
              <TableCell>
                {run.start ? formatDateIntl(new Date(run.start)) : "—"}
              </TableCell>
              <TableCell>
                {run.end ? formatDateIntl(new Date(run.end)) : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
