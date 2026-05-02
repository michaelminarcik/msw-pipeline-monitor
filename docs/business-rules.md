# Business Rules

This document describes the main rules that the backend should enforce.

## Pipeline Rules

- A pipeline can be created only for an existing dataset.
- A pipeline can be run only if it exists.
- A pipeline can be run only if it is active.

## Job Run Rules

- Running a pipeline creates a `JobRun` with status `running`.
- A `JobRun` can transition from `running` to `success`.
- A `JobRun` can transition from `running` to `failed`.
- Invalid state transitions should return an error.

Examples of invalid transitions:

- `success` to `running`
- `failed` to `running`
- `success` to `failed`
- `failed` to `success`

## Alert Rules

- When a `JobRun` fails, an `AlertEvent` is created.
- The alert should reference the failed `JobRun`.
- If active alert rules exist for the pipeline, the alert can also reference the related `AlertRule`.

## Error Handling

The API should return a clear error when a rule is violated.

Examples:

- Creating a pipeline for a dataset that does not exist should return an error.
- Running an inactive pipeline should return an error.
- Updating a finished job run should return an error.

