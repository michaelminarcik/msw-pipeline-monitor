import { useEffect, useState } from 'react';
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

  useEffect(() => {
    let isMounted = true;

    async function loadDatasets() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await apiClient.get('/datasets');

        if (isMounted) {
          setDatasets(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.response?.data?.error?.message || 'Datasets could not be loaded.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDatasets();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading datasets..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  if (datasets.length === 0) {
    return <EmptyState message="No datasets found." />;
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
        <h3>Dataset List</h3>
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
      </article>
    </section>
  );
}

export default DatasetsPage;
