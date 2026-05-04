# Big Data Pipeline Monitor

Big Data Pipeline Monitor is a school project for a Software Architecture course. The goal is to build a simple simulated monitoring system for data pipelines.

This project is not a real Spark, Airflow, Databricks, or distributed computing platform. It will simulate pipeline monitoring by storing datasets, pipelines, job runs, alert rules, and alert events in a local application.

## Planned Features

- Manage datasets.
- Manage simulated pipelines.
- Start simulated pipeline runs.
- Track job run status.
- Mark job runs as successful or failed.
- Create alert events when job runs fail.
- View alert rules and alert events.

## Planned Technologies

- Backend: Node.js + Express
- Validation: Zod
- ORM: Prisma
- Database: SQLite
- Frontend: React + Vite
- API client: Axios
- Routing: React Router

## Repository Structure

```text
msw-pipeline-monitor/
├── backend/
├── frontend/
├── docs/
├── README.md
└── .gitignore
```

## Documentation

- `docs/architecture.md`: planned system architecture.
- `docs/domain-model.md`: main domain entities and relationships.
- `docs/business-rules.md`: important business rules.
- `docs/api-plan.md`: planned REST API endpoints.
- `docs/technology-decisions.md`: chosen technologies and reasons.

## Running the Frontend

The React frontend foundation is available in the `frontend` folder.

```bash
cd frontend
npm install
npm run dev
```

By default, Vite serves the frontend at:

```text
http://localhost:5173
```

The frontend expects the backend API at:

```text
http://localhost:3000/api
```

## Current Project Status

Backend API and seed data are implemented. Frontend foundation is ready for page implementation.

