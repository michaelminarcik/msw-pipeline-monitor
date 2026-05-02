# Architecture

## Overview

Big Data Pipeline Monitor is planned as a simple full-stack web application. It will simulate monitoring of data pipelines for a school project. The system will not run real big data jobs. It will store information about datasets, pipelines, simulated job runs, alert rules, and alert events.

The planned architecture has three main parts:

- Frontend: a React web application for the user interface.
- Backend: a Node.js and Express API for business logic.
- Database: a SQLite database accessed through Prisma.

## Frontend

The frontend will be a React application created with Vite. It will show pages for datasets, pipelines, job runs, alert rules, and alert events.

The frontend will communicate with the backend by sending HTTP requests. It will not contain important business rules. Its main responsibility is to display data and allow the user to perform actions such as creating a pipeline or starting a simulated run.

## Backend

The backend will be a Node.js application using Express. It will expose REST API endpoints and contain the main business rules.

The backend will validate incoming requests, check if requested entities exist, control job run state transitions, and create alert events when a simulated job run fails.

## Database

The database will be SQLite. It is suitable because it is simple, local, and does not require a separate database server.

Prisma will be used as the ORM. It will define the data model and provide a clear way to read and write data.

## Basic Request Flow

1. The user performs an action in the React frontend.
2. The frontend sends an HTTP request to the Express backend.
3. The backend validates the request.
4. The backend applies business rules.
5. The backend reads or writes data using Prisma.
6. The backend returns a response.
7. The frontend displays the result to the user.

Example: when the user starts a pipeline, the frontend sends a request to `POST /pipelines/:id/run`. The backend checks that the pipeline exists and is active. If the request is valid, the backend creates a new `JobRun` with status `running`.

## Suitability for a School Project

This architecture is suitable for a school project because it is easy to understand and explain. Each part has a clear responsibility:

- React handles the user interface.
- Express handles API requests and business rules.
- Prisma handles database access.
- SQLite stores the data locally.

The project is small enough for one student to implement, but it still demonstrates important software architecture concepts such as separation of concerns, REST API design, validation, persistence, and business rules.

## Simulation Scope

This project is only a simulation of pipeline monitoring. It is not a real orchestration platform.

It will not execute real Spark, Airflow, Databricks, or distributed computing jobs. It will not schedule real workflows across machines. It will only simulate pipeline runs by creating and updating records in the database.

This limitation is intentional. The goal is to demonstrate architecture, domain modeling, API design, and basic monitoring behavior in a way that is simple and defendable during an oral exam.

