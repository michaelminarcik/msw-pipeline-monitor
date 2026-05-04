import { useCallback, useEffect, useState } from 'react';
import apiClient from '../api/apiClient.js';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';

function formatDate(value) {
  if (!value) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function DatasetsPage() {
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    owner: '',
    schemaVersion: '1',
  });

  const loadDatasets = useCallback(async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      const response = await apiClient.get('/datasets');
      setDatasets(response.data);
    } catch (err) {
      setErrorMessage(err.response?.data?.error?.message || 'Datasets could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDatasets();
  }, [loadDatasets]);

  function updateField(field, value) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleCreateDataset(event) {
    event.preventDefault();

    const schemaVersion = Number(formData.schemaVersion || 1);

    if (!formData.name.trim()) {
      setFormError('Dataset name is required.');
      setFormMessage('');
      return;
    }

    if (!formData.owner.trim()) {
      setFormError('Dataset owner is required.');
      setFormMessage('');
      return;
    }

    if (!Number.isInteger(schemaVersion) || schemaVersion <= 0) {
      setFormError('Schema version must be a positive whole number.');
      setFormMessage('');
      return;
    }

    try {
      setIsSubmitting(true);
      setFormError('');
      setFormMessage('');

      await apiClient.post('/datasets', {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        owner: formData.owner.trim(),
        schemaVersion,
      });

      setFormMessage('Dataset created successfully.');
      setFormData({
        name: '',
        description: '',
        owner: '',
        schemaVersion: '1',
      });
      await loadDatasets();
    } catch (err) {
      setFormError(err.response?.data?.error?.message || 'Dataset could not be created.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <LoadingState message="Loading datasets..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">Data catalog</p>
        <h2>Datasets</h2>
        <p>
          This page will list datasets, ownership, schema versions, and connected pipelines.
        </p>
      </div>

      <article className="panel">
        <h3>Create Dataset</h3>
        <form className="stacked-form" onSubmit={handleCreateDataset}>
          <div className="form-grid">
            <label>
              Name
              <input
                type="text"
                value={formData.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="customer_orders"
              />
            </label>
            <label>
              Owner
              <input
                type="text"
                value={formData.owner}
                onChange={(event) => updateField('owner', event.target.value)}
                placeholder="analytics-team"
              />
            </label>
            <label>
              Schema Version
              <input
                type="number"
                min="1"
                step="1"
                value={formData.schemaVersion}
                onChange={(event) => updateField('schemaVersion', event.target.value)}
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

          {formMessage && <div className="notice-panel success">{formMessage}</div>}
          {formError && <div className="notice-panel error">{formError}</div>}

          <div className="action-bar left">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create dataset'}
            </button>
          </div>
        </form>
      </article>

      <article className="panel">
        <h3>Dataset List</h3>
        {datasets.length === 0 ? (
          <EmptyState message="No datasets found." />
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Schema Version</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {datasets.map((dataset) => (
                  <tr key={dataset.id}>
                    <td>{dataset.name}</td>
                    <td>{dataset.owner}</td>
                    <td>{dataset.schemaVersion}</td>
                    <td>{formatDate(dataset.createdAt)}</td>
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

export default DatasetsPage;
