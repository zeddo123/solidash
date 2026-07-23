import createClient from "openapi-fetch";
import type { components, paths } from "./generated";

const Mlsolid: string = import.meta.env.VITE_MLSOLID;
export const Client = createClient<paths>({
  baseUrl: Mlsolid,
  credentials: "include",
});

export type MetricKind =
  | "metric/continuous"
  | "metric/multival"
  | "metric/single-numeric"
  | "metric/single"
  | "metric/complex";

export type RunInfo = components["schemas"]["RunInfo"];

export type MetricValues = { [runId: string]: number[] | string[] };

export type Metric = {
  details: string;
  kind: MetricKind;
  metric: MetricValues;
};

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

export function GetRunInfo(
  runs: RunInfo[] | undefined,
  runId: string,
): RunInfo | undefined {
  return runs?.find((info) => info.runId == runId);
}

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

export async function isAuthorized(): Promise<boolean> {
  const { response } = await Client.GET("/authorized");

  return response.status !== 401;
}

export async function logout(): Promise<void> {
  await Client.GET("/logout");
}

export function artifactURL(rid: string, aid: string): string {
  return `${Mlsolid}/v1/artifact/${rid}/${aid}`;
}

/**
 * Loops a paginated GET endpoint, following its `cursor` until "0", merging
 * each page's items into a running accumulator.
 */
export async function collectPages<Page>(
  fetchPage: (cursor: string) => Promise<Page & { cursor: string }>,
  merge: (acc: Page, page: Page) => Page,
  initial: Page,
): Promise<Page> {
  let cursor = "0";
  let acc = initial;

  do {
    const page = await fetchPage(cursor);
    acc = merge(acc, page);
    cursor = page.cursor;
  } while (cursor !== "0");

  return acc;
}
