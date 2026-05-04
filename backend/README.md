# Backend

The backend is the API layer for the Big Data Pipeline Monitor school project. It stores metadata about datasets, pipelines, simulated job runs, alert rules, and alert events.

The backend does not run real Spark, Airflow, Databricks, or distributed jobs. It simulates pipeline monitoring by creating and updating database records.

## Technologies

- Node.js
- Express
- Prisma
- SQLite
- Zod

## Environment Variables

Create a local `.env` file from the example:

```powershell
Copy-Item .env.example .env
```

Example values:

```text
DATABASE_URL="file:./dev.db"
PORT=3000
```

Do not commit real `.env` files.

## Install and Run

From the `backend` folder:

```powershell
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

The API runs on:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/health
```

## Prisma Commands

```powershell
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run prisma:studio
```

The seed command creates demo datasets, pipelines, job runs, alert rules, and alert events for development and oral defense.

## SQLite and Enum-like Values

The project uses SQLite to keep local setup simple. SQLite compatibility is the reason enum-like values are stored as strings in Prisma.

Validated string values include:

- `JobRun.status`: `pending`, `running`, `success`, `failed`
- `AlertEvent.severity`: `info`, `warning`, `critical`
- `AlertEvent.status`: `open`, `resolved`

The backend validates these values with Zod and service-layer business rules.

## Key Business Rules

- A dataset can exist independently.
- A pipeline can be created only for an existing dataset.
- A pipeline can be run only if it exists and is active.
- Running a pipeline creates a `JobRun` with status `running`.
- A running job run can be finished as `success` or `failed`.
- Finished job runs cannot be updated again.
- A failed job run creates an `AlertEvent`.
- Alert rules describe conditions; alert events are actual alerts.

## API Overview

### Health

- `GET /health`

### Datasets

- `POST /api/datasets`
- `GET /api/datasets`
- `GET /api/datasets/:id`

### Pipelines

- `POST /api/pipelines`
- `GET /api/pipelines`
- `GET /api/pipelines/:id`
- `POST /api/pipelines/:id/run`

### Runs

- `GET /api/runs`
- `GET /api/runs/:id`
- `PATCH /api/runs/:id`

### Alert Rules

- `POST /api/alert-rules`
- `GET /api/alert-rules`
- `GET /api/alert-rules/:id`
- `PATCH /api/alert-rules/:id`
- `DELETE /api/alert-rules/:id`

Deleting an alert rule is rejected if related alert events exist.

### Alerts

- `GET /api/alerts`
- `GET /api/alerts/:id`

## Main Scenario Requests

Create a dataset:

```powershell
Invoke-RestMethod -Method Post http://localhost:3000/api/datasets `
  -ContentType "application/json" `
  -Body '{"name":"demo_orders","description":"Orders for demo","owner":"analytics-team","schemaVersion":1}'
```

Create a pipeline:

```powershell
Invoke-RestMethod -Method Post http://localhost:3000/api/pipelines `
  -ContentType "application/json" `
  -Body '{"datasetId":"<DATASET_ID>","name":"demo-pipeline","description":"Demo pipeline","schedule":"0 2 * * *","active":true}'
```

Run a pipeline:

```powershell
Invoke-RestMethod -Method Post http://localhost:3000/api/pipelines/<PIPELINE_ID>/run
```

Finish a run as failed:

```powershell
Invoke-RestMethod -Method Patch http://localhost:3000/api/runs/<RUN_ID> `
  -ContentType "application/json" `
  -Body '{"status":"failed","errorMessage":"Transformation failed"}'
```

List alerts:

```powershell
Invoke-RestMethod http://localhost:3000/api/alerts
```
