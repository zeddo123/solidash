# Solidash
This is a beautifull dashboard interface for [mlsolid](https://github.com/zeddo123/mlsolid), an MLOps platform. This
project aims to be a visualisation platform as well as UI to interface with mlsolid's service (such as creating Model registries, downloading artifacts, etc)

**Experiment Runs**
<img width="2560" height="1438" alt="Screenshot From 2026-05-07 16-08-41" src="https://github.com/user-attachments/assets/48b264c4-0eac-4d12-9e58-8a60ea2fcdc1" />
**Model Registries**
<img width="1737" height="843" alt="image" src="https://github.com/user-attachments/assets/449f37bc-b1f5-42ae-8986-dbab28cd2b31" />
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
