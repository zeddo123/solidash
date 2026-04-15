interface ViteTypeOptions {
  strictImportMetaEnv: string
}

interface ImportMetaEnv {
  readonly VITE_MLSOLID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
