export default function ClientsLoading() {
  return (
    <div className="space-y-12 animate-pulse">
      <div className="flex justify-between items-end border-b-2 border-foreground/10 pb-6">
        <div className="space-y-2">
            <div className="h-3 w-32 bg-foreground/10" />
            <div className="h-10 w-64 bg-foreground/20" />
        </div>
      </div>
      
      <div className="border-2 border-foreground/10 overflow-hidden">
        <div className="bg-foreground/5 h-12 w-full" />
        <div className="space-y-4 p-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-12">
               <div className="h-8 w-1/3 bg-foreground/10" />
               <div className="h-8 w-1/3 bg-foreground/10" />
               <div className="h-8 w-1/3 bg-foreground/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
