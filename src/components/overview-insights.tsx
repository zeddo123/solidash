import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import TimeAgo from "react-timeago";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { FlaskRound, Play } from "lucide-react";
import { experiment, experiments } from "@/api/exps";
import { registries, registry } from "@/api/model_registries";
import { benchmarks, GetBenchmarkRuns } from "@/api/benchmarks";
import { GetAPIKeyLabels } from "@/api/api_keys";
import { Client } from "@/api/mlsolid";

// Cap parallel per-item detail fetches so a large registry/benchmark count
// doesn't fan out into hundreds of simultaneous requests on page load.
const DETAIL_FETCH_CAP = 30;

function InsightCard({
  title,
  description,
  isLoading,
  isEmpty,
  emptyLabel,
  children,
}: {
  title: string;
  description?: string;
  isLoading: boolean;
  isEmpty: boolean;
  emptyLabel: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-sm text-muted-foreground">Loading...</div>
        ) : isEmpty ? (
          <div className="text-sm text-muted-foreground">{emptyLabel}</div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}

export function MostActiveExperiments() {
  const expsQuery = useQuery({
    queryKey: ["exps"],
    queryFn: async () => await experiments(),
  });

  const top = Object.entries(expsQuery.data?.exps ?? {})
    .sort(([, a], [, b]) => b.length - a.length)
    .slice(0, 5);

  return (
    <InsightCard
      title="Most active experiments"
      description="by number of runs"
      isLoading={expsQuery.isLoading}
      isEmpty={top.length === 0}
      emptyLabel="No experiments yet"
    >
      <ul>
        {top.map(([exp, runs], index) => (
          <li key={exp}>
            <div className="flex items-center justify-between text-sm py-1.5">
              <Link to={`/experiments/${exp}`} className="truncate hover:underline">
                {exp}
              </Link>
              <Badge variant="secondary">
                <Play />
                {runs.length} runs
              </Badge>
            </div>
            {index < top.length - 1 && <Separator />}
          </li>
        ))}
      </ul>
    </InsightCard>
  );
}

export function NewestExperimentRuns() {
  const expsQuery = useQuery({
    queryKey: ["exps"],
    queryFn: async () => await experiments(),
  });

  const names = Object.keys(expsQuery.data?.exps ?? {}).slice(
    0,
    DETAIL_FETCH_CAP,
  );

  const detailsQuery = useQuery({
    queryKey: ["exp-details", names],
    queryFn: async () => {
      return await Promise.all(
        names.map(async (name) => {
          const data = await experiment(name);
          return { name, runs: data.runs ?? [] };
        }),
      );
    },
    enabled: names.length > 0,
  });

  const newestRuns = (detailsQuery.data ?? [])
    .flatMap(({ name, runs }) => runs.map((run) => ({ exp: name, run })))
    .sort(
      (a, b) =>
        new Date(b.run.createdAt).getTime() -
        new Date(a.run.createdAt).getTime(),
    )
    .slice(0, 5);

  const isLoading =
    expsQuery.isLoading || (names.length > 0 && detailsQuery.isLoading);

  return (
    <InsightCard
      title="Newest experiment runs"
      description="most recent runs across all experiments"
      isLoading={isLoading}
      isEmpty={newestRuns.length === 0}
      emptyLabel="No experiment runs yet"
    >
      <ul>
        {newestRuns.map(({ exp, run }, index) => (
          <li key={`${exp}-${run.runId}`}>
            <div className="flex items-center justify-between text-sm py-1.5 gap-2">
              <Link
                to={`/experiments/${exp}?run=${run.runId}`}
                className="truncate hover:underline"
              >
                {run.runId}
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline">
                  <FlaskRound />
                  {exp}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  <TimeAgo live={false} date={run.createdAt} />
                </span>
              </div>
            </div>
            {index < newestRuns.length - 1 && <Separator />}
          </li>
        ))}
      </ul>
    </InsightCard>
  );
}

export function RecentModelActivity() {
  const registriesQuery = useQuery({
    queryKey: ["registries"],
    queryFn: async () => await registries(),
  });

  const names = (registriesQuery.data?.registries ?? []).slice(
    0,
    DETAIL_FETCH_CAP,
  );

  const detailsQuery = useQuery({
    queryKey: ["registry-details", names],
    queryFn: async () => {
      return await Promise.all(names.map((name) => registry(name)));
    },
    enabled: names.length > 0,
  });

  const entries = (detailsQuery.data ?? [])
    .flatMap((reg) =>
      Object.entries(reg.entriesInfo).map(([version, entry]) => ({
        registry: reg.name,
        version,
        createdAt: entry.createdAt,
      })),
    )
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const isLoading =
    registriesQuery.isLoading || (names.length > 0 && detailsQuery.isLoading);

  return (
    <InsightCard
      title="Recently updated models"
      description="newest entries across all registries"
      isLoading={isLoading}
      isEmpty={entries.length === 0}
      emptyLabel="No model entries yet"
    >
      <ul>
        {entries.map((entry, index) => (
          <li key={`${entry.registry}-${entry.version}`}>
            <div className="flex items-center justify-between text-sm py-1.5 gap-2">
              <Link
                to={`/registry/${entry.registry}`}
                className="truncate hover:underline"
              >
                {entry.registry}
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline">v{entry.version}</Badge>
                <span className="text-muted-foreground text-xs">
                  <TimeAgo live={false} date={entry.createdAt} />
                </span>
              </div>
            </div>
            {index < entries.length - 1 && <Separator />}
          </li>
        ))}
      </ul>
    </InsightCard>
  );
}

export function LatestBenchmarkRuns() {
  const benchmarksQuery = useQuery({
    queryKey: ["benchmarks"],
    queryFn: async () => await benchmarks(),
  });

  const entries = Object.entries(benchmarksQuery.data?.benchmarks ?? {}).slice(
    0,
    DETAIL_FETCH_CAP,
  );

  const detailsQuery = useQuery({
    queryKey: ["benchmark-latest-runs", entries.map(([id]) => id)],
    queryFn: async () => {
      const results = await Promise.all(
        entries.map(async ([id, name]) => {
          const { data, error } = await GetBenchmarkRuns(Client, id);

          return { id, name, error, runs: data?.runs ?? [] };
        }),
      );

      return results
        .filter((result) => !result.error && result.runs.length > 0)
        .map(({ id, name, runs }) => {
          const latest = [...runs].sort(
            (a, b) =>
              new Date(b.end ?? b.timestamp ?? b.start ?? 0).getTime() -
              new Date(a.end ?? a.timestamp ?? a.start ?? 0).getTime(),
          )[0];

          return { id, name, run: latest };
        });
    },
    enabled: entries.length > 0,
  });

  const latestRuns = (detailsQuery.data ?? [])
    .sort(
      (a, b) =>
        new Date(
          b.run.end ?? b.run.timestamp ?? b.run.start ?? 0,
        ).getTime() -
        new Date(a.run.end ?? a.run.timestamp ?? a.run.start ?? 0).getTime(),
    )
    .slice(0, 5);

  const isLoading =
    benchmarksQuery.isLoading || (entries.length > 0 && detailsQuery.isLoading);

  return (
    <InsightCard
      title="Latest benchmark runs"
      description="most recent run per benchmark"
      isLoading={isLoading}
      isEmpty={latestRuns.length === 0}
      emptyLabel="No benchmark runs yet"
    >
      <ul>
        {latestRuns.map(({ id, name, run }, index) => (
          <li key={id}>
            <div className="flex items-center justify-between text-sm py-1.5 gap-2">
              <Link to={`/bench/${id}`} className="truncate hover:underline">
                {name}
              </Link>
              <div className="flex items-center gap-2 shrink-0">
                {run.registry && (
                  <Badge variant="outline">
                    {run.registry}
                    {run.version != null ? ` v${run.version}` : ""}
                  </Badge>
                )}
                <span className="text-muted-foreground text-xs">
                  <TimeAgo
                    live={false}
                    date={run.end ?? run.timestamp ?? run.start ?? ""}
                  />
                </span>
              </div>
            </div>
            {index < latestRuns.length - 1 && <Separator />}
          </li>
        ))}
      </ul>
    </InsightCard>
  );
}

export function ExpiringApiKeys() {
  const keysQuery = useQuery({
    queryKey: ["api-keys"],
    queryFn: async () => {
      const { data, error } = await GetAPIKeyLabels(Client);
      if (error) {
        throw new Error("" + error);
      }

      return data;
    },
  });

  const soonest = Object.entries(keysQuery.data?.labels ?? {})
    .sort(
      ([, a], [, b]) => new Date(a).getTime() - new Date(b).getTime(),
    )
    .slice(0, 3);

  return (
    <InsightCard
      title="API keys"
      description="expiring soonest"
      isLoading={keysQuery.isLoading}
      isEmpty={soonest.length === 0}
      emptyLabel="No API keys yet"
    >
      <ul>
        {soonest.map(([label, expiresAt], index) => (
          <li key={label}>
            <div className="flex items-center justify-between text-sm py-1.5">
              <Link to="/keys" className="truncate hover:underline">
                {label}
              </Link>
              <span className="text-muted-foreground text-xs">
                expires <TimeAgo live={false} date={expiresAt} />
              </span>
            </div>
            {index < soonest.length - 1 && <Separator />}
          </li>
        ))}
      </ul>
    </InsightCard>
  );
}
