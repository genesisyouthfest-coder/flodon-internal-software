export default function AdminEmployeesLoading() {
  return (
    <div className="space-y-12 animate-pulse">
      <div className="flex justify-between items-end border-b-2 border-foreground/10 pb-6">
        <div className="space-y-2">
            <div className="h-3 w-32 bg-foreground/10" />
            <div className="h-10 w-64 bg-foreground/20" />
        </div>
        <div className="h-12 w-48 bg-foreground/10" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 border-2 border-foreground/10 p-8 space-y-4">
            <div className="h-6 w-32 bg-foreground/20" />
            <div className="h-4 w-48 bg-foreground/10" />
            <div className="h-8 w-24 bg-foreground/10" />
          </div>
        ))}
      </div>
    </div>
  )
}
