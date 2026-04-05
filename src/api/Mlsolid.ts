//const APIBase: string = import.meta.env.VITE_BASE_URL;
const APIBase: string = "http://localhost:8050";

const expsURL: string = `${APIBase}/v1/exps/`;
const expURL: string = `${APIBase}/v1/exp/`;

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

export type Experiment = {
  details: string;
  runs: string[];
  metrics: string[];
};

export type Metrics = {
  details: string;
  metrics: string[];
};

export type Metric = {
  details: string;
  kind: string;
  metric: any[];
};

export type Artifacts = {
  details: string;
  artifacts: any[];
};

export async function experiments(): Promise<ExpsResponse> {
  const resp = await fetch(expsURL);

  if (!resp.ok) {
    throw new Error(`HTTP error ${resp.status}`);
  }

  const data = resp.json();

  return data as Promise<ExpsResponse>;
}

export async function experiment(expId: string): Promise<Experiment> {
  const url = `${expURL}${expId}`;

  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`HTTP error ${resp.status}`);
  }

  const data = resp.json();

  return data as Promise<Experiment>;
}

export async function metrics(expId: string): Promise<Metrics> {
  const url = `${expURL}${expId}/metrics/`;

  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`HTTP error ${resp.status}`);
  }

  const data = resp.json();

  return data as Promise<Metrics>;
}

export async function metric(expId: string, metricId: string): Promise<Metric> {
  const url = `${expURL}${expId}/metric/${metricId}`;

  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`HTTP Error ${resp.status}`);
  }

  const data = resp.json();

  return data as Promise<Metric>;
}

export async function artifacts(expId: string): Promise<Artifacts> {
  const url = `${expURL}${expId}/artifacts`;

  const resp = await fetch(url);

  if (!resp.ok) {
    throw new Error(`HTTP Error ${resp.status}`);
  }

  const data = resp.json();

  return data as Promise<Artifacts>;
}
