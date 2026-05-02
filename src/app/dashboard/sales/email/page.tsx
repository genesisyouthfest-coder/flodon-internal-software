'use client'

import { useState, useEffect } from 'react'
import { saveSmtpConnection, getSmtpConnection } from './actions'
import { toast } from 'sonner'

export default function EmailLinkingPage() {
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [currentConnection, setCurrentConnection] = useState<any>(null)
  const [fetching, setFetching] = useState(true)

  const [formData, setFormData] = useState({
    host: '',
    port: '',
    user: '',
    password: '',
    displayName: ''
  })

  useEffect(() => {
    async function checkConnection() {
       const connection = await getSmtpConnection()
       if (connection) {
         setCurrentConnection(connection)
         setFormData({
            host: connection.host || '',
            port: connection.port || '',
            user: connection.user || '',
            password: connection.password || '',
            displayName: connection.displayName || ''
         })
       }
       setFetching(false)
    }
    checkConnection()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleTest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setTesting(true)
    
    try {
      const res = await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smtpConfig: formData })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Connection Successful! Test email sent to your inbox.')
      } else {
        toast.error(`Connection Failed: ${data.error}`)
      }
    } catch (err) {
      toast.error('System error during test.')
    } finally {
      setTesting(false)
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    Object.entries(formData).forEach(([k, v]) => fd.append(k, v))
    const result = await saveSmtpConnection(fd)
    
    if (result.success) {
      toast.success('SMTP Configuration Saved Successfully.')
      setCurrentConnection(formData)
    } else {
      toast.error(`Save Failed: ${result.error}`)
    }
    setLoading(false)
  }

  if (fetching) {
     return (
        <div className="max-w-3xl space-y-12 animate-pulse">
           <div className="h-20 bg-foreground/10 border-2 border-foreground" />
           <div className="h-96 bg-foreground/5 border-2 border-foreground" />
        </div>
     )
  }

  return (
    <div className="max-w-3xl space-y-12 animate-in fade-in duration-700">
      <div className="space-y-2 pb-6 border-b-2 border-foreground">
        <p className="text-xs font-bold tracking-widest text-foreground/60 uppercase">System Integration</p>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase">Link Communications</h1>
        <p className="text-sm font-semibold tracking-widest text-foreground/80 mt-2">Connect your SMTP server for direct outreach.</p>
      </div>

      <div className="grid grid-cols-1 gap-12">
        <section className="space-y-8">
           <div className="card-solid p-6 md:p-8 space-y-8">
              <form 
                id="smtp-form" 
                onSubmit={handleSave} 
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest">SMTP Host</label>
                      <input name="host" required placeholder="smtp.gmail.com" value={formData.host} onChange={handleInputChange} className="input-solid" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest">Port</label>
                      <input name="port" required placeholder="465" value={formData.port} onChange={handleInputChange} className="input-solid" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest">User Email</label>
                      <input name="user" required type="email" placeholder="agent@flodon.in" value={formData.user} onChange={handleInputChange} className="input-solid" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest">App Password</label>
                      <input name="password" required type="password" placeholder="•••• •••• •••• ••••" value={formData.password} onChange={handleInputChange} className="input-solid" />
                   </div>
                   <div className="space-y-2 md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest">Display Name (From)</label>
                      <input name="displayName" placeholder="Flodon Operations" value={formData.displayName} onChange={handleInputChange} className="input-solid" />
                   </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                   <button 
                     type="submit" 
                     disabled={loading}
                     className="btn-solid flex-1 h-14"
                   >
                      {loading ? 'Securing Connection...' : 'Save Configuration'}
                   </button>
                   <button 
                     type="button"
                     onClick={(e) => {
                        const form = document.getElementById('smtp-form') as HTMLFormElement
                        if (form.checkValidity()) {
                          // Simple way to trigger handleTest with current data
                          const event = new Event('submit', { cancelable: true }) as unknown as React.FormEvent<HTMLFormElement>
                          handleTest(event)
                        } else {
                          form.reportValidity()
                        }
                     }}
                     disabled={testing}
                     className="px-8 py-4 border-2 border-foreground font-black uppercase tracking-widest text-xs hover:bg-foreground hover:text-background transition-all h-14"
                   >
                      {testing ? 'Probing...' : 'Test Sync'}
                   </button>
                </div>
              </form>
           </div>

           <div className="p-6 border-l-4 border-foreground bg-foreground/5 space-y-4">
              <p className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                 <span className="h-2 w-2 bg-foreground rounded-full" />
                 SECURITY ADVISORY
              </p>
              <p className="text-[11px] leading-relaxed font-medium opacity-70 uppercase tracking-tight">
                 For Gmail users, ensure 2FA is active and use a dedicated 16-character <strong>App Password</strong>. Direct account passwords will be rejected by the Google security grid.
              </p>
           </div>
        </section>

        {/* Interactive Provider Guide */}
        <section className="space-y-6 pt-6 border-t-2 border-foreground/10">
           <div className="flex items-end justify-between border-b-2 border-foreground pb-2">
              <h2 className="text-sm font-black uppercase tracking-[0.2em]">Integration Manual</h2>
           </div>
           
           <div className="card-solid p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                 <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest">Select Provider</label>
                    <select 
                      id="provider-select"
                      className="input-solid appearance-none bg-background uppercase font-bold text-xs cursor-pointer"
                    >
                       <option value="gmail">Google / Gmail</option>
                       <option value="outlook">Microsoft / Outlook</option>
                       <option value="icloud">Apple / iCloud</option>
                       <option value="other">Other SMTP</option>
                    </select>
                 </div>
                 <button 
                   type="button"
                   onClick={() => {
                      const p = (document.getElementById('provider-select') as HTMLSelectElement).value
                      const guides: any = {
                        gmail: `GMAIL INTEGRATION STEPS:\n1. Enable 2-Step Verification in Google Account Settings.\n2. Search for "App Passwords" in your Google Account security.\n3. Create a new app password named "Flodon CRM".\n4. Copy the 16-character code.\n5. Host: smtp.gmail.com | Port: 465`,
                        outlook: `OUTLOOK / HOTMAIL STEPS:\n1. Log into Microsoft Account Security.\n2. Enable Two-Step Verification.\n3. Create a "New App Password".\n4. Copy the password displayed.\n5. Host: smtp-mail.outlook.com | Port: 587`,
                        icloud: `ICLOUD MAIL STEPS:\n1. Go to appleid.apple.com.\n2. Security Section -> App-Specific Passwords.\n3. Generate Password labeled "Flodon".\n4. Copy the generated code.\n5. Host: smtp.mail.me.com | Port: 587`,
                        other: `GENERIC SMTP GUIDELINES:\n1. Identify your provider's SMTP host (e.g. smtp.yourdomain.com).\n2. Use Port 465 (SSL) or 587 (TLS).\n3. Ensure your App Password or Account Password is correct.\n4. Check if your provider requires SPF/DKIM records.`
                      }
                      const textBox = document.getElementById('guide-box')
                      if (textBox) {
                        textBox.innerText = guides[p] || ''
                        textBox.classList.remove('hidden')
                      }
                   }}
                   className="btn-solid px-8 h-12"
                 >
                    Guide Me &darr;
                 </button>
              </div>

              <div id="guide-box" className="hidden p-6 bg-foreground text-background font-mono text-[11px] leading-relaxed whitespace-pre-wrap border-l-8 border-foreground/30 animate-in slide-in-from-top duration-300">
                 {/* Guide text injected here */}
              </div>
           </div>
        </section>
      </div>
    </div>
  )
}
