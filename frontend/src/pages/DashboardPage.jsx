import { useEffect, useMemo, useState } from 'react';
import apiClient from '../api/apiClient.js';
import EmptyState from '../components/EmptyState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import LoadingState from '../components/LoadingState.jsx';

const initialDashboardData = {
  datasets: [],
  pipelines: [],
  runs: [],
  alerts: [],
};

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

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState(initialDashboardData);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        setIsLoading(true);
        setErrorMessage('');

        const [datasetsResponse, pipelinesResponse, runsResponse, alertsResponse] = await Promise.all([
          apiClient.get('/datasets'),
          apiClient.get('/pipelines'),
          apiClient.get('/runs'),
          apiClient.get('/alerts'),
        ]);

        if (!isMounted) {
          return;
        }

        setDashboardData({
          datasets: datasetsResponse.data,
          pipelines: pipelinesResponse.data,
          runs: runsResponse.data,
          alerts: alertsResponse.data,
        });
      } catch (err) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(
          err.response?.data?.error?.message || 'Dashboard data could not be loaded.'
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = useMemo(() => {
    const activePipelines = dashboardData.pipelines.filter((pipeline) => pipeline.active).length;
    const failedRuns = dashboardData.runs.filter((run) => run.status === 'failed').length;
    const openAlerts = dashboardData.alerts.filter((alert) => alert.status === 'open').length;

    return [
      { label: 'Total datasets', value: dashboardData.datasets.length },
      { label: 'Total pipelines', value: dashboardData.pipelines.length },
      { label: 'Active pipelines', value: activePipelines },
      { label: 'Total runs', value: dashboardData.runs.length },
      { label: 'Failed runs', value: failedRuns },
      { label: 'Open alerts', value: openAlerts },
    ];
  }, [dashboardData]);

  const recentPipelines = dashboardData.pipelines.slice(0, 5);
  const recentRuns = dashboardData.runs.slice(0, 5);
  const openAlerts = dashboardData.alerts
    .filter((alert) => alert.status === 'open')
    .slice(0, 5);

  const hasNoData =
    dashboardData.datasets.length === 0 &&
    dashboardData.pipelines.length === 0 &&
    dashboardData.runs.length === 0 &&
    dashboardData.alerts.length === 0;

  if (isLoading) {
    return <LoadingState message="Loading dashboard data..." />;
  }

  if (errorMessage) {
    return <ErrorState message={errorMessage} />;
  }

  if (hasNoData) {
    return <EmptyState message="No dashboard data found. Seed the backend database to see demo metrics." />;
  }

  return (
    <section className="page-section">
      <div className="page-heading">
        <p className="eyebrow">Overview</p>
        <h2>Dashboard</h2>
        <p>
          This page will show the main monitoring overview with pipeline health,
          recent runs, and open alerts.
        </p>
      </div>

      <div className="summary-grid">
        {metrics.map((metric) => (
          <article className="summary-card" key={metric.label}>
            <p>{metric.label}</p>
            <strong>{metric.value}</strong>
          </article>
        ))}
      </div>

      <div className="dashboard-grid">
        <article className="panel">
          <h3>Recent Pipelines</h3>
          {recentPipelines.length === 0 ? (
            <p>No pipelines available.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Dataset</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPipelines.map((pipeline) => (
                    <tr key={pipeline.id}>
                      <td>{pipeline.name}</td>
                      <td>{pipeline.dataset?.name || 'Unknown'}</td>
                      <td>
                        <StatusBadge value={pipeline.active ? 'active' : 'inactive'} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <article className="panel">
          <h3>Recent Runs</h3>
          {recentRuns.length === 0 ? (
            <p>No runs available.</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Pipeline</th>
                    <th>Status</th>
                    <th>Started</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRuns.map((run) => (
                    <tr key={run.id}>
                      <td>{run.pipeline?.name || 'Unknown'}</td>
                      <td>
                        <StatusBadge value={run.status} />
                      </td>
                      <td>{formatDate(run.startedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <article className="panel dashboard-wide-panel">
          <h3>Open Alerts</h3>
          {openAlerts.length === 0 ? (
            <p>No open alerts.</p>
          ) : (
            <div className="alert-list">
              {openAlerts.map((alert) => (
                <div className="alert-row" key={alert.id}>
                  <div>
                    <p>{alert.message}</p>
                    <span>{alert.run?.pipeline?.name || 'Unknown pipeline'}</span>
                  </div>
                  <StatusBadge value={alert.severity} />
                </div>
              ))}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

export default DashboardPage;
