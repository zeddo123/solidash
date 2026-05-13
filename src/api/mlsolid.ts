console.log("MLSOLID", import.meta.env.VITE_MLSOLID);
const Mlsolid: string = import.meta.env.VITE_MLSOLID;

const expsURL: string = `${Mlsolid}/v1/exps/`;
const authURL: string = `${Mlsolid}/authorized/`;
const expURL: string = `${Mlsolid}/v1/exp/`;
const registriesURL: string = `${Mlsolid}/v1/registries/`;
const registryURL: string = `${Mlsolid}/v1/registry/`;
const benchmarksURL: string = `${Mlsolid}/v1/benchmarks/`;
const benchmarkURL: string = `${Mlsolid}/v1/benchmark/`;

export type MetricKind =
  | "metric/continuous"
  | "metric/multival"
  | "metric/single-numeric"
  | "metric/single"
  | "metric/complex";

export type ExpsResponse = {
  details: string;
  exps: {
    [key: string]: {
      runs: string[];
      runs_count: number;
    };
  };
};

export function ListExps(resp: ExpsResponse): string[] {
  return Object.keys(resp.exps);
}

export function TotalExperiments(resp: ExpsResponse): number {
  return Object.keys(resp.exps).length;
}

export function TotalRuns(resp: ExpsResponse): number {
  return Object.values(resp.exps).reduce(
    (sum, { runs_count }) => sum + runs_count,
    0,
  );
}

export type Experiment = {
  details: string;
  runs?: RunInfo[];
  metrics?: string[];
};

export type RunInfo = {
  runId: string;
  createdAt: string;
  color: string;
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

export function GetRunColor(
  runs: RunInfo[],
  runId: string,
): string | undefined {
  return runs.find((info) => {
    if (info.runId == runId) {
      return info;
    }
  })?.color;
}

export type Metrics = {
  details: string;
  metrics: string[];
};

export type MetricValues = { [runId: string]: number[] | string[] };

export type Metric = {
  details: string;
  kind: MetricKind;
  metric: MetricValues;
};

export function MaxLength(metric: Metric["metric"]): number {
  const values = Object.values(metric);

  if (values.length == 0) {
    return 0;
  }

  return values.reduce((maxLength, curr) => {
    return Math.max(maxLength, curr.length);
  }, 0);
}

export function Range(metric: MetricValues): [number, number] {
  const values = Object.values(metric);

  if (values.length == 0) {
    return [0, 100];
  }

  const range = values.flat().reduce(
    ([min, max], curr) => {
      if (typeof curr === "number") {
        const maxval = Math.max(max!, curr);

        if (min == null) {
          return [curr, maxval];
        }

        return [Math.min(min, curr), maxval];
      }

      return [min, max];
    },
    [null, 0],
  );

  if (!range[0]) {
    range[0] = 0;
  }

  if (!range[1]) {
    range[1] = 100;
  }

  return [range[0], range[1]];
}

export type Artifacts = {
  details: string;
  artifacts: { [runId: string]: string[] };
};

export type RegistriesResponse = {
  details: string;
  registries: string[];
};

export type RegistryResponse = {
  details: string;
  name: string;
  lastVer: number;
  tags: { [tag: string]: number[] };
  createdAt: string;
  entriesInfo: {
    [version: string]: RegistryEntry;
  };
};

export type RegistryEntry = {
  createdAt: string;
  tags: string[];
  run: string;
  name: string;
};

export type BenchmarksResponse = {
  details: string;
  benchmarks: string[];
};

export type BenchmarkResponse = {
  details: string;
  benchmark: Benchmark;
};

export type Benchmark = {
  id: string;
  name: string;
  paused: boolean;
  eagerStart: boolean;
  autoTag: boolean;
  tag: string;
  decisionMetric: string;
  registries: string[];
  metrics: { name: string; descSort: boolean }[];
  datasetName: string;
  datasetUrl: string;
  fromS3: boolean;
  timestamp: Date;
};

export async function experiments(): Promise<ExpsResponse> {
  const resp = await makeRequest(expsURL);

  if (!resp.ok) {
    throw new Error(`HTTP error ${resp.status}`);
  }

  const data = resp.json();

  return data as Promise<ExpsResponse>;
}

export async function experiment(expId: string): Promise<Experiment> {
  const url = `${expURL}${expId}`;

  const resp = await makeRequest(url);

  if (!resp.ok) {
    throw new Error(`HTTP error ${resp.status}`);
  }

  const data = resp.json();

  return data as Promise<Experiment>;
}

export async function metrics(expId: string): Promise<Metrics> {
  const url = `${expURL}${expId}/metrics/`;

  const resp = await makeRequest(url);

  if (!resp.ok) {
    throw new Error(`HTTP error ${resp.status}`);
  }

  const data = resp.json();

  return data as Promise<Metrics>;
}

export async function metric(expId: string, metricId: string): Promise<Metric> {
  const url = `${expURL}${expId}/metric/${metricId}`;

  const resp = await makeRequest(url);

  if (!resp.ok) {
    throw new Error(`HTTP Error ${resp.status}`);
  }

  const data = resp.json();

  return data as Promise<Metric>;
}

export async function artifacts(expId: string): Promise<Artifacts> {
  const url = `${expURL}${expId}/artifacts`;

  const resp = await makeRequest(url);

  if (!resp.ok) {
    throw new Error(`HTTP Error ${resp.status}`);
  }

  const data = resp.json();

  return data as Promise<Artifacts>;
}

export async function registries(): Promise<RegistriesResponse> {
  const resp = await makeRequest(registriesURL);

  const data = await resp.json();

  return data as RegistriesResponse;
}

export async function registry(id: string): Promise<RegistryResponse> {
  const url = `${registryURL}${id}`;

  const resp = await makeRequest(url);

  if (resp.status != 200) {
    throw Error("could not fetch registry");
  }

  return (await resp.json()) as RegistryResponse;
}

export async function benchmarks(): Promise<BenchmarksResponse> {
  const resp = await makeRequest(benchmarksURL);

  return (await resp.json()) as BenchmarksResponse;
}

export async function benchmark(id: string): Promise<BenchmarkResponse> {
  const url = `${benchmarkURL}${id}`;

  const resp = await makeRequest(url);

  return (await resp.json()) as BenchmarkResponse;
}

export async function isAuthorized(): Promise<boolean> {
  const resp = await makeRequest(authURL);

  return !(resp.status == 401);
}

async function makeRequest(url: string): Promise<Response> {
  return await fetch(url, {
    credentials: "include",
  });
}
