# Frontend

The frontend is the React user interface for the Big Data Pipeline Monitor school project. It connects to the backend API and allows the user to view monitoring data, create datasets and pipelines, start pipeline runs, and finish running job runs.

## Technologies

- React
- Vite
- React Router
- Axios

## Environment Variables

The frontend reads the API base URL from:

```text
VITE_API_BASE_URL
```

The default example is:

```text
VITE_API_BASE_URL=/api
```

During development, Vite proxies `/api` requests to `http://localhost:3000`, so the backend should be running there.

Create a local `.env` only if needed:

```powershell
Copy-Item .env.example .env
```

## Install and Run

From the `frontend` folder:

```powershell
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## Available Routes

- `/` - dashboard with summary metrics and recent activity
- `/datasets` - dataset list and create dataset form
- `/pipelines` - pipeline list and create pipeline form
- `/pipelines/:id` - pipeline detail with manual run action
- `/runs` - run history list
- `/runs/:id` - run detail with finish actions for running runs
- `/alerts` - alert event list

## Main UI Pages

- Dashboard shows totals for datasets, pipelines, runs, failed runs, and open alerts.
- Datasets shows existing datasets and includes a form for creating a dataset.
- Pipelines shows existing pipelines and includes a form for creating a pipeline by selecting an existing dataset.
- Pipeline detail shows pipeline metadata, dataset info, recent runs, alert rules, and a `Run pipeline` action for active pipelines.
- Runs shows job run history.
- Run detail shows run metadata, pipeline and dataset info, related alert events, and actions to mark a running run as success or failed.
- Alerts shows alert events created by failed runs.

## Backend Connection

The Axios client is defined in `src/api/apiClient.js`. In local development it calls `/api`, and Vite forwards those requests to:

```text
http://localhost:3000
```

This keeps frontend API calls simple and avoids browser CORS issues during local development.
