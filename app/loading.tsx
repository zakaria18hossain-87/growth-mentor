export default function Loading() {
  return (
    <div aria-label="Loading workspace" role="status">
      <div className="skeleton title-skeleton" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton row-skeleton" />
      ))}
      <span className="sr-only">Loading your workspace…</span>
    </div>
  );
}
