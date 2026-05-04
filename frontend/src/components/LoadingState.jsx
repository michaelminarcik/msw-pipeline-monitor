function LoadingState({ message = 'Loading data...' }) {
  return (
    <div className="state-panel" role="status">
      <p>{message}</p>
    </div>
  );
}

export default LoadingState;
