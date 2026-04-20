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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Download, Search } from 'lucide-react'
import { format } from 'date-fns'

interface AuditLogTableProps {
  logs: any[]
}

export function AuditLogTable({ logs }: AuditLogTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [actionFilter, setActionFilter] = useState('all')

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(log.metadata)?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAction = actionFilter === 'all' || log.action === actionFilter

    return matchesSearch && matchesAction
  })

  const exportToCSV = () => {
    const headers = ['Timestamp', 'Employee', 'Action', 'Entity', 'Details']
    const rows = filteredLogs.map(log => [
      format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss'),
      log.profiles?.full_name || 'System',
      log.action,
      `${log.entity_type} ${log.entity_id || ''}`,
      JSON.stringify(log.metadata)
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `flodon-audit-log-${format(new Date(), 'yyyy-MM-dd')}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const actions = Array.from(new Set(logs.map(l => l.action)))

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 gap-4 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by employee, entity or details..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={actionFilter} onValueChange={(val) => setActionFilter(val || 'all')}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              {actions.map(action => (
                <SelectItem key={action} value={action}>{action.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={exportToCSV} className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Employee</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                  {format(new Date(log.created_at), 'MMM d, HH:mm:ss')}
                </TableCell>
                <TableCell className="font-medium">{log.profiles?.full_name || 'System'}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {log.action.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  <span className="text-muted-foreground">{log.entity_type}</span>
                  {log.entity_id && <span className="ml-1 text-xs">#{log.entity_id.slice(0, 8)}</span>}
                </TableCell>
                <TableCell className="max-w-[300px] truncate text-xs text-muted-foreground">
                  {JSON.stringify(log.metadata)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
