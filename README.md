# Big Data Pipeline Monitor

Big Data Pipeline Monitor is a school project that simulates monitoring of data pipelines. It stores datasets, pipelines, job runs, alert rules, and alert events, and provides a small React frontend for demonstrating the workflow.

This is not a real Spark, Airflow, Databricks, or distributed computing platform. It does not execute real big data jobs. Pipeline runs are simulated by creating and updating records in a local SQLite database.

## Main Features

- Dataset evidence and creation from the frontend.
- Pipeline evidence and creation from the frontend.
- Manual pipeline run for active pipelines.
- JobRun monitoring.
- Run status updates from `running` to `success` or `failed`.
- Alert rules.
- Alert events created when runs fail.
- Dashboard with summary metrics.
- Frontend forms for creating datasets and pipelines.

## Tech Stack

Backend:

- Node.js
- Express
- Prisma
- SQLite
- Zod

Frontend:

- React
- Vite
- React Router
- Axios

## Repository Structure

```text
msw-pipeline-monitor/
├── backend/
├── frontend/
├── docs/
├── README.md
└── .gitignore
```

## Fresh Clone Setup on Windows PowerShell

Clone the repository:

```powershell
git clone git@github.com:michaelminarcik/msw-pipeline-monitor.git
cd msw-pipeline-monitor
```

Set up the backend:

```powershell
cd backend
npm install
Copy-Item .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

The backend runs on:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/health
```

In a second terminal, set up the frontend:

```powershell
cd frontend
npm install
```

Create a frontend `.env` only if you need to override the default:

```powershell
Copy-Item .env.example .env
```

Start the frontend:

```powershell
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

The frontend uses `/api`, and Vite proxies those requests to the backend at `http://localhost:3000`.

## Demo Scenario

1. Open the dashboard at `http://localhost:5173`.
2. Go to Datasets and create a new dataset.
3. Go to Pipelines and create a pipeline using that dataset.
4. Open the pipeline detail page.
5. Click `Run pipeline`.
6. Open the created run detail page.
7. Mark the run as failed.
8. Open Alerts and verify that a new alert appears.

## Known Simplifications

- No real distributed computation.
- No real scheduler.
- No authentication.
- SQLite is used for local development.
- Enum-like values are stored as strings for SQLite compatibility and validated in application logic.
- Pipeline execution is simulated through API calls and database records.

## Oral Defense Notes

- The frontend, backend API, service/business logic, and database are separated.
- A pipeline must reference an existing dataset because the pipeline processes that dataset.
- Only active pipelines can be run, which prevents starting disabled or archived workflows.
- A run starts as `running` and can be finished as `success` or `failed`.
- When a run fails, the backend creates an `AlertEvent`.
- The project demonstrates REST API design, validation, persistence, relationships, and simple business rules without pretending to be a production big data platform.

## Documentation

- `docs/architecture.md`: system architecture.
- `docs/domain-model.md`: domain entities and relationships.
- `docs/business-rules.md`: important business rules.
- `docs/api-plan.md`: implemented REST API endpoints.
- `docs/technology-decisions.md`: chosen technologies and reasons.
