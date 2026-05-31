import type { Client } from "./mlsolid";
import Cookies from "js-cookie";

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
