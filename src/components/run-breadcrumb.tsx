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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface RunBreadcrumbProps {
  expId: string;
  runs: RunInfo[] | undefined;
  selectedRuns: string[];
  onToggleRun: (runId: string) => void;
  onClear: () => void;
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
  selectedRuns,
  onToggleRun,
  onClear,
}: RunBreadcrumbProps) {
  const selectedRunInfo =
    selectedRuns.length === 1
      ? runs?.find((run) => run.runId === selectedRuns[0])
      : undefined;

  const triggerLabel =
    selectedRuns.length === 0
      ? "All runs"
      : selectedRuns.length === 1
        ? selectedRuns[0]
        : `${selectedRuns.length} runs`;

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
          {selectedRuns.length > 0 ? (
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
              {triggerLabel}
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onSelect={() => onClear()}>
                All runs
              </DropdownMenuItem>
              {runs && runs.length > 0 && <DropdownMenuSeparator />}
              {runs?.map((run) => (
                <DropdownMenuCheckboxItem
                  key={run.runId}
                  checked={selectedRuns.includes(run.runId)}
                  onSelect={(e) => e.preventDefault()}
                  onCheckedChange={() => onToggleRun(run.runId)}
                >
                  <RunDot color={run.color} />
                  {run.runId}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default RunBreadcrumb;
