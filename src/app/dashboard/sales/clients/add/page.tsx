'use client'

import { addClient } from '../actions'
import Link from 'next/link'
import { SubmitButton } from '@/components/SubmitButton'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function AddClientPage() {
  const router = useRouter()

  async function handleAction(formData: FormData) {
    const result = await addClient(formData)
    if (result?.error) {
      toast.error(`REGISTRATION FAILURE: ${result.error}`)
    } else {
      toast.success('ENTITY REGISTERED IN SYSTEM GRID')
      router.push('/dashboard/sales/clients')
      router.refresh()
    }
  }

  return (
    <div className="space-y-12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2 pb-6 border-b-2 border-foreground">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/sales/clients" className="text-sm font-bold uppercase tracking-widest hover:underline">
            &larr; Back
          </Link>
          <p className="text-xs font-bold tracking-widest text-foreground/60 uppercase">Registry</p>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase">Add New Entity</h1>
        <p className="text-sm font-semibold tracking-widest text-foreground/80 mt-2">Initialize a new client record in the global database.</p>
      </div>

      <form action={handleAction} className="space-y-10 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Identity Section */}
          <div className="space-y-6 md:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b border-foreground/30 pb-2">01 Identity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Full Name</label>
                <input name="name" required className="input-solid" placeholder="Entity Name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Email Address</label>
                <input name="email" type="email" required className="input-solid" placeholder="name@company.com" />
              </div>
            </div>
          </div>

          {/* Business Section */}
          <div className="space-y-6 md:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b border-foreground/30 pb-2">02 Business Context</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Brand / Company</label>
                <input name="brand_name" className="input-solid" placeholder="Trade Name" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Industry</label>
                <input name="industry" className="input-solid" placeholder="e.g. E-commerce" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Target Service</label>
                <input name="service" required className="input-solid" placeholder="Service Module" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Role</label>
                <input name="role" className="input-solid" placeholder="Title/Position" />
              </div>
            </div>
          </div>

           {/* Contact Section */}
           <div className="space-y-6 md:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b border-foreground/30 pb-2">03 Connection Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Phone</label>
                <input name="phone" className="input-solid" placeholder="+00 0000 0000" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Country</label>
                <input name="country" className="input-solid" placeholder="Origin" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Instagram</label>
                <input name="ig_profile" className="input-solid" placeholder="@handle" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest">Facebook</label>
                <input name="fb_profile" className="input-solid" placeholder="URL" />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-6 md:col-span-2">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] border-b border-foreground/30 pb-2">04 Operational Notes</h2>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest">Lead Intelligence</label>
              <textarea name="notes" className="input-solid min-h-[120px] resize-none" placeholder="Initial findings..." />
            </div>
          </div>
        </div>

        <div className="pt-8 flex justify-end">
          <SubmitButton className="btn-solid min-w-[200px]">
            Execute Registration
          </SubmitButton>
        </div>
      </form>
    </div>
  )
}
