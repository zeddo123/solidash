import type { Client } from "./mlsolid";

export async function GetAPIKeyLabels(client: typeof Client) {
  return await client.GET("/v1/keys", {});
}

export async function CreateAPIKey(client: typeof Client, label: string) {
  return await client.POST("/v1/key", {
    params: {
      query: {
        label: label,
      },
    },
  });
}
