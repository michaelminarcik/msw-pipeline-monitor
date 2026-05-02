# Domain Model

The domain model describes the main concepts in the simulated pipeline monitoring system. The project stores metadata and simulated run results. It does not execute real Spark, Airflow, Databricks, or distributed computing jobs.

## Dataset

### Purpose

A `Dataset` represents a data source metadata record. It describes data that can be processed by one or more pipelines.

### Important Fields

- `id`: UUID primary key.
- `name`: unique dataset name.
- `description`: optional explanation of the dataset.
- `owner`: person or team responsible for the dataset.
- `schemaVersion`: version number of the dataset schema, default `1`.
- `createdAt`: date and time when the dataset was created.
- `updatedAt`: date and time when the dataset was last updated.

### Relationships

- One `Dataset` can have many `Pipelines`.
- A `Pipeline` must belong to one existing `Dataset`.

## Pipeline

### Purpose

A `Pipeline` represents a configured data processing pipeline. In this project it is only a simulated pipeline definition, not a real orchestration workflow.

### Important Fields

- `id`: UUID primary key.
- `datasetId`: reference to the related dataset.
- `name`: pipeline name.
- `description`: optional explanation of the pipeline.
- `schedule`: optional text description of when the pipeline should run.
- `active`: tells whether the pipeline can be run, default `true`.
- `createdAt`: date and time when the pipeline was created.
- `updatedAt`: date and time when the pipeline was last updated.

### Relationships

- One `Pipeline` belongs to one `Dataset`.
- One `Pipeline` can have many `JobRuns`.
- One `Pipeline` can have many `AlertRules`.
- The same dataset cannot have two pipelines with the same name.

## JobRun

### Purpose

A `JobRun` represents one simulated execution of a pipeline. It stores the run status, timing, processed record count, and possible error message.

### Important Fields

- `id`: UUID primary key.
- `pipelineId`: reference to the pipeline that was run.
- `status`: current status: `pending`, `running`, `success`, or `failed`.
- `startedAt`: date and time when the run started.
- `finishedAt`: optional date and time when the run finished.
- `recordsProcessed`: number of processed records, default `0`.
- `errorMessage`: optional error message for failed runs.
- `createdAt`: date and time when the job run was created.
- `updatedAt`: date and time when the job run was last updated.

### Relationships

- One `JobRun` belongs to one `Pipeline`.
- One `JobRun` can have many `AlertEvents`.

## AlertRule

### Purpose

An `AlertRule` represents a rule that can trigger an alert. For example, a rule can describe that a failed run should create an alert.

### Important Fields

- `id`: UUID primary key.
- `pipelineId`: reference to the pipeline.
- `name`: rule name.
- `condition`: simple text description of the alert condition.
- `enabled`: tells whether the rule is active, default `true`.
- `createdAt`: date and time when the rule was created.
- `updatedAt`: date and time when the rule was last updated.

### Relationships

- One `AlertRule` belongs to one `Pipeline`.
- One `AlertRule` can have many `AlertEvents`.

## AlertEvent

### Purpose

An `AlertEvent` represents an actual alert created when a rule is triggered or when a run fails.

### Important Fields

- `id`: UUID primary key.
- `ruleId`: optional reference to the alert rule.
- `runId`: reference to the related job run.
- `message`: alert message.
- `severity`: alert severity: `info`, `warning`, or `critical`.
- `status`: alert status: `open` or `resolved`.
- `createdAt`: date and time when the alert event was created.
- `updatedAt`: date and time when the alert event was last updated.

### Relationships

- One `AlertEvent` belongs to one `JobRun`.
- One `AlertEvent` can optionally belong to one `AlertRule`.
- `ruleId` is optional so a failed job run can create an alert even if no alert rule exists.

## Optional Future Entities

These entities are useful ideas for future versions, but they are not part of the first implementation.

### PipelineVersion

`PipelineVersion` could store different versions of a pipeline definition. This would be useful if the project later needs change history or rollback behavior.

### JobRunStep

`JobRunStep` could represent individual steps inside a job run, such as extract, transform, and load. This would make run monitoring more detailed, but it is not needed for the first version.

### User

`User` could support authentication and ownership of datasets or pipelines. Authentication is not planned for the first implementation because it would add complexity that is not necessary for the main architecture goal.
