'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { updateUserPassword, deleteEmployee, toggleEmployeeActive } from '../actions'
import { createClient } from '@/utils/supabase/client'

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
  const [employee, setEmployee] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchEmployee() {
      const { data } = await supabase.from('profiles').select('*').eq('id', params.id).single()
      setEmployee(data)
      setLoading(false)
    }
    fetchEmployee()
  }, [params.id, supabase])

  async function handleToggleActive() {
    setError(null)
    const result = await toggleEmployeeActive(employee.id, employee.is_active ?? true)
    if (result?.error) {
      setError(result.error)
    } else {
      // Refresh local state
      setEmployee({ ...employee, is_active: !(employee.is_active ?? true) })
    }
  }

  async function handleUpdatePassword(formData: FormData) {
    setError(null)
    const newPass = formData.get('password') as string
    const result = await updateUserPassword(employee.id, newPass)
    if (result?.error) setError(result.error)
    else alert('Security Key Updated Successfully')
  }

  if (loading) return <div className="p-12 text-xs font-bold uppercase tracking-widest animate-pulse">Scanning Grid...</div>
  if (!employee) return <div className="p-12 text-xs font-bold uppercase tracking-widest text-red-500">Target Not Found</div>

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b-2 border-foreground">
        <div className="space-y-2">
          <div className="flex items-center gap-4 mb-4">
             <Link href="/admin/employees" className="text-xs font-bold uppercase tracking-widest hover:underline">&larr; Back to Directory</Link>
          </div>
          <p className="text-xs font-bold tracking-widest text-foreground/60 uppercase">Agent Profile</p>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">{employee.full_name}</h1>
          <p className="text-sm font-semibold tracking-widest text-foreground/80 mt-2 italic">{employee.email}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
           <button 
             onClick={handleToggleActive}
             className={`px-4 py-2 border-2 border-foreground text-[10px] font-black uppercase tracking-widest transition-colors ${employee.is_active === false ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}
           >
              {employee.is_active === false ? 'Reactivate Account' : 'Mark Inactive'}
           </button>
           <span className={`px-4 py-2 border-2 border-foreground text-[10px] font-black uppercase tracking-widest text-center ${employee.is_active === false ? 'bg-red-500 text-white' : 'bg-foreground text-background'}`}>
              {employee.is_admin ? 'Master Admin' : (employee.is_active === false ? 'Suspended Account' : 'Active Account')}
           </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-4 font-bold uppercase tracking-widest text-xs border-2 border-foreground">
           System Feedback: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Security / Password Panel */}
        <div className="card-solid p-6 md:p-8 space-y-8">
           <div className="space-y-2 border-b-2 border-foreground pb-4">
              <h2 className="text-xl font-bold uppercase tracking-tight">Security Access</h2>
              <p className="text-xs font-medium opacity-60 uppercase tracking-widest">Update credentials for this agent.</p>
           </div>

           <form action={handleUpdatePassword} className="space-y-6">
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest">New Security Key</label>
                 <input 
                   name="password" 
                   type="password" 
                   required 
                   className="input-solid" 
                   placeholder="Enter new password"
                 />
              </div>
              <button type="submit" className="btn-solid w-full">
                 Overwrite Password
              </button>
           </form>
        </div>

        {/* Permissions Panel */}
        <div className="card-solid p-8 space-y-8">
           <div className="space-y-2 border-b-2 border-foreground pb-4">
              <h2 className="text-xl font-bold uppercase tracking-tight">Module Permissions</h2>
              <p className="text-xs font-medium opacity-60 uppercase tracking-widest">Department access assignments.</p>
           </div>

           <div className="flex flex-wrap gap-3">
              {employee.departments?.length > 0 ? employee.departments.map((d: string) => (
                <span key={d} className="px-3 py-1.5 border-2 border-foreground text-xs font-black uppercase tracking-tight">
                   {d}
                </span>
              )) : (
                <p className="text-xs font-bold uppercase opacity-30">No departments assigned.</p>
              )}
           </div>

           <p className="text-[9px] font-medium uppercase tracking-widest opacity-50 italic">
              Permissions are audited and logs are kept of all changes.
           </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-2 border-red-500 bg-red-500/5 p-6 md:p-8 space-y-6">
         <div className="space-y-1">
            <h2 className="text-xl font-bold uppercase tracking-tight text-red-500">Danger Zone</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-red-500/60">Permanent System Deletion</p>
         </div>

         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <p className="text-xs font-bold uppercase tracking-tight max-w-md opacity-80">
               Terminating this agent's account will remove all module access and delete their system record permanently. This action is immediate.
            </p>
            <button 
              onClick={async () => {
                const confirmed = confirm('PERMANENT DELETION: Are you sure?')
                if (confirmed) {
                  const res = await deleteEmployee(employee.id)
                  if (res?.error) setError(res.error)
                }
              }}
              className="px-8 py-3 bg-red-500 text-white font-black uppercase tracking-widest text-xs hover:bg-black transition-colors border-2 border-red-500"
            >
               Delete Agent Permanently
            </button>
         </div>
      </div>
    </div>
  )
}
