# Architecture

## Overview

Big Data Pipeline Monitor is a simple full-stack web application for a school project. It simulates data pipeline monitoring by storing datasets, pipelines, job runs, alert rules, and alert events.

It does not execute real Spark, Airflow, Databricks, or distributed computing jobs.

## Layers

### Frontend Layer

The frontend is a React application built with Vite. It provides pages for:

- dashboard
- datasets
- pipelines
- pipeline detail
- runs
- run detail
- alerts

The frontend uses React Router for navigation and Axios for API calls. It does not contain the main business rules. It displays data and sends user actions to the backend.

### Backend API Layer

The backend is a Node.js and Express REST API. Routes receive HTTP requests, validate input with Zod, and call service functions.

The route files stay thin. They mostly handle request/response wiring and pass errors to centralized error handling.

### Service and Business Logic Layer

Service files contain the main database and business logic. Examples:

- check that a dataset exists before creating a pipeline
- check that a pipeline is active before running it
- check valid job run state transitions
- create an alert event when a run fails

### Database Layer

SQLite stores the data locally. Prisma is used as the ORM and defines the schema in `backend/prisma/schema.prisma`.

SQLite keeps the project simple to install and demonstrate because no separate database server is required.

## Request Flow Example: Run Pipeline

1. User opens a pipeline detail page in the React frontend.
2. User clicks `Run pipeline`.
3. Frontend calls `POST /api/pipelines/:id/run`.
4. Backend route receives the request.
5. Backend service loads the pipeline.
6. Backend checks that the pipeline exists.
7. Backend checks that `active` is `true`.
8. Backend creates a `JobRun` with status `running`.
9. Backend returns the created run.
10. Frontend refreshes the pipeline detail data.

## Why This Architecture Fits the School Project

- It separates UI, API, business rules, and persistence.
- It is easy to explain during oral defense.
- It demonstrates REST API design, validation, ORM usage, and simple state transitions.
- It avoids unnecessary infrastructure such as Docker, message queues, or a real scheduler.
- It can run locally on one computer.

## Simplifications Compared to Real Platforms

- No real distributed computation.
- No real workflow scheduler.
- No workers or background processing.
- No authentication or users.
- No production deployment setup.
- Pipeline runs are simulated database records, not actual data processing jobs.
