import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/apiClient.js';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { formatDateTime, formatNumber, formatStatus } from '../utils/formatters.js';

function StatusBadge({ value }) {
  const status = value || 'unknown';

  return <span className={`status-badge status-${status}`}>{formatStatus(status)}</span>;
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
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id}>
                  <td>{run.pipeline?.name || '-'}</td>
                  <td>{run.pipeline?.dataset?.name || '-'}</td>
                  <td>
                    <StatusBadge value={run.status} />
                  </td>
                  <td>{formatDateTime(run.startedAt)}</td>
                  <td>{formatDateTime(run.finishedAt)}</td>
                  <td>{formatNumber(run.recordsProcessed)}</td>
                  <td>
                    <Link className="text-link" to={`/runs/${run.id}`}>
                      View detail
                    </Link>
                  </td>
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
