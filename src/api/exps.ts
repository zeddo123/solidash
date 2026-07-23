import { Client, collectPages, type Metric, type RunInfo } from "./mlsolid";

export type ExpsResponse = {
  details: string;
  exps: {
    [key: string]: string[];
  };
};

export function ListExps(resp: ExpsResponse): string[] {
  return Object.keys(resp.exps);
}

export function TotalExperiments(resp: ExpsResponse): number {
  return Object.keys(resp.exps).length;
}

export function TotalRuns(resp: ExpsResponse): number {
  return Object.values(resp.exps).reduce((sum, runs) => sum + runs.length, 0);
}

export type Experiment = {
  details: string;
  runs?: RunInfo[];
  metrics?: string[];
};

export function ExperimentRunsCount(resp: Experiment | undefined): number {
  if (!resp || !resp.runs) {
    return 0;
  }

  return resp.runs.length;
}

export function ExperimentMetricsCount(resp: Experiment | undefined): number {
  if (!resp || !resp.metrics) {
    return 0;
  }

  return resp.metrics.length;
}

export function ExperimentRuns(resp: Experiment | undefined): string[] {
  if (!resp || !resp.runs) {
    return [];
  }

  return resp.runs.map((info) => {
    return info.runId;
  });
}

export type Metrics = {
  details: string;
  metrics: string[];
};

export type Artifacts = {
  details: string;
  artifacts: { [runId: string]: string[] };
};

export function RunArtifacts(
  resp: Artifacts | undefined,
  runId: string,
): string[] {
  return resp?.artifacts[runId] ?? [];
}

export async function experiments(): Promise<ExpsResponse> {
  return await collectPages<ExpsResponse>(
    async (cursor) => {
      const { data, error } = await Client.GET("/v1/exps", {
        params: { query: { cursor } },
      });

      if (error) {
        throw new Error(`could not fetch experiments: ${error}`);
      }

      return data;
    },
    (acc, page) => ({
      details: page.details,
      exps: { ...acc.exps, ...page.exps },
    }),
    { details: "", exps: {} },
  );
}

export async function experiment(expId: string): Promise<Experiment> {
  const { data, error } = await Client.GET("/v1/exp/{id}", {
    params: { path: { id: expId } },
  });

  if (error) {
    throw new Error(`could not fetch experiment: ${error}`);
  }

  return data;
}

export async function metrics(expId: string): Promise<Metrics> {
  const { data, error } = await Client.GET("/v1/exp/{id}/metrics", {
    params: { path: { id: expId } },
  });

  if (error) {
    throw new Error(`could not fetch metrics: ${error}`);
  }

  return data;
}

export async function metric(
  expId: string,
  metricId: string,
): Promise<Metric> {
  const { data, error } = await Client.GET("/v1/exp/{id}/metric/{mid}", {
    params: { path: { id: expId, mid: metricId } },
  });

  if (error) {
    throw new Error(`could not fetch metric: ${error}`);
  }

  return data as Metric;
}

export async function artifacts(expId: string): Promise<Artifacts> {
  const { data, error } = await Client.GET("/v1/exp/{id}/artifacts", {
    params: { path: { id: expId } },
  });

  if (error) {
    throw new Error(`could not fetch artifacts: ${error}`);
  }

  return data;
}
