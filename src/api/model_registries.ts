import { Client, collectPages } from "./mlsolid";

type CreateModelRegistry = {
  name: string;
  benchmarkImage?: string | undefined;
  benchmarkGpuPassthrough?: boolean | undefined;
};

export async function CreateModelRegistry(
  client: typeof Client,
  registry: CreateModelRegistry,
) {
  return await client.POST("/v1/registry", {
    body: registry,
  });
}

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

export async function registries(): Promise<RegistriesResponse> {
  return await collectPages<RegistriesResponse>(
    async (cursor) => {
      const { data, error } = await Client.GET("/v1/registries", {
        params: { query: { cursor } },
      });

      if (error) {
        throw new Error(`could not fetch registries: ${error}`);
      }

      return data;
    },
    (acc, page) => ({
      details: page.details,
      registries: [...acc.registries, ...page.registries],
    }),
    { details: "", registries: [] },
  );
}

export async function registry(id: string): Promise<RegistryResponse> {
  const { data, error } = await Client.GET("/v1/registry/{id}", {
    params: { path: { id } },
  });

  if (error) {
    throw new Error(`could not fetch registry: ${error}`);
  }

  return data;
}
