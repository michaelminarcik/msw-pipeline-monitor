# Business Rules

This document lists the main rules enforced by the application.

## Dataset Rules

- A dataset can exist independently.
- A dataset has a unique name.
- A dataset can have many pipelines.

## Pipeline Rules

- A pipeline must reference an existing dataset.
- The same dataset cannot have two pipelines with the same name.
- A pipeline can be run only if it exists.
- A pipeline can be run only if `active` is `true`.

## JobRun Rules

- Running a pipeline creates a `JobRun`.
- A new run starts with status `running`.
- A running run can transition to `success`.
- A running run can transition to `failed`.
- Invalid state transitions are rejected.
- Finished runs cannot be updated again.

Invalid transition examples:

- `success` to `failed`
- `failed` to `success`
- `success` to `running`
- `failed` to `running`

## Alert Rules and Alert Events

- `AlertRule` describes a condition, such as `status == failed`.
- `AlertEvent` is an actual alert that happened.
- When a job run fails, the backend creates an `AlertEvent`.
- A failed run can create an alert even when no alert rule exists, so `ruleId` can be `null`.
- Alert rule deletion is rejected if related alert events exist.

## String Values

SQLite compatibility is the reason enum-like values are stored as strings. The backend validates these strings in application logic.

Allowed run statuses:

- `pending`
- `running`
- `success`
- `failed`

Allowed alert severities:

- `info`
- `warning`
- `critical`

Allowed alert statuses:

- `open`
- `resolved`

## Error Handling

The API returns clear errors when a rule is violated.

Examples:

- Creating a pipeline for a missing dataset returns an error.
- Running an inactive pipeline returns an error.
- Updating a finished run returns an error.
- Creating duplicate names returns an error where uniqueness is required.
