export default function PrivateRouteLoading() {
  return (
    <div
      aria-label="Loading page"
      className="mx-auto flex w-full animate-pulse flex-col gap-5 px-5 py-5 md:max-w-4xl md:p-6 wide:max-w-7xl"
    >
      <div className="space-y-2">
        <div className="h-7 w-40 rounded bg-muted" />
        <div className="h-4 w-72 max-w-full rounded bg-muted" />
      </div>
      <div className="h-12 rounded-md bg-card shadow-card" />
      <div className="h-56 rounded-md bg-card shadow-card" />
    </div>
  )
}
