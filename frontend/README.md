# Frontend

This folder contains the React frontend for the Big Data Pipeline Monitor school project.

The current frontend is intentionally simple. It sets up routing, a shared layout, reusable state components, styling, and an Axios API client. The Dashboard and list pages are connected to the backend API, pipelines and runs have detail pages, and basic create forms are available. Navigation links and date/status formatting have been cleaned up for a more consistent demo.

## Technologies

- React
- Vite
- React Router
- Axios

## Install Dependencies

From the `frontend` folder, run:

```bash
npm install
```

## Run in Development

```bash
npm run dev
```

The Vite development server uses port `5173` by default:

```text
http://localhost:5173
```

## Backend API URL

The frontend reads the backend API base URL from:

```text
VITE_API_BASE_URL
```

Create a local `.env` file only when needed. Use `.env.example` as the template:

```text
VITE_API_BASE_URL=/api
```

During development, Vite proxies `/api` requests to `http://localhost:3000`, so the backend should be running there.

## Available Routes

- `/` - Dashboard with backend summary metrics
- `/datasets` - Dataset list
- `/pipelines` - Pipeline list
- `/pipelines/:id` - Pipeline detail with manual run action
- `/runs` - Run history list
- `/runs/:id` - Run detail with finish actions for running runs
- `/alerts` - Alert event list

## Current Status

Dashboard and list pages are connected to the backend API. Datasets can be created from the frontend, and pipelines can be created by selecting an existing dataset. Pipeline detail can manually start an active pipeline run. Run detail can mark a running run as success or failed; failed runs create alerts through backend business logic. UI cleanup is complete for the current scope, with improved internal links and consistent date/status formatting. Edit forms and other detail pages are planned for later steps.
