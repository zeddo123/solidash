import { Client, collectPages } from "./mlsolid";
import Cookies from "js-cookie";

export type BenchmarksResponse = {
  details: string;
  benchmarks: { [id: string]: string };
};

export async function benchmarks(): Promise<BenchmarksResponse> {
  return await collectPages<BenchmarksResponse>(
    async (cursor) => {
      const { data, error } = await Client.GET("/v1/benchmarks", {
        params: { query: { cursor } },
      });

      if (error) {
        throw new Error(`could not fetch benchmarks: ${error}`);
      }

      return data;
    },
    (acc, page) => ({
      details: page.details,
      benchmarks: { ...acc.benchmarks, ...page.benchmarks },
    }),
    { details: "", benchmarks: {} },
  );
}

type CreateBenchmark = {
  name: string;
  eagerStart?: boolean | undefined;
  autoTag?: boolean | undefined;
  tag?: string | undefined;
  decisionMetric?: string | undefined;
  registries: string[];
  metrics: ({ name: string; descSort?: boolean | undefined } & {})[];
  datasetName: string;
  datasetURL: string;
  datasetFromS3: boolean;
};

export async function CreateBenchmark(
  client: typeof Client,
  benchmark: CreateBenchmark,
) {
  return await client.POST("/v1/benchmark", {
    body: benchmark,
    headers: {
      "X-Csrf-Token": Cookies.get("csrf_"),
      "Content-Type": "application/json",
    },
  });
}

export async function GetBenchmark(client: typeof Client, benchId: string) {
  return await client.GET("/v1/benchmark/{id}", {
    params: {
      path: { id: benchId },
    },
  });
}

export async function GetBenchmarkRuns(client: typeof Client, benchId: string) {
  return await client.GET("/v1/benchmark/{id}/runs", {
    params: {
      path: { id: benchId },
    },
  });
}

export async function ToggleBenchmark(
  client: typeof Client,
  benchId: string,
  paused: boolean,
) {
  return await client.PUT("/v1/benchmark/{id}/toggle", {
    params: {
      path: { id: benchId },
      query: { paused },
    },
  });
}

type UpdateBenchmark = {
  name?: string | undefined;
  autoTag?: boolean | null | undefined;
  tag?: string | undefined;
  decisionMetric?: string | undefined;
};

export async function UpdateBenchmark(
  client: typeof Client,
  benchId: string,
  update: UpdateBenchmark,
) {
  return await client.PATCH("/v1/benchmark/{id}", {
    params: {
      path: { id: benchId },
    },
    body: update,
  });
}

export async function GetBestBenchmarkRuns(
  client: typeof Client,
  benchId: string,
  metrics: string[],
) {
  return await client.GET("/v1/benchmark/{id}/best", {
    params: {
      path: { id: benchId },
      query: { metrics: metrics.join(",") },
    },
  });
}
