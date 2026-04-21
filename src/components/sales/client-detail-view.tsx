'use client'

import { useState, useCallback, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { format } from 'date-fns'
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  Clock,
  Send,
  Save,
  Loader2,
  CheckCircle2
} from 'lucide-react'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/navigation'
import { getServiceLabel } from '@/lib/constants'

interface ClientDetailViewProps {
  client: any
  activities: any[]
}

const STAGES = [
  { value: 'lead', label: 'Lead', color: 'bg-blue-500' },
  { value: 'contacted', label: 'Contacted', color: 'bg-indigo-500' },
  { value: 'proposal', label: 'Proposal Sent', color: 'bg-purple-500' },
  { value: 'closed_won', label: 'Closed Won', color: 'bg-green-500' },
  { value: 'closed_lost', label: 'Closed Lost', color: 'bg-red-500' },
]

export function ClientDetailView({ client: initialClient, activities: initialActivities }: ClientDetailViewProps) {
  const [client, setClient] = useState(initialClient)
  const [activities, setActivities] = useState(initialActivities)
  const [savingNotes, setSavingNotes] = useState(false)
  const [resendingEmail, setResendingEmail] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  // Handle Pipeline Stage Change
  const handleStageChange = async (newStage: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ pipeline_stage: newStage })
        .eq('id', client.id)

      if (error) throw error

      // Log activity
      const { data: userData } = await supabase.auth.getUser()
      await supabase.from('activity_log').insert({
        user_id: userData.user?.id,
        action: 'stage_changed',
        entity_type: 'client',
        entity_id: client.id,
        metadata: { old_stage: client.pipeline_stage, new_stage: newStage },
      })

      setClient({ ...client, pipeline_stage: newStage })
      toast.success(`Stage updated to ${newStage.replace('_', ' ')}`)

      // Refresh activities
      const { data: newActivities } = await supabase
        .from('activity_log')
        .select('*')
        .eq('entity_id', client.id)
        .order('created_at', { ascending: false })
      setActivities(newActivities || [])
    } catch (error: any) {
      toast.error(error.message || 'Failed to update stage')
    }
  }

  // Handle Notes Auto-save
  const debouncedSaveNotes = useCallback(
    debounce(async (newNotes: string) => {
      setSavingNotes(true)
      try {
        const { error } = await supabase
          .from('clients')
          .update({ notes: newNotes })
          .eq('id', client.id)

        if (error) throw error
        setSavingNotes(false)
      } catch (error) {
        setSavingNotes(false)
        toast.error('Failed to save notes')
      }
    }, 1000),
    [client.id]
  )

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value
    setClient({ ...client, notes: newVal })
    debouncedSaveNotes(newVal)
  }

  // Handle Resend Email
  const handleResendEmail = async () => {
    setResendingEmail(true)
    try {
      const res = await fetch('/api/email/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          clientName: client.name,
          clientEmail: client.email,
          brandName: client.brand_name,
          service: client.service,
          role: client.role,
          industry: client.industry,
          employeeName: client.profiles?.full_name || client.added_by_name || 'Your Account Manager'
        }),
      })

      if (!res.ok) throw new Error('Failed to send email')

      toast.success('Onboarding email resent successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send email')
    } finally {
      setResendingEmail(false)
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Main Info */}
      <div className="xl:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">{client.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {client.brand_name || 'Individual'} • {client.industry || 'Unknown Industry'}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge
                variant={client.email_sent ? "default" : "secondary"}
                className={client.email_sent ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {client.email_sent ? 'Email Sent' : 'Email Pending'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Added {format(new Date(client.created_at), 'MMM d, yyyy')}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Email</p>
                    <p className="text-sm font-medium">{client.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-medium">{client.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Country</p>
                    <p className="text-sm font-medium">{client.country || 'Unknown'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Instagram</p>
                    {client.ig_profile ? (
                      <a href={client.ig_profile} target="_blank" className="text-sm font-medium hover:underline text-blue-600 dark:text-blue-400">View Profile</a>
                    ) : <p className="text-sm font-medium">-</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Facebook</p>
                    {client.fb_profile ? (
                      <a href={client.fb_profile} target="_blank" className="text-sm font-medium hover:underline text-blue-600 dark:text-blue-400">View Page</a>
                    ) : <p className="text-sm font-medium">-</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Service Needed</p>
                    <p className="text-sm font-medium">{getServiceLabel(client.service)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle>Internal Notes</CardTitle>
              <CardDescription>Draft notes, reminders, or special requirements.</CardDescription>
            </div>
            {savingNotes ? (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
                <CheckCircle2 className="w-3 h-3" />
                Saved
              </div>
            )}
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Start typing notes..."
              className="min-h-[200px] resize-none border-none focus-visible:ring-0 p-0 text-base"
              value={client.notes || ''}
              onChange={handleNotesChange}
            />
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Controls */}
      <div className="space-y-6">
        {/* Pipeline Stage */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={client.pipeline_stage} onValueChange={handleStageChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STAGES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${s.color}`} />
                      {s.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {client.email_sent && (
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleResendEmail}
                disabled={resendingEmail}
              >
                {resendingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Resend Welcome Email
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="space-y-0">
              {activities.length === 0 ? (
                <p className="text-sm text-muted-foreground px-6 py-4">No activity yet.</p>
              ) : (
                activities.map((act, i) => (
                  <div key={act.id} className="relative pl-8 pr-6 py-4 border-b last:border-0 group">
                    {/* Timeline Line */}
                    {i !== activities.length - 1 && (
                      <div className="absolute left-[15px] top-6 bottom-0 w-[2px] bg-muted" />
                    )}
                    {/* Timeline Dot */}
                    <div className="absolute left-[10px] top-[18px] w-3 h-3 rounded-full bg-primary border-2 border-background z-10" />

                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {act.action === 'client_added' ? 'Client onboarded' :
                          act.action === 'stage_changed' ? `Stage: ${act.metadata?.new_stage?.replace('_', ' ')}` :
                            act.action}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <MessageSquare className="w-3.5 h-3.5 text-muted-foreground mr-1.5" />
                        {format(new Date(act.created_at), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
