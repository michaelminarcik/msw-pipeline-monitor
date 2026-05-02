# API Plan

This document lists the planned REST API endpoints. The exact request and response bodies will be defined during implementation.

## Datasets

### `POST /datasets`

Creates a new dataset.

### `GET /datasets`

Returns a list of datasets.

### `GET /datasets/:id`

Returns one dataset by its ID.

## Pipelines

### `POST /pipelines`

Creates a new pipeline for an existing dataset.

### `GET /pipelines`

Returns a list of pipelines.

### `GET /pipelines/:id`

Returns one pipeline by its ID.

### `POST /pipelines/:id/run`

Starts a simulated run for an active pipeline. Creates a new `JobRun` with status `running`.

## Runs

### `GET /runs`

Returns a list of job runs.

### `GET /runs/:id`

Returns one job run by its ID.

### `PATCH /runs/:id`

Updates a job run status. This will be used to change a running job to `success` or `failed`.

## Alert Rules

### `POST /alert-rules`

Creates a new alert rule for a pipeline.

### `GET /alert-rules`

Returns a list of alert rules.

### `GET /alert-rules/:id`

Returns one alert rule by its ID.

### `PATCH /alert-rules/:id` optional

Updates an alert rule, for example to activate or deactivate it. This endpoint is optional for the first implementation.

### `DELETE /alert-rules/:id` optional

Deletes an alert rule. This endpoint is optional for the first implementation.

## Alerts

### `GET /alerts`

Returns a list of alert events.

### `GET /alerts/:id`

Returns one alert event by its ID.

