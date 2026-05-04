import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient.js';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';

function StatusBadge({ value }) {
  const status = value || 'unknown';

  return <span className={`status-badge status-${status}`}>{status}</span>;
}

function PipelinesPage() {
  const [pipelines, setPipelines] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    datasetId: '',
    name: '',
    description: '',
    schedule: '',
    active: true,
  });

  const loadPageData = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      const [pipelinesResponse, datasetsResponse] = await Promise.all([
        apiClient.get('/pipelines'),
        apiClient.get('/datasets'),
      ]);

      setPipelines(pipelinesResponse.data);
      setDatasets(datasetsResponse.data);

      if (datasetsResponse.data.length > 0) {
        setFormData((current) => ({
          ...current,
          datasetId: current.datasetId || datasetsResponse.data[0].id,
        }));
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.error?.message || 'Pipelines could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  function updateField(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleCreatePipeline(event) {
    event.preventDefault();

    if (!formData.datasetId) {
      setFormError('Please select a dataset.');
      setFormMessage('');
      return;
    }

    if (!formData.name.trim()) {
      setFormError('Pipeline name is required.');
      setFormMessage('');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');
      setFormMessage('');

      await apiClient.post('/pipelines', {
        datasetId: formData.datasetId,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        schedule: formData.schedule.trim() || undefined,
        active: formData.active,
      });

      setFormMessage('Pipeline created successfully.');
      setFormData({
        datasetId: datasets[0]?.id || '',
        name: '',
        description: '',
        schedule: '',
        active: true,
      });
      await loadPageData();
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Pipeline could not be created.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading pipelines..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">Processing</p>
        <h2>Pipelines</h2>
        <p>
          This page will show configured pipelines, schedules, active state, and run actions.
        </p>
      </div>

      <article className="panel">
        <h3>Create Pipeline</h3>
        <form className="stacked-form" onSubmit={handleCreatePipeline}>
          <div className="form-grid">
            <label>
              Dataset
              <select
                value={formData.datasetId}
                onChange={(event) => updateField('datasetId', event.target.value)}
                disabled={datasets.length === 0}
              >
                {datasets.length === 0 ? (
                  <option value="">No datasets available</option>
                ) : (
                  datasets.map((dataset) => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </option>
                  ))
                )}
              </select>
            </label>
            <label>
              Name
              <input
                type="text"
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="daily-orders-pipeline"
              />
            </label>
            <label>
              Schedule
              <input
                type="text"
                value={formData.schedule}
                onChange={(event) => updateField('schedule', event.target.value)}
                placeholder="0 2 * * *"
              />
            </label>
            <label>
              Description
              <input
                type="text"
                value={formData.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Optional description"
              />
            </label>
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(event) => updateField('active', event.target.checked)}
            />
            Active pipeline
          </label>

          {formMessage && <div className="notice-panel success">{formMessage}</div>}
          {formError && <div className="notice-panel error">{formError}</div>}

          <div className="action-bar left">
            <button type="submit" disabled={isSubmitting || datasets.length === 0}>
              {isSubmitting ? 'Creating...' : 'Create pipeline'}
            </button>
          </div>
        </form>
      </article>

      <article className="panel">
        <h3>Pipeline List</h3>
        {pipelines.length === 0 ? (
          <EmptyState message="No pipelines found." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Dataset</th>
                  <th>Schedule</th>
                  <th>Active</th>
                  <th>Latest Run</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pipelines.map((pipeline) => {
                  const latestRun = pipeline.runs?.[0];

                  return (
                    <tr key={pipeline.id}>
                      <td>{pipeline.name}</td>
                      <td>{pipeline.dataset?.name || 'Unknown'}</td>
                      <td>{pipeline.schedule || 'Not scheduled'}</td>
                      <td>
                        <StatusBadge value={pipeline.active ? 'active' : 'inactive'} />
                      </td>
                      <td>
                        {latestRun ? <StatusBadge value={latestRun.status} /> : <span className="muted-text">No runs</span>}
                      </td>
                      <td>
                        <Link className="text-link" to={`/pipelines/${pipeline.id}`}>
                          View detail
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </article>
    </section>
  );
}

export default PipelinesPage;
