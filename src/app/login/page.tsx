'use client'

import { useState } from 'react'
import { login } from './actions'

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
    <div className="flex h-[100dvh] w-full antialiased overflow-hidden bg-background font-sans">
      {/* Left side: Visual Identity Grid (30%) */}
      <div className="hidden md:flex md:w-[30%] items-center justify-center relative bg-foreground/[0.02] border-r-2 border-foreground overflow-hidden h-full">
         {/* Brutalist Grid Background */}
         <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
              style={{ 
                backgroundImage: 'linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)',
                backgroundSize: '40px 40px' 
              }} />
         
          <div className="relative z-10 p-8 animate-in slide-in-from-left duration-1000">
            <div className="relative group">
              <img src="/icon_with_text.svg" alt="Flodon" className="logo-img max-w-[240px] drop-shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-transform duration-1000 group-hover:scale-105" />
            </div>
          </div>
       </div>

       {/* Right side: Form Panel (70%) */}
       <div className="w-full md:w-[70%] flex flex-col md:items-center md:justify-center p-4 sm:p-8 md:p-12 lg:p-16 h-screen overflow-y-auto md:overflow-hidden relative">
         <div className="w-full max-w-md mx-auto my-auto py-8 flex flex-col items-center justify-center space-y-8 animate-in slide-in-from-right duration-1000">
           
           {/* Mobile-only Branding - Top Relative */}
           <div className="md:hidden text-center mb-4">
             <img src="/icon_with_text.svg" alt="Flodon" className="logo-img h-8 mx-auto" />
             <p className="text-[7px] font-black tracking-[0.4em] text-muted-foreground uppercase opacity-60 mt-1">Security Terminal</p>
           </div>

          <div className="card-solid w-full p-6 sm:p-10 lg:p-12 relative min-h-[40vh] md:min-h-0 flex flex-col justify-center">
            <div className="space-y-2 mb-8 border-b-2 border-foreground pb-6">
              <h2 className="text-3xl font-black tracking-tighter uppercase leading-none">Sign In</h2>
              <p className="text-[9px] text-foreground/60 font-bold uppercase tracking-widest">
                System Access Protocol
              </p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-6 sm:space-y-8">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-foreground/40">Auth Identity</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="ID@FLODON.IN"
                  className="input-solid h-12"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" title="Password" className="block text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-foreground/40">Access Key</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  className="input-solid h-12"
                  required
                />
              </div>
              
              {error && (
                <div className="bg-red-500 text-white p-4 border-2 border-red-500 font-black text-[9px] uppercase tracking-[0.2em] text-center animate-shake">
                   {error}
                </div>
              )}
              
              <button type="submit" className="btn-solid w-full mt-4 h-14 text-[11px] sm:text-xs font-black uppercase tracking-[0.4em]" disabled={loading}>
                {loading ? 'AUTHENTICATING...' : 'LOGIN »'}
              </button>
            </form>
          </div>

          <div className="flex flex-col items-center md:items-start gap-2 sm:gap-3 opacity-40">
             <div className="h-0.5 w-8 sm:w-10 bg-foreground" />
             <p className="text-[7px] sm:text-[8px] text-foreground uppercase tracking-[0.5em] font-black">
               © 2026 Flodon
             </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .vertical-text {
          writing-mode: vertical-rl;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  )
}
