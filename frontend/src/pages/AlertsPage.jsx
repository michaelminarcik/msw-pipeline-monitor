function AlertsPage() {
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
        <p>Open and resolved alert lists will be connected to the backend in a later step.</p>
      </article>
    </section>
  );
}

export default AlertsPage;
