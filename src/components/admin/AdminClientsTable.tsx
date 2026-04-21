'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, UserCog } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { reassignClient } from '@/app/admin/clients/actions'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { getServiceLabel } from '@/lib/constants'

interface AdminClientsTableProps {
  clients: any[]
  employees: any[]
}

export function AdminClientsTable({ clients, employees }: AdminClientsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState<string | null>(null)

  const filteredClients = clients.filter(client => {
    return (
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  const handleReassign = async (clientId: string, employeeId: string) => {
    setLoading(clientId)
    const result = await reassignClient(clientId, employeeId)
    setLoading(null)

    if (result.success) {
      toast.success('Client reassigned successfully')
    } else {
      toast.error(result.error || 'Failed to reassign')
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by client name, email, service or employee..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Added By</TableHead>
              <TableHead>Email Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Reassign To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>
                  <div className="font-medium">{client.name}</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{client.role || '-'}</div>
                  <div className="text-xs text-muted-foreground">{client.email}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{getServiceLabel(client.service)}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium">{client.profiles?.full_name || 'Unknown'}</div>
                  <div className="text-[10px] text-muted-foreground">{client.profiles?.email}</div>
                </TableCell>
                <TableCell>
                  {client.email_sent ? (
                    <Badge className="bg-green-500 hover:bg-green-600">Sent</Badge>
                  ) : (
                    <Badge variant="secondary">Pending</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {format(new Date(client.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <Select
                    defaultValue={client.added_by}
                    onValueChange={(val) => handleReassign(client.id, val)}
                    disabled={loading === client.id}
                  >
                    <SelectTrigger className="w-[180px] ml-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map(emp => (
                        <SelectItem key={emp.id} value={emp.id}>{emp.full_name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
