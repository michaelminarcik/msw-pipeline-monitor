import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient.js';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';

function formatDate(value) {
  if (!value) {
    return 'Not finished';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function StatusBadge({ value }) {
  const status = value || 'unknown';

  return <span className={`status-badge status-${status}`}>{status}</span>;
}

function RunsPage() {
  const [runs, setRuns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadRuns() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await apiClient.get('/runs');

        if (isMounted) {
          setRuns(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.response?.data?.error?.message || 'Runs could not be loaded.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadRuns();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading runs..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  if (runs.length === 0) {
    return <EmptyState message="No runs found." />;
  }

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">Execution history</p>
        <h2>Runs</h2>
        <p>
          This page will display job runs with status, timing, processed records, and errors.
        </p>
      </div>

      <article className="panel">
        <h3>Run History</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pipeline</th>
                <th>Dataset</th>
                <th>Status</th>
                <th>Started</th>
                <th>Finished</th>
                <th>Records</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id}>
                  <td>{run.pipeline?.name || 'Unknown'}</td>
                  <td>{run.pipeline?.dataset?.name || 'Unknown'}</td>
                  <td>
                    <StatusBadge value={run.status} />
                  </td>
                  <td>{formatDate(run.startedAt)}</td>
                  <td>{formatDate(run.finishedAt)}</td>
                  <td>{run.recordsProcessed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

export default RunsPage;
