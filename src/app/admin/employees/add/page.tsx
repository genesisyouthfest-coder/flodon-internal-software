'use client'

import { addEmployee } from '../actions'
import Link from 'next/link'
import { useState } from 'react'

export default function AddEmployeePage() {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(formData: FormData) {
    setPending(true)
    setError(null)
    const result = await addEmployee(formData)
    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
  }

  return (
    <div className="space-y-12 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2 pb-6 border-b-2 border-foreground">
        <div className="flex items-center gap-4">
          <Link href="/admin/employees" className="text-sm font-bold uppercase tracking-widest hover:underline">
            &larr; Back
          </Link>
          <p className="text-xs font-bold tracking-widest text-foreground/60 uppercase">Management</p>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase">Onboard Agent</h1>
        <p className="text-sm font-semibold tracking-widest text-foreground/80 mt-2">Create a new system profile for an employee.</p>
      </div>

      <form action={handleSubmit} className="space-y-10">
        {error && (
          <div className="bg-red-500 text-white p-4 font-bold uppercase tracking-widest text-xs border-2 border-foreground">
             Error: {error}
          </div>
        )}
        <div className="space-y-8">
           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest">Legal Full Name</label>
              <input name="full_name" required className="input-solid" placeholder="First Last" />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest">System Email</label>
              <input name="email" type="email" required className="input-solid" placeholder="employee@flodon.in" />
           </div>

           <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest">Department Access</label>
              <input name="departments" className="input-solid" placeholder="sales, marketing, operations" />
              <p className="text-[9px] font-medium uppercase tracking-tighter opacity-50 mt-2 italic">Comma separated values.</p>
           </div>
        </div>

        <div className="pt-8 flex justify-end">
          <button type="submit" className="btn-solid min-w-[200px]" disabled={pending}>
            {pending ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-current border-t-transparent animate-spin rounded-full" />
                Onboarding...
              </span>
            ) : 'Confirm Onboarding'}
          </button>
        </div>
      </form>
    </div>
  )
}
