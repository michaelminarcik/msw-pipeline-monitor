# Backend

This folder contains the backend foundation for the Big Data Pipeline Monitor school project.

The backend is a simple Node.js and Express API. It will later contain the business logic for datasets, pipelines, simulated job runs, alert rules, and alert events.

This step includes the backend structure, Prisma domain model, dataset, pipeline, run, alert rule, and alert event API endpoints.

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

Seed the local database with demo data:

```bash
npm run prisma:seed
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

Seed demo data after migrations:

```bash
npm run prisma:seed
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


## Demo Seed Data

The backend includes a Prisma seed script for local development, frontend work, and oral defense demonstrations.

Run it from the `backend` folder:

```bash
npm run prisma:seed
```

The seed script clears the local demo tables and recreates:

- 3 datasets: `customer_transactions`, `customer_events`, `application_logs`
- 4 pipelines: `daily-aggregation`, `fraud-detection`, `feature-engineering`, `log-cleanup`
- several job runs with `running`, `success`, and `failed` statuses
- 3 alert rules
- critical open alert events for failed runs

Because this is demo data for a local SQLite database, the seed script deletes existing records from `AlertEvent`, `AlertRule`, `JobRun`, `Pipeline`, and `Dataset` before inserting the demo data.

Useful verification endpoints after seeding:

```bash
curl http://localhost:3000/api/datasets
curl http://localhost:3000/api/pipelines
curl http://localhost:3000/api/runs
curl http://localhost:3000/api/alert-rules
curl http://localhost:3000/api/alerts
```


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


## AlertRule Endpoints

### `POST /api/alert-rules`
Create a new alert rule for an existing pipeline.

**Request body example:**
```json
{
  "pipelineId": "existing-pipeline-id",
  "name": "runtime alert",
  "condition": "runtime > 10m",
  "enabled": true
}
```

**Curl example:**
```bash
curl -X POST http://localhost:3000/api/alert-rules \
  -H "Content-Type: application/json" \
  -d '{
    "pipelineId": "existing-pipeline-id",
    "name": "runtime alert",
    "condition": "runtime > 10m",
    "enabled": true
  }'
```

### `GET /api/alert-rules`
List all alert rules ordered by `createdAt` descending.

Optional query filter:

- `pipelineId`: pipeline ID

**Curl examples:**
```bash
curl http://localhost:3000/api/alert-rules
curl "http://localhost:3000/api/alert-rules?pipelineId=<PIPELINE_ID>"
```

### `GET /api/alert-rules/:id`
Get one alert rule by its ID.

**Curl example:**
```bash
curl http://localhost:3000/api/alert-rules/<ALERT_RULE_ID>
```

### `PATCH /api/alert-rules/:id`
Update an alert rule.

**Request body example:**
```json
{
  "name": "updated runtime alert",
  "condition": "runtime > 15m",
  "enabled": false
}
```

**Curl example:**
```bash
curl -X PATCH http://localhost:3000/api/alert-rules/<ALERT_RULE_ID> \
  -H "Content-Type: application/json" \
  -d '{
    "name": "updated runtime alert",
    "condition": "runtime > 15m",
    "enabled": false
  }'
```

### `DELETE /api/alert-rules/:id`
Delete an alert rule. Deletion is rejected if the rule already has related alert events.

**Curl example:**
```bash
curl -X DELETE http://localhost:3000/api/alert-rules/<ALERT_RULE_ID>
```


## AlertEvent Endpoints

### `GET /api/alerts`
List all alert events ordered by `createdAt` descending.

Optional query filters:

- `status`: `open` or `resolved`
- `severity`: `info`, `warning`, or `critical`
- `runId`: job run ID

**Curl examples:**
```bash
curl http://localhost:3000/api/alerts
curl "http://localhost:3000/api/alerts?status=open"
curl "http://localhost:3000/api/alerts?severity=critical"
curl "http://localhost:3000/api/alerts?runId=<RUN_ID>"
```

### `GET /api/alerts/:id`
Get one alert event by its ID.

**Curl example:**
```bash
curl http://localhost:3000/api/alerts/<ALERT_ID>
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
