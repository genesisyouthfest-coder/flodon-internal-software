'use client'

import { useState, useCallback, useEffect } from 'react'
import debounce from 'lodash.debounce'
import { updateClientNotes } from '../actions'
import { toast } from 'sonner'

interface NotesEditorProps {
  clientId: string
  initialNotes: string | null
}

export default function NotesEditor({ clientId, initialNotes }: NotesEditorProps) {
  const [notes, setNotes] = useState(initialNotes || '')
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(async (newNotes: string) => {
      setIsSaving(true)
      const result = await updateClientNotes(clientId, newNotes)
      if (result.success) {
        setHasUnsavedChanges(false)
      } else {
        toast.error('Failed to auto-sync notes')
      }
      setIsSaving(false)
    }, 1000),
    [clientId]
  )

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setNotes(val)
    setHasUnsavedChanges(true)
    debouncedSave(val)
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b-2 border-foreground pb-2">
        <h2 className="text-sm font-black uppercase tracking-[0.2em]">Intelligence & Notes</h2>
        <div className="flex items-center gap-3">
          {isSaving ? (
            <span className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-foreground/40 animate-pulse">
               <span className="h-1.5 w-1.5 bg-foreground rounded-full animate-bounce" />
               Syncing
            </span>
          ) : hasUnsavedChanges ? (
            <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/60 italic">Unsaved Changes</span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-widest text-green-500 flex items-center gap-1">
               <span className="h-1.5 w-1.5 bg-green-500 rounded-full" />
               Live
            </span>
          )}
        </div>
      </div>
      
      <div className="relative group">
        <textarea
          value={notes}
          onChange={handleChange}
          placeholder="Enter intelligence data, pain points, or session notes..."
          className="w-full min-h-[300px] p-4 md:p-8 bg-background border-2 border-foreground font-medium leading-relaxed italic placeholder:opacity-30 focus:outline-none focus:ring-0 transition-all resize-none card-solid"
        />
        <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
           <p className="text-[10px] font-black uppercase tracking-widest opacity-30">Auto-Sync Enabled</p>
        </div>
      </div>
    </section>
  )
}
