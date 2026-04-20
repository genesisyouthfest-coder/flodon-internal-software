'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/utils/supabase/client'

export function AddClientModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const name = formData.get('name') as string
    const brand_name = formData.get('brand_name') as string
    const service = formData.get('service') as string
    const phone = formData.get('phone') as string
    const industry = formData.get('industry') as string

    try {
      const { data: existing } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      if (existing) {
        toast.error('Duplicate client error', {
          description: 'A client with this email already exists.'
        })
        setLoading(false)
        return
      }

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      const { data: client, error: insertError } = await supabase
        .from('clients')
        .insert({
          name,
          brand_name,
          email,
          service,
          phone,
          industry,
          added_by: user.id,
          added_by_name: profile?.full_name || user.email,
          pipeline_stage: 'lead'
        })
        .select()
        .single()

      if (insertError) throw insertError

      await supabase.from('activity_log').insert({
        user_id: user.id,
        action: 'client_added',
        entity_type: 'client',
        entity_id: client.id,
        metadata: { name, email }
      })

      toast.success('Client added successfully')
      
      fetch('/api/email/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          clientName: name,
          clientEmail: email,
          brandName: brand_name,
          service: service,
          employeeName: profile?.full_name || 'Your Account Manager'
        })
      }).catch(err => console.error('Failed to trigger welcome email', err))

      setOpen(false)
      ;(e.target as HTMLFormElement).reset()
    } catch (error: any) {
      console.error(error)
      toast.error('Failed to add client', {
        description: error.message
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 px-6 text-xs font-bold uppercase tracking-widest rounded-md">
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-border/50">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="pb-4">
            <p className="text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">New Portfolio Entry</p>
            <DialogTitle className="text-3xl font-extrabold tracking-tighter uppercase leading-none">Add Client</DialogTitle>
            <DialogDescription className="text-sm font-medium text-muted-foreground mt-2">
              Onboard a new lead to your pipeline and trigger automated outreach.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-6 border-y border-border/50">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required className="bg-background border-border/50" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="brand_name" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Company Name</Label>
                <Input id="brand_name" name="brand_name" placeholder="Acme Inc." className="bg-background border-border/50" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required className="bg-background border-border/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number</Label>
                <Input id="phone" name="phone" placeholder="+1..." className="bg-background border-border/50" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="industry" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Market Industry</Label>
                <Input id="industry" name="industry" placeholder="SaaS, E-comm..." className="bg-background border-border/50" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="service" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Primary Service</Label>
              <Select name="service" required>
                <SelectTrigger className="bg-background border-border/50">
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  <SelectItem value="ai_automation">AI Automation</SelectItem>
                  <SelectItem value="outreach_systems">Outreach Systems</SelectItem>
                  <SelectItem value="sales_closing">Sales Closing</SelectItem>
                  <SelectItem value="content_strategy">Content Strategy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="pt-6 gap-3">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="text-[10px] uppercase font-bold tracking-widest px-6">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="px-8 text-xs font-bold uppercase tracking-widest">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Onboard Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
