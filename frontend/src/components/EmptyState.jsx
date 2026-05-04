function EmptyState({ message = 'No data available yet.' }) {
  return (
    <div className="state-panel empty">
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;
