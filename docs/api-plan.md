# API Plan

This document lists the REST API endpoints implemented in the backend and where they are used by the frontend.

## Health

### `GET /health` (implemented)

Returns a simple backend health response.

Frontend usage: useful for manual verification.

## Datasets

### `POST /api/datasets` (implemented)

Creates a dataset.

Frontend usage: Datasets page create form.

### `GET /api/datasets` (implemented)

Returns all datasets.

Frontend usage: Dashboard, Datasets page, Pipelines page dataset dropdown.

### `GET /api/datasets/:id` (implemented)

Returns one dataset by ID.

Frontend usage: not currently used by a dedicated detail page.

## Pipelines

### `POST /api/pipelines` (implemented)

Creates a pipeline for an existing dataset.

Frontend usage: Pipelines page create form.

### `GET /api/pipelines` (implemented)

Returns all pipelines.

Frontend usage: Dashboard and Pipelines page.

### `GET /api/pipelines/:id` (implemented)

Returns one pipeline with dataset, recent runs, and alert rules.

Frontend usage: Pipeline detail page.

### `POST /api/pipelines/:id/run` (implemented)

Starts a simulated run for an active pipeline.

Frontend usage: Pipeline detail page `Run pipeline` button.

## Runs

### `GET /api/runs` (implemented)

Returns all job runs.

Frontend usage: Dashboard and Runs page.

### `GET /api/runs/:id` (implemented)

Returns one job run with pipeline, dataset, and alert events.

Frontend usage: Run detail page.

### `PATCH /api/runs/:id` (implemented)

Finishes a running job run as `success` or `failed`.

Frontend usage: Run detail page finish actions.

## Alert Rules

### `POST /api/alert-rules` (implemented)

Creates an alert rule for a pipeline.

Frontend usage: not currently exposed as a form.

### `GET /api/alert-rules` (implemented)

Returns all alert rules.

Frontend usage: available for API verification.

### `GET /api/alert-rules/:id` (implemented)

Returns one alert rule.

Frontend usage: not currently used by a dedicated detail page.

### `PATCH /api/alert-rules/:id` (implemented)

Updates an alert rule.

Frontend usage: not currently exposed.

### `DELETE /api/alert-rules/:id` (implemented)

Deletes an alert rule if it has no related alert events.

Frontend usage: not currently exposed.

## Alerts

### `GET /api/alerts` (implemented)

Returns all alert events.

Frontend usage: Dashboard and Alerts page.

### `GET /api/alerts/:id` (implemented)

Returns one alert event.

Frontend usage: not currently used by a dedicated detail page.
