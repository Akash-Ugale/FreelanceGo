export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div
      role="alert"
      style={{ padding: "20px", background: "#fee", color: "#900" }}
    >
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  )
}
