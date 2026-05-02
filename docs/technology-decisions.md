# Technology Decisions

## Backend: Node.js + Express

Node.js is suitable because it uses JavaScript, which can also be used on the frontend. This keeps the project easier to understand.

Express is a simple and widely used web framework for building REST APIs. It is enough for this project because the backend only needs routes, validation, business rules, and database access.

## Validation: Zod

Zod will be used to validate incoming request data. It helps make sure that API requests contain the expected fields and types.

Zod keeps validation simple because schemas can be written directly in TypeScript or JavaScript code and reused in different parts of the backend.

## ORM: Prisma

Prisma will be used to access the database. It provides a clear schema file and readable database queries.

This is useful for a school project because the database model can be explained clearly, and Prisma reduces the amount of manual SQL needed.

## Database: SQLite

SQLite is a local file-based database. It does not require installing or managing a separate database server.

This keeps the project simple to run on one computer, which is appropriate for an individual school assignment.

## Frontend: React + Vite

React will be used to build the user interface. It is popular, component-based, and suitable for creating pages such as datasets, pipelines, runs, and alerts.

Vite will be used because it provides a simple and fast development setup for React projects.

## API Client: Axios

Axios will be used by the frontend to send HTTP requests to the backend.

It is easy to use and keeps API calls readable. It also supports common features such as base URLs and error handling.

## Routing: React Router

React Router will be used for frontend navigation between pages.

It is suitable because the application will likely have separate pages for datasets, pipelines, runs, alert rules, and alerts.

## Summary

These technologies are common, lightweight, and easy to explain. They support the project goals without turning the assignment into a complex production platform.

