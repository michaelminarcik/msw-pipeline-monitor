# Backend

This folder contains the backend foundation for the Big Data Pipeline Monitor school project.

The backend is a simple Node.js and Express API. It will later contain the business logic for datasets, pipelines, simulated job runs, alert rules, and alert events.

This step prepares the backend structure and the first Prisma domain model. It does not implement the main business endpoints yet.

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

## Current Endpoint

### `GET /health`

Returns a simple health response:

```json
{
  "status": "ok",
  "service": "Big Data Pipeline Monitor API"
}
```

## Current Status

Backend foundation and database model step only. Dataset, pipeline, run, alert rule, and alert endpoints will be added later.
