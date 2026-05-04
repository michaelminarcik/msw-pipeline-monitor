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

function StatusBadge({ value }) {
  const status = value || 'unknown';

  return <span className={`status-badge status-${status}`}>{status}</span>;
}

function AlertsPage() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadAlerts() {
      try {
        setIsLoading(true);
        setErrorMessage('');
        const response = await apiClient.get('/alerts');

        if (isMounted) {
          setAlerts(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setErrorMessage(err.response?.data?.error?.message || 'Alerts could not be loaded.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadAlerts();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading alerts..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  if (alerts.length === 0) {
    return <EmptyState message="No alerts found." />;
  }

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">Monitoring</p>
        <h2>Alerts</h2>
        <p>
          This page will show alert rules and alert events created by failed pipeline runs.
        </p>
      </div>

      <article className="panel">
        <h3>Alert Events</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Message</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Pipeline</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td>{alert.message}</td>
                  <td>
                    <StatusBadge value={alert.severity} />
                  </td>
                  <td>
                    <StatusBadge value={alert.status} />
                  </td>
                  <td>{alert.run?.pipeline?.name || 'Unknown'}</td>
                  <td>{formatDate(alert.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

export default AlertsPage;
