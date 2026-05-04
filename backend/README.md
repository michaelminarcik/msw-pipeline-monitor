# Backend

This folder contains the backend foundation for the Big Data Pipeline Monitor school project.

The backend is a simple Node.js and Express API. It will later contain the business logic for datasets, pipelines, simulated job runs, alert rules, and alert events.

This step includes the backend structure, Prisma domain model, dataset and pipeline API endpoints, and simulated pipeline run monitoring.

## Install Dependencies

From the `backend` folder, run:

```bash
npm install
```

## Run in Development

```bash
npm run dev
```

The API will use port `3000` by default.

## Run in Production Mode

```bash
npm start
```

## Prisma Commands

Generate the Prisma client:

```bash
npm run prisma:generate
```

Create and run a development migration:

```bash
npm run prisma:migrate
```

Open Prisma Studio:

```bash
npm run prisma:studio
```

## Database Model

The backend uses SQLite as a local file-based database. This keeps the project easy to run for a school assignment because no separate database server is required.

Prisma is used as the ORM. The schema is defined in `prisma/schema.prisma`, and Prisma Client will later be used by services to read and write data.

Generate Prisma Client after installing dependencies:

```bash
npm run prisma:generate
```

Create and apply the first migration:

```bash
npm run prisma:migrate
```

Currently modeled entities:

- `Dataset`
- `Pipeline`
- `JobRun`
- `AlertRule`
- `AlertEvent`

The planned enum-like values are:

- `JobRun.status`: `pending`, `running`, `success`, `failed`
- `AlertEvent.severity`: `info`, `warning`, `critical`
- `AlertEvent.status`: `open`, `resolved`

These values are stored as strings in Prisma because the SQLite connector used by this project does not support Prisma enum types. The allowed values will be validated in the backend with Zod and business rules.

## Environment Variables

Copy `.env.example` to `.env` when local configuration is needed:

```bash
cp .env.example .env
```

Current example values:

```text
DATABASE_URL="file:./dev.db"
PORT=3000
```

Do not commit real `.env` files.


## Dataset Endpoints

### `POST /api/datasets`
Create a new dataset.

**Request body example:**
```json
{
  "name": "customer_transactions",
  "description": "Raw transaction dataset",
  "owner": "analytics-team",
  "schemaVersion": 1
}
```

**Curl example:**
```bash
curl -X POST http://localhost:3000/api/datasets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "customer_transactions",
    "description": "Raw transaction dataset",
    "owner": "analytics-team",
    "schemaVersion": 1
  }'
```

### `GET /api/datasets`
List all datasets (ordered by createdAt descending).

**Curl example:**
```bash
curl http://localhost:3000/api/datasets
```

### `GET /api/datasets/:id`
Get a dataset by its ID.

**Curl example:**
```bash
curl http://localhost:3000/api/datasets/<DATASET_ID>
```


## Pipeline Endpoints

### `POST /api/pipelines`
Create a new pipeline for an existing dataset.

**Request body example:**
```json
{
  "datasetId": "existing-dataset-id",
  "name": "daily-aggregation",
  "description": "Daily revenue aggregation",
  "schedule": "0 2 * * *",
  "active": true
}
```

**Curl example:**
```bash
curl -X POST http://localhost:3000/api/pipelines \
  -H "Content-Type: application/json" \
  -d '{
    "datasetId": "existing-dataset-id",
    "name": "daily-aggregation",
    "description": "Daily revenue aggregation",
    "schedule": "0 2 * * *",
    "active": true
  }'
```

### `GET /api/pipelines`
List all pipelines (ordered by createdAt descending).

**Curl example:**
```bash
curl http://localhost:3000/api/pipelines
```

### `GET /api/pipelines/:id`
Get a pipeline by its ID.

**Curl example:**
```bash
curl http://localhost:3000/api/pipelines/<PIPELINE_ID>
```

### `POST /api/pipelines/:id/run`
Start a simulated run for an active pipeline. This creates a `JobRun` with status `running`.

**Curl example:**
```bash
curl -X POST http://localhost:3000/api/pipelines/<PIPELINE_ID>/run
```

Inactive pipelines return `400`, and unknown pipelines return `404`.


## Run Endpoints

### `GET /api/runs`
List all job runs ordered by `startedAt` descending.

Optional query filters:

- `status`: `pending`, `running`, `success`, or `failed`
- `pipelineId`: pipeline ID

**Curl examples:**
```bash
curl http://localhost:3000/api/runs
curl "http://localhost:3000/api/runs?status=running"
curl "http://localhost:3000/api/runs?pipelineId=<PIPELINE_ID>"
```

### `GET /api/runs/:id`
Get one job run by its ID, including basic pipeline and dataset information.

**Curl example:**
```bash
curl http://localhost:3000/api/runs/<RUN_ID>
```

### `PATCH /api/runs/:id`
Finish a running job run as either `success` or `failed`.

Only runs with current status `running` can be updated. Finished runs cannot be updated again.

**Success request body example:**
```json
{
  "status": "success",
  "recordsProcessed": 15000
}
```

**Success curl example:**
```bash
curl -X PATCH http://localhost:3000/api/runs/<RUN_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "status": "success",
    "recordsProcessed": 15000
  }'
```

**Failed request body example:**
```json
{
  "status": "failed",
  "errorMessage": "Transformation failed"
}
```

When a run fails, the backend creates an `AlertEvent` with severity `critical`, status `open`, and `ruleId: null`.

**Failed curl example:**
```bash
curl -X PATCH http://localhost:3000/api/runs/<RUN_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "status": "failed",
    "errorMessage": "Transformation failed"
  }'
```

---

### `GET /health`

Returns a simple health response:

```json
{
  "status": "ok",
  "service": "Big Data Pipeline Monitor API"
}
```
