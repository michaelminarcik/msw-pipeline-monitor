function ErrorState({ message = 'Something went wrong.' }) {
  return (
    <div className="state-panel error" role="alert">
      <p>{message}</p>
    </div>
  );
}

export default ErrorState;
