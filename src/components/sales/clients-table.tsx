'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/utils/supabase/client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { CheckCircle2, Clock, Search, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Client {
  id: string
  name: string
  brand_name: string | null
  email: string
  service: string
  pipeline_stage: string
  email_sent: boolean
  created_at: string
}

export function ClientsTable({ initialClients }: { initialClients: Client[] }) {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [search, setSearch] = useState('')
  const [stageFilter, setStageFilter] = useState('all')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Subscribe to realtime updates
    const channel = supabase
      .channel('clients-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setClients((current) => [payload.new as Client, ...current])
          } else if (payload.eventType === 'UPDATE') {
            setClients((current) =>
              current.map((c) => (c.id === payload.new.id ? (payload.new as Client) : c))
            )
          } else if (payload.eventType === 'DELETE') {
            setClients((current) => current.filter((c) => c.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.email.toLowerCase().includes(search.toLowerCase()) ||
        (client.brand_name || '').toLowerCase().includes(search.toLowerCase())
      
      const matchesStage = stageFilter === 'all' || client.pipeline_stage === stageFilter

      return matchesSearch && matchesStage
    })
  }, [clients, search, stageFilter])

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-6 items-end justify-between bg-card p-6 rounded-xl border border-border/50 shadow-sm">
        <div className="space-y-2 w-full md:w-96">
          <Label className="text-[11px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Search Database</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
            <Input
              placeholder="Filter by name, brand, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50 border-border/50 focus:border-border transition-colors"
            />
          </div>
        </div>
        <div className="space-y-2 w-full md:w-auto">
          <Label className="text-[11px] uppercase font-bold tracking-[0.2em] text-muted-foreground ml-1">Pipeline Filter</Label>
          <div className="flex gap-1 bg-muted/30 p-1 rounded-lg border border-border/50">
            {['all', 'lead', 'contacted', 'proposal', 'closed_won', 'closed_lost'].map((stage) => (
              <Button
                key={stage}
                variant={stageFilter === stage ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setStageFilter(stage)}
                className={cn(
                  "capitalize h-8 text-[11px] font-bold tracking-tight rounded-md transition-all",
                  stageFilter === stage ? "bg-background shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {stage.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border/50">
              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80 py-4">Client Name</TableHead>
              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80">Corporate Brand</TableHead>
              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80">Main Service</TableHead>
              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80">Pipeline</TableHead>
              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80">Outreach</TableHead>
              <TableHead className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80">Joined</TableHead>
              <TableHead className="text-right text-[10px] uppercase font-bold tracking-widest text-muted-foreground/80 pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No clients found.
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow key={client.id} className="group border-border/40 hover:bg-secondary/20 transition-colors">
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold tracking-tight text-sm">{client.name}</span>
                      <span className="text-[10px] text-muted-foreground/60 font-medium">{client.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{client.brand_name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 text-primary/80 border-primary/20 text-[10px] font-bold tracking-wider px-2 py-0">
                      {client.service}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                         client.pipeline_stage === 'closed_won' ? 'default' :
                         client.pipeline_stage === 'closed_lost' ? 'destructive' : 'secondary'
                      }
                      className="capitalize text-[10px] font-bold px-2 py-0.5 shadow-none"
                    >
                      {client.pipeline_stage?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {client.email_sent ? (
                      <div className="flex items-center gap-1.5 text-emerald-500">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Sent</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-500 opacity-60">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Queue</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-[11px] font-mono text-muted-foreground/60">
                    {format(new Date(client.created_at), 'MM/dd/yy')}
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg">
                      <Link href={`/dashboard/sales/clients/${client.id}`}>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
