import { Link } from "react-router";
import { type RunInfo } from "@/api/mlsolid";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface RunBreadcrumbProps {
  expId: string;
  runs: RunInfo[] | undefined;
  selectedRun: string | undefined;
  onSelectRun: (runId: string | undefined) => void;
}

function RunDot({ color }: { color: string }) {
  return (
    <span
      style={{ backgroundColor: color }}
      className="inline-block size-2.5 shrink-0 rounded-full"
    />
  );
}

function RunBreadcrumb({
  expId,
  runs,
  selectedRun,
  onSelectRun,
}: RunBreadcrumbProps) {
  const selectedRunInfo = runs?.find((run) => run.runId === selectedRun);

  return (
    <Breadcrumb className="px-4 lg:px-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">Overview</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {selectedRun ? (
            <BreadcrumbLink asChild>
              <Link to={`/experiments/${expId}`}>{expId}</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{expId}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1.5 font-normal text-foreground outline-hidden hover:text-foreground/80">
              {selectedRunInfo && <RunDot color={selectedRunInfo.color} />}
              {selectedRun ?? "All runs"}
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={() => onSelectRun(undefined)}>
                All runs
              </DropdownMenuItem>
              {runs && runs.length > 0 && <DropdownMenuSeparator />}
              {runs?.map((run) => (
                <DropdownMenuItem
                  key={run.runId}
                  onSelect={() => onSelectRun(run.runId)}
                >
                  <RunDot color={run.color} />
                  {run.runId}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default RunBreadcrumb;
