'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { deleteClient } from '../actions'
import { toast } from 'sonner'

export default function DeleteClientButton({ clientId }: { clientId: string }) {
  const [isArmed, setIsArmed] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isArmed) {
      timer = setTimeout(() => {
        setIsArmed(false)
        console.log('DESTRUCTION SYSTEM DISARMED (TIMEOUT)')
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [isArmed])

  const handleInteraction = async () => {
    if (!isArmed) {
      setIsArmed(true)
      console.log('DESTRUCTION SYSTEM ARMED - AWAITING SECOND TRIGGER')
      return
    }

    // System is Armed, Execute Deletion
    console.log('DESTRUCTION SEQUENCE TRIGGERED - EXECUTING DATA WIPE')
    setIsDeleting(true)
    
    try {
      const result = await deleteClient(clientId)
      console.log('DESTRUCTION RESULT:', result)
      
      if (result?.success) {
        toast.success('RECORD DESTROYED SUCCESSFULLY')
        router.push('/dashboard/sales/clients')
      } else {
        const errMsg = result?.error || 'Unknown System Error'
        toast.error(`DESTRUCTION FAILED: ${errMsg}`)
        console.error('SYSTEM ERROR DURING DELETION:', errMsg)
        setIsDeleting(false)
        setIsArmed(false)
      }
    } catch (err) {
      console.error('CRITICAL ENGINE FAILURE DURING DELETION:', err)
      toast.error('CRITICAL ENGINE FAILURE')
      setIsDeleting(false)
      setIsArmed(false)
    }
  }

  return (
    <div className="space-y-4">
      <button 
        disabled={isDeleting}
        onClick={handleInteraction}
        className={`w-full py-4 border-2 transition-all text-[10px] font-black uppercase tracking-[0.3em] outline-none ${
          isDeleting 
            ? 'bg-muted text-muted-foreground border-muted animate-pulse' 
            : isArmed 
              ? 'bg-red-500 text-white border-red-500 scale-[1.02] shadow-[0_0_20px_rgba(239,68,68,0.4)]' 
              : 'bg-transparent text-red-500 border-red-500 hover:bg-red-500/5'
        }`}
      >
        {isDeleting 
          ? 'DATA WIPE IN PROGRESS...' 
          : isArmed 
            ? 'CONFIRM PERMANENT DESTRUCTION' 
            : 'DELETE LEAD FOREVER'}
      </button>
      
      {isArmed && !isDeleting && (
        <p className="text-[8px] font-black text-red-500 uppercase tracking-widest text-center animate-pulse">
          Security Lock Disengaged. Re-trigger within 3s to execute.
        </p>
      )}
    </div>
  )
}
