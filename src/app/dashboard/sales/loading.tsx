export default function SalesLoading() {
  return (
    <div className="w-full h-full space-y-12 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="space-y-4 pb-6 border-b-2 border-foreground/10">
        <div className="h-4 w-32 bg-foreground/10 animate-pulse" />
        <div className="h-12 w-64 bg-foreground/20 animate-pulse" />
        <div className="h-4 w-96 bg-foreground/10 animate-pulse" />
      </div>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border-2 border-foreground/10 p-8 space-y-4">
            <div className="h-3 w-24 bg-foreground/10 animate-pulse" />
            <div className="h-10 w-16 bg-foreground/20 animate-pulse" />
            <div className="h-3 w-32 bg-foreground/10 animate-pulse pt-2" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-6">
        {/* Task Queue Skeleton */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b-2 border-foreground/10 pb-2">
            <div className="h-4 w-32 bg-foreground/10 animate-pulse" />
          </div>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="border-2 border-foreground/10 p-6 space-y-4 border-l-8 border-l-foreground/10">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="h-4 w-48 bg-foreground/20 animate-pulse" />
                    <div className="h-3 w-64 bg-foreground/10 animate-pulse" />
                  </div>
                  <div className="h-3 w-20 bg-foreground/10 animate-pulse" />
                </div>
                <div className="h-8 w-32 bg-foreground/10 animate-pulse mt-2" />
              </div>
            ))}
          </div>
        </section>

        {/* Workflow Skeleton */}
        <section className="space-y-6">
          <div className="h-4 w-32 bg-foreground/10 animate-pulse border-b-2 border-foreground/10 pb-2" />
          <div className="grid grid-cols-1 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-6 border-2 border-foreground/10">
                <div className="space-y-2">
                  <div className="h-6 w-32 bg-foreground/20 animate-pulse" />
                  <div className="h-3 w-48 bg-foreground/10 animate-pulse" />
                </div>
                <div className="h-6 w-6 bg-foreground/10 animate-pulse" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
