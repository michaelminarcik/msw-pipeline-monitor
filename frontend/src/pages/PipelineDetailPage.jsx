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

function PipelineDetailPage() {
  const { id } = useParams();
  const [pipeline, setPipeline] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [actionError, setActionError] = useState('');

  const loadPipeline = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await apiClient.get(`/pipelines/${id}`);
      setPipeline(response.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setPipeline(null);
        setErrorMessage('');
        return;
      }

      setErrorMessage(err.response?.data?.error?.message || 'Pipeline detail could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPipeline();
  }, [loadPipeline]);

  async function handleRunPipeline() {
    try {
      setIsRunning(true);
      setActionMessage('');
      setActionError('');

      await apiClient.post(`/pipelines/${id}/run`);
      setActionMessage('Pipeline run started successfully.');
      await loadPipeline();
    } catch (err) {
      setActionError(err.response?.data?.error?.message || 'Pipeline run could not be started.');
    } finally {
      setIsRunning(false);
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading pipeline detail..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  if (!pipeline) {
    return <EmptyState message="Pipeline was not found." />;
  }

  const recentRuns = pipeline.runs || [];
  const alertRules = pipeline.alertRules || [];

  return (
    <section className="page-section">
      <div className="detail-header">
        <div className="page-heading">
          <p className="eyebrow">Pipeline detail</p>
          <h2>{pipeline.name}</h2>
          <p>{pipeline.description || 'No description provided.'}</p>
        </div>

        <div className="action-bar">
          <Link className="text-link" to="/pipelines">
            Back to pipelines
          </Link>
          <button type="button" disabled={!pipeline.active || isRunning} onClick={handleRunPipeline}>
            {isRunning ? 'Starting run...' : 'Run pipeline'}
          </button>
        </div>
      </div>

      {!pipeline.active && (
        <div className="notice-panel">
          This pipeline is inactive, so it cannot be started manually.
        </div>
      )}

      {actionMessage && <div className="notice-panel success">{actionMessage}</div>}
      {actionError && <div className="notice-panel error">{actionError}</div>}

      <div className="detail-grid">
        <article className="panel">
          <h3>Pipeline Metadata</h3>
          <dl className="metadata-list">
            <div>
              <dt>Status</dt>
              <dd>
                <StatusBadge value={pipeline.active ? 'active' : 'inactive'} />
              </dd>
            </div>
            <div>
              <dt>Schedule</dt>
              <dd>{pipeline.schedule || '-'}</dd>
            </div>
            <div>
              <dt>Created</dt>
              <dd>{formatDateTime(pipeline.createdAt)}</dd>
            </div>
            <div>
              <dt>Updated</dt>
              <dd>{formatDateTime(pipeline.updatedAt)}</dd>
            </div>
          </dl>
        </article>

        <article className="panel">
          <h3>Dataset</h3>
          {pipeline.dataset ? (
            <dl className="metadata-list">
              <div>
                <dt>Name</dt>
                <dd>{pipeline.dataset.name}</dd>
              </div>
              <div>
                <dt>Owner</dt>
                <dd>{pipeline.dataset.owner || '-'}</dd>
              </div>
              <div>
                <dt>Schema Version</dt>
                <dd>{formatNumber(pipeline.dataset.schemaVersion)}</dd>
              </div>
            </dl>
          ) : (
            <p>No dataset information available.</p>
          )}
        </article>
      </div>

      <article className="panel">
        <h3>Recent Runs</h3>
        {recentRuns.length === 0 ? (
          <p>No runs available for this pipeline.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Started</th>
                  <th>Finished</th>
                  <th>Records</th>
                  <th>Error</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentRuns.map((run) => (
                  <tr key={run.id}>
                    <td>
                      <StatusBadge value={run.status} />
                    </td>
                    <td>{formatDateTime(run.startedAt)}</td>
                    <td>{formatDateTime(run.finishedAt)}</td>
                    <td>{formatNumber(run.recordsProcessed)}</td>
                    <td>{run.errorMessage || <span className="muted-text">None</span>}</td>
                    <td>
                      <Link className="text-link" to={`/runs/${run.id}`}>
                        View run
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <article className="panel">
        <h3>Alert Rules</h3>
        {alertRules.length === 0 ? (
          <p>No alert rules configured for this pipeline.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Condition</th>
                  <th>Enabled</th>
                </tr>
              </thead>
              <tbody>
                {alertRules.map((rule) => (
                  <tr key={rule.id}>
                    <td>{rule.name}</td>
                    <td>{rule.condition}</td>
                    <td>
                      <StatusBadge value={rule.enabled ? 'active' : 'inactive'} />
                    </td>
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

export default PipelineDetailPage;
