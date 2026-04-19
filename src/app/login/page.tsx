'use client'

import { useState } from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const res = await login(formData)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center px-4 bg-background selection:bg-white selection:text-black antialiased">
      <div className="w-full max-w-sm space-y-12 animate-in fade-in duration-700">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none">Flodon</h1>
          <p className="text-[10px] font-bold tracking-[0.3em] text-muted-foreground uppercase opacity-80">Internal System Access</p>
        </div>
        
        <Card className="border-border/60 bg-secondary/20 rounded-xl overflow-hidden">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl font-bold tracking-tight">Sign In</CardTitle>
            <CardDescription className="text-xs text-muted-foreground/80 font-medium">
              Enter your credentials to manage your workflows.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit} className="grid gap-6">
              <div className="grid gap-2.5">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 ml-0.5">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@flodon.in"
                  className="h-10 border-border/50 focus-visible:border-white/40"
                  required
                />
              </div>
              <div className="grid gap-2.5">
                <Label htmlFor="password" title="Password" className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted-foreground/70 ml-0.5">Security Key</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  className="h-10 border-border/50 focus-visible:border-white/40"
                  required
                />
              </div>
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-md">
                   <p className="text-[10px] text-destructive font-bold uppercase tracking-wider leading-relaxed text-center">{error}</p>
                </div>
              )}
              <Button type="submit" className="w-full h-11 font-bold uppercase tracking-[0.2em] text-[11px] mt-2 bg-white text-black hover:bg-white/90 rounded-md transition-all active:scale-[0.98]" disabled={loading}>
                {loading ? 'Verifying Identity...' : 'Authenticate'}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <div className="flex flex-col items-center gap-4">
           <div className="h-px w-12 bg-border/50" />
           <p className="text-[9px] text-muted-foreground/40 uppercase tracking-[0.2em] font-medium">
             © 2025 Flodon · Secure Layer · Global
           </p>
        </div>
      </div>
    </div>
  )
}
