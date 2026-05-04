import { useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadPipelines() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await apiClient.get('/pipelines');

        if (isMounted) {
          setPipelines(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.response?.data?.error?.message || 'Pipelines could not be loaded.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPipelines();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading pipelines..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  if (pipelines.length === 0) {
    return <EmptyState message="No pipelines found." />;
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
        <h3>Pipeline List</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Dataset</th>
                <th>Schedule</th>
                <th>Active</th>
                <th>Latest Run</th>
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
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

export default PipelinesPage;
