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
      // 1. Check for duplicate email server-side via Supabase query
      const { data: existing } = await supabase
        .from('clients')
        .select('id')
        .eq('email', email)
        .maybeSingle()

      if (existing) {
        toast.error('Duplicate client error', {
          description: 'A client with this email already exists in the system.'
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

      // 2. Insert client
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

      // 3. Log activity
      await supabase.from('activity_log').insert({
        user_id: user.id,
        action: 'client_added',
        entity_type: 'client',
        entity_id: client.id,
        metadata: { name, email }
      })

      toast.success('Client added successfully')
      
      // 4. Trigger welcome email (fire and forget or handle error)
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
      // reset form
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
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Client
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
            <DialogDescription>
              Enter the client details to add them to your pipeline and trigger a welcome email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brand_name">Brand Name</Label>
                <Input id="brand_name" name="brand_name" placeholder="Acme Inc." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" name="email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" placeholder="+1..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" name="industry" placeholder="SaaS, E-commerce..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="service">Requested Service</Label>
              <Select name="service" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai_automation">AI Automation</SelectItem>
                  <SelectItem value="outreach_systems">Outreach Systems</SelectItem>
                  <SelectItem value="sales_closing">Sales Closing</SelectItem>
                  <SelectItem value="content_strategy">Content Strategy</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Client
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
