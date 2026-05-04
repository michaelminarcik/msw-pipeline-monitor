# API Plan

This document lists the planned REST API endpoints. The exact request and response bodies will be defined during implementation.


## Datasets (implemented)

### `POST /api/datasets` (implemented)
Creates a new dataset.

### `GET /api/datasets` (implemented)
Returns a list of datasets.

### `GET /api/datasets/:id` (implemented)
Returns one dataset by its ID.


## Pipelines (implemented)

### `POST /api/pipelines` (implemented)
Creates a new pipeline for an existing dataset.

### `GET /api/pipelines` (implemented)
Returns a list of pipelines.

### `GET /api/pipelines/:id` (implemented)
Returns one pipeline by its ID.

### `POST /api/pipelines/:id/run` (implemented)

Starts a simulated run for an active pipeline. Creates a new `JobRun` with status `running`.

## Runs (implemented)

### `GET /api/runs` (implemented)

Returns a list of job runs.

### `GET /api/runs/:id` (implemented)

Returns one job run by its ID.

### `PATCH /api/runs/:id` (implemented)

Updates a job run status. This will be used to change a running job to `success` or `failed`.

## Alert Rules (implemented)

### `POST /api/alert-rules` (implemented)

Creates a new alert rule for a pipeline.

### `GET /api/alert-rules` (implemented)

Returns a list of alert rules.

### `GET /api/alert-rules/:id` (implemented)

Returns one alert rule by its ID.

### `PATCH /api/alert-rules/:id` (implemented)

Updates an alert rule, for example to activate or deactivate it. This endpoint is optional for the first implementation.

### `DELETE /api/alert-rules/:id` (implemented)

Deletes an alert rule. This endpoint is optional for the first implementation.

## Alerts (implemented)

### `GET /api/alerts` (implemented)

Returns a list of alert events.

### `GET /api/alerts/:id` (implemented)

Returns one alert event by its ID.

