export default function ClientDetailLoading() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-6 pb-6 border-b-2 border-foreground/10">
        <div className="flex items-center gap-4">
          <div className="h-4 w-32 bg-foreground/10 animate-pulse" />
          <div className="h-1 w-1 bg-foreground/10 rounded-full" />
          <div className="h-3 w-40 bg-foreground/10 animate-pulse" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="h-14 w-96 bg-foreground/20 animate-pulse" />
            <div className="h-6 w-64 bg-foreground/10 animate-pulse" />
          </div>
          <div className="h-12 w-80 bg-foreground/10 animate-pulse border-2 border-foreground/10" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Notes Skeleton */}
          <div className="h-96 border-2 border-foreground/10 bg-foreground/5 animate-pulse" />
          
          {/* Metadata Skeleton */}
          <div className="space-y-6">
            <div className="h-4 w-48 bg-foreground/10 animate-pulse border-b-2 border-foreground/10 pb-2" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2 border-l-2 border-foreground/10 pl-4">
                  <div className="h-3 w-20 bg-foreground/10 animate-pulse" />
                  <div className="h-4 w-32 bg-foreground/20 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-12">
          {/* Right Column Skeletons */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-6">
              <div className="h-4 w-32 bg-foreground/10 animate-pulse border-b-2 border-foreground/10 pb-2" />
              <div className="h-32 border-2 border-foreground/10 bg-foreground/5 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
