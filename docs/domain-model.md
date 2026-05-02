# Domain Model

## Dataset

### Purpose

A `Dataset` represents a data source or data target used by pipelines. It gives context to what a pipeline processes.

### Important Fields

- `id`: unique identifier.
- `name`: dataset name.
- `description`: optional explanation of the dataset.
- `location`: optional simulated storage location.
- `createdAt`: date and time when the dataset was created.

### Relationships

- One `Dataset` can have many `Pipelines`.
- A `Pipeline` must belong to one existing `Dataset`.

## Pipeline

### Purpose

A `Pipeline` represents a simulated data processing workflow. It does not run real distributed jobs. It only describes something that can be started and monitored in the application.

### Important Fields

- `id`: unique identifier.
- `datasetId`: reference to the related dataset.
- `name`: pipeline name.
- `description`: optional explanation of the pipeline.
- `isActive`: tells whether the pipeline can be run.
- `createdAt`: date and time when the pipeline was created.

### Relationships

- One `Pipeline` belongs to one `Dataset`.
- One `Pipeline` can have many `JobRuns`.
- One `Pipeline` can have many `AlertRules`.

## JobRun

### Purpose

A `JobRun` represents one simulated execution of a pipeline. It stores the status and timing of the run.

### Important Fields

- `id`: unique identifier.
- `pipelineId`: reference to the pipeline that was run.
- `status`: current status, such as `running`, `success`, or `failed`.
- `startedAt`: date and time when the run started.
- `finishedAt`: optional date and time when the run finished.
- `message`: optional message with additional information.

### Relationships

- One `JobRun` belongs to one `Pipeline`.
- One failed `JobRun` can create one or more `AlertEvents`.

## AlertRule

### Purpose

An `AlertRule` defines when an alert should be created. In the first version, the most important rule is creating an alert when a job run fails.

### Important Fields

- `id`: unique identifier.
- `pipelineId`: reference to the pipeline.
- `name`: rule name.
- `type`: rule type, for example `on_failure`.
- `isActive`: tells whether the rule is enabled.
- `createdAt`: date and time when the rule was created.

### Relationships

- One `AlertRule` belongs to one `Pipeline`.
- One `AlertRule` can be connected to many `AlertEvents`.

## AlertEvent

### Purpose

An `AlertEvent` represents an alert that was created because something important happened, such as a failed job run.

### Important Fields

- `id`: unique identifier.
- `alertRuleId`: optional reference to the rule that created the alert.
- `jobRunId`: reference to the failed job run.
- `message`: alert message.
- `createdAt`: date and time when the alert was created.
- `resolvedAt`: optional date and time when the alert was resolved.

### Relationships

- One `AlertEvent` can belong to one `AlertRule`.
- One `AlertEvent` belongs to one `JobRun`.

## Optional Future Entities

These entities are useful ideas for future versions, but they are not part of the first implementation.

### PipelineVersion

`PipelineVersion` could store different versions of a pipeline definition. This would be useful if the project later needs change history or rollback behavior.

### JobRunStep

`JobRunStep` could represent individual steps inside a job run, such as extract, transform, and load. This would make run monitoring more detailed, but it is not needed for the first version.

### User

`User` could support authentication and ownership of datasets or pipelines. Authentication is not planned for the first implementation because it would add complexity that is not necessary for the main architecture goal.

