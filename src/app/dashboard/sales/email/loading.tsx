export default function EmailLoading() {
  return (
    <div className="space-y-12 animate-pulse">
      <div className="flex flex-col gap-2 pb-6 border-b-2 border-foreground/10">
        <div className="h-3 w-32 bg-foreground/10" />
        <div className="h-10 w-64 bg-foreground/20" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="h-96 border-2 border-foreground/10" />
        <div className="h-96 border-2 border-foreground/10" />
      </div>
    </div>
  )
}
