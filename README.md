# Solidash
This is a beautifull dashboard interface for [mlsolid](https://github.com/zeddo123/mlsolid), an MLOps platform. This
project aims to be a visualisation platform as well as UI to interface with mlsolid's service (such as creating Model registries, downloading artifacts, etc)

**Experiment Runs**
<img width="2560" height="1438" alt="Screenshot From 2026-05-07 16-08-41" src="https://github.com/user-attachments/assets/48b264c4-0eac-4d12-9e58-8a60ea2fcdc1" />
**Model Registries**
<img width="1912" height="965" alt="image" src="https://github.com/user-attachments/assets/8b577ea0-c07c-4b15-9a8d-398a8c2a34d0" />

**Benchmarks**
<img width="2560" height="1438" alt="Screenshot From 2026-05-07 16-08-48" src="https://github.com/user-attachments/assets/0471740a-2467-48bf-b806-7cf9711ec669" />

## Usage

To run the dashboard it's as easy as:

1. setting env var to mlsolid's REST API address:

```sh
VITE_BASE_URL="http://localhost:8050"
```

2. running the dashboard

```sh
bun run dev # or any way you see fit to deploy a vite+react SPA
```

## Contributions

All contributions as more than welcome. pls ;)
