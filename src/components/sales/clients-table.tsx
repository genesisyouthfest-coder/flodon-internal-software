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
import { format } from 'date-fns'
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
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search clients, brands, or emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {['all', 'lead', 'contacted', 'proposal', 'closed_won', 'closed_lost'].map((stage) => (
            <Button
              key={stage}
              variant={stageFilter === stage ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStageFilter(stage)}
              className="capitalize whitespace-nowrap"
            >
              {stage.replace('_', ' ')}
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Pipeline Stage</TableHead>
              <TableHead>Email Status</TableHead>
              <TableHead>Date Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                <TableRow key={client.id} className="group">
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.brand_name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{client.service}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{client.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        client.pipeline_stage === 'closed_won' ? 'default' :
                        client.pipeline_stage === 'closed_lost' ? 'destructive' : 'secondary'
                      }
                      className="capitalize"
                    >
                      {client.pipeline_stage?.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {client.email_sent ? (
                      <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-xs font-medium">Sent</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-amber-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-xs font-medium">Pending</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(client.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/sales/clients/${client.id}`}>
                        <ExternalLink className="w-4 h-4" />
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
