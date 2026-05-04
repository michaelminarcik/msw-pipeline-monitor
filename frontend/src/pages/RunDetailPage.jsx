import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import apiClient from '../api/apiClient.js';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { formatDateTime, formatNumber, formatStatus } from '../utils/formatters.js';

function StatusBadge({ value }) {
  const status = value || 'unknown';

  return <span className={`status-badge status-${status}`}>{formatStatus(status)}</span>;
}

function RunDetailPage() {
  const { id } = useParams();
  const [run, setRun] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');
  const [recordsProcessed, setRecordsProcessed] = useState('15000');
  const [failureMessage, setFailureMessage] = useState('Transformation failed');

  const loadRun = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await apiClient.get(`/runs/${id}`);
      setRun(response.data);
      setRecordsProcessed(String(response.data.recordsProcessed || 15000));
    } catch (err) {
      if (err.response?.status === 404) {
        setRun(null);
        setErrorMessage('');
        return;
      }

      setErrorMessage(err.response?.data?.error?.message || 'Run detail could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadRun();
  }, [loadRun]);

  async function finishRunAsSuccess() {
    const processedNumber = Number(recordsProcessed);

    if (!Number.isInteger(processedNumber) || processedNumber < 0) {
      setActionError('Records processed must be a non-negative whole number.');
      setActionMessage('');
      return;
    }

    try {
      setIsUpdating(true);
      setActionMessage('');
      setActionError('');

      await apiClient.patch(`/runs/${id}`, {
        status: 'success',
        recordsProcessed: processedNumber,
      });

      setActionMessage('Run marked as success.');
      await loadRun();
    } catch (err) {
      setActionError(err.response?.data?.error?.message || 'Run could not be marked as success.');
    } finally {
      setIsUpdating(false);
    }
  }

  async function finishRunAsFailed() {
    try {
      setIsUpdating(true);
      setActionMessage('');
      setActionError('');

      await apiClient.patch(`/runs/${id}`, {
        status: 'failed',
        errorMessage: failureMessage || 'Transformation failed',
      });

      setActionMessage('Run marked as failed. Alert event should be created by the backend.');
      await loadRun();
    } catch (err) {
      setActionError(err.response?.data?.error?.message || 'Run could not be marked as failed.');
    } finally {
      setIsUpdating(false);
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading run detail..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  if (!run) {
    return <EmptyState message="Run was not found." />;
  }

  const isRunning = run.status === 'running';
  const alertEvents = run.alertEvents || [];

  return (
    <section className="page-section">
      <div className="detail-header">
        <div className="page-heading">
          <p className="eyebrow">Run detail</p>
          <h2>{run.pipeline?.name || 'Pipeline run'}</h2>
          <p className="mono-text">{run.id}</p>
        </div>

        <div className="action-bar">
          <Link className="text-link" to="/runs">
            Back to runs
          </Link>
        </div>
      </div>

      {actionMessage && <div className="notice-panel success">{actionMessage}</div>}
      {actionError && <div className="notice-panel error">{actionError}</div>}

      {!isRunning && (
        <div className="notice-panel">
          This run is already finished.
        </div>
      )}

      <div className="detail-grid">
        <article className="panel">
          <h3>Run Metadata</h3>
          <dl className="metadata-list">
            <div>
              <dt>Status</dt>
              <dd>
                <StatusBadge value={run.status} />
              </dd>
            </div>
            <div>
              <dt>Started</dt>
              <dd>{formatDateTime(run.startedAt)}</dd>
            </div>
            <div>
              <dt>Finished</dt>
              <dd>{formatDateTime(run.finishedAt)}</dd>
            </div>
            <div>
              <dt>Records Processed</dt>
              <dd>{formatNumber(run.recordsProcessed)}</dd>
            </div>
            <div>
              <dt>Error Message</dt>
              <dd>{run.errorMessage || <span className="muted-text">None</span>}</dd>
            </div>
          </dl>
        </article>

        <article className="panel">
          <h3>Pipeline and Dataset</h3>
          <dl className="metadata-list">
            <div>
              <dt>Pipeline</dt>
              <dd>
                {run.pipeline?.id ? (
                  <Link className="text-link" to={`/pipelines/${run.pipeline.id}`}>
                    {run.pipeline.name || 'Pipeline detail'}
                  </Link>
                ) : (
                  run.pipeline?.name || '-'
                )}
              </dd>
            </div>
            <div>
              <dt>Pipeline Status</dt>
              <dd>
                <StatusBadge value={run.pipeline?.active ? 'active' : 'inactive'} />
              </dd>
            </div>
            <div>
              <dt>Schedule</dt>
              <dd>{run.pipeline?.schedule || '-'}</dd>
            </div>
            <div>
              <dt>Dataset</dt>
              <dd>{run.pipeline?.dataset?.name || '-'}</dd>
            </div>
            <div>
              <dt>Dataset Owner</dt>
              <dd>{run.pipeline?.dataset?.owner || '-'}</dd>
            </div>
          </dl>
        </article>
      </div>

      {isRunning && (
        <article className="panel">
          <h3>Finish Running Run</h3>
          <div className="form-grid">
            <label>
              Records processed
              <input
                type="number"
                min="0"
                step="1"
                value={recordsProcessed}
                onChange={(event) => setRecordsProcessed(event.target.value)}
              />
            </label>

            <label>
              Failure message
              <textarea
                rows="3"
                value={failureMessage}
                onChange={(event) => setFailureMessage(event.target.value)}
              />
            </label>
          </div>

          <div className="action-bar left">
            <button type="button" disabled={isUpdating} onClick={finishRunAsSuccess}>
              {isUpdating ? 'Updating...' : 'Mark as success'}
            </button>
            <button type="button" disabled={isUpdating} onClick={finishRunAsFailed}>
              {isUpdating ? 'Updating...' : 'Mark as failed'}
            </button>
          </div>
        </article>
      )}

      <article className="panel">
        <h3>Alert Events</h3>
        {alertEvents.length === 0 ? (
          <p>No alert events for this run.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Message</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {alertEvents.map((alert) => (
                  <tr key={alert.id}>
                    <td>{alert.message}</td>
                    <td>
                      <StatusBadge value={alert.severity} />
                    </td>
                    <td>
                      <StatusBadge value={alert.status} />
                    </td>
                    <td>{formatDateTime(alert.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}

export default RunDetailPage;
