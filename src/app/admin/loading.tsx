export default function AdminLoading() {
  return (
    <div className="w-full h-full space-y-12 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-foreground/10">
        <div className="space-y-4">
          <div className="h-4 w-32 bg-foreground/10 animate-pulse" />
          <div className="h-12 w-80 bg-foreground/20 animate-pulse" />
          <div className="h-4 w-64 bg-foreground/10 animate-pulse" />
        </div>
      </div>

      {/* Analytics Grid Skeleton */}
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-2 border-foreground/10 p-8 space-y-4 flex flex-col justify-between h-40">
            <div className="h-3 w-32 bg-foreground/10 animate-pulse" />
            <div className="h-12 w-32 bg-foreground/20 animate-pulse" />
            <div className="h-1 bg-foreground/10 w-full mt-4" />
          </div>
        ))}
      </div>

      {/* Recent Activity Table Skeleton */}
      <div className="space-y-6">
        <div className="h-8 w-64 bg-foreground/20 animate-pulse" />
        <div className="border-2 border-foreground/10 bg-card overflow-hidden">
          <div className="bg-foreground/5 h-12 w-full" />
          <div className="divide-y-2 divide-foreground/5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-6 flex justify-between items-center">
                <div className="h-4 w-40 bg-foreground/10 animate-pulse" />
                <div className="h-4 w-32 bg-foreground/10 animate-pulse" />
                <div className="h-4 w-24 bg-foreground/10 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
