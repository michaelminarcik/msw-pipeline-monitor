# Domain Model

The domain model describes the entities used by the simulated pipeline monitoring system. The project stores metadata and simulated run results. It does not execute real Spark, Airflow, Databricks, or distributed computing jobs.

## Dataset

`Dataset` represents a data source metadata record.

Important fields:

- `id`
- `name`
- `description`
- `owner`
- `schemaVersion`
- `createdAt`
- `updatedAt`

Relationships:

- One dataset can have many pipelines.
- A dataset can exist independently.

## Pipeline

`Pipeline` represents a configured simulated processing pipeline.

Important fields:

- `id`
- `datasetId`
- `name`
- `description`
- `schedule`
- `active`
- `createdAt`
- `updatedAt`

Relationships:

- One pipeline belongs to one dataset.
- One pipeline can have many job runs.
- One pipeline can have many alert rules.
- The combination of `datasetId` and `name` is unique.

## JobRun

`JobRun` represents one simulated execution of a pipeline.

Important fields:

- `id`
- `pipelineId`
- `status`
- `startedAt`
- `finishedAt`
- `recordsProcessed`
- `errorMessage`
- `createdAt`
- `updatedAt`

Relationships:

- One job run belongs to one pipeline.
- One job run can have many alert events.

Allowed status values:

- `pending`
- `running`
- `success`
- `failed`

## AlertRule

`AlertRule` represents a condition that can be used to describe when an alert should happen.

Important fields:

- `id`
- `pipelineId`
- `name`
- `condition`
- `enabled`
- `createdAt`
- `updatedAt`

Relationships:

- One alert rule belongs to one pipeline.
- One alert rule can have many alert events.

## AlertEvent

`AlertEvent` represents an actual alert that happened.

Important fields:

- `id`
- `ruleId`
- `runId`
- `message`
- `severity`
- `status`
- `createdAt`
- `updatedAt`

Relationships:

- One alert event belongs to one job run.
- One alert event can optionally belong to one alert rule.
- `ruleId` is optional so failed runs can create alerts even if no rule exists.

Allowed severity values:

- `info`
- `warning`
- `critical`

Allowed status values:

- `open`
- `resolved`

## SQLite String Values

Enum-like values are stored as strings because the project uses SQLite. The backend validates these values with Zod and business rules.

## Not Implemented

These entities are not implemented in the current project:

- `User`
- `JobRunStep`
- `PipelineVersion`

They can be explained as possible future extensions, but they are not part of the working implementation.
