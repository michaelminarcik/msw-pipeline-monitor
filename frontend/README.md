# Frontend

This folder contains the React frontend foundation for the Big Data Pipeline Monitor school project.

The current frontend is intentionally simple. It sets up routing, a shared layout, reusable state components, styling, and an Axios API client. Data fetching and full page functionality will be added in later steps.

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
VITE_API_BASE_URL=http://localhost:3000/api
```

## Available Routes

- `/` - Dashboard placeholder
- `/datasets` - Datasets placeholder
- `/pipelines` - Pipelines placeholder
- `/runs` - Runs placeholder
- `/alerts` - Alerts placeholder

## Current Status

Frontend foundation only. The pages do not fetch backend data yet.
