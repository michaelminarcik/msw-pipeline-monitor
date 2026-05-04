function DashboardPage() {
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

      <div className="panel-grid">
        <article className="panel">
          <h3>Pipeline Status</h3>
          <p>Summary cards for active pipelines and their latest run state will appear here.</p>
        </article>
        <article className="panel">
          <h3>Open Alerts</h3>
          <p>Critical and warning alerts from failed or suspicious runs will be shown here.</p>
        </article>
      </div>
    </section>
  );
}

export default DashboardPage;
