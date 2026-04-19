'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { updateDepartments } from '@/app/admin/employees/actions'
import { toast } from 'sonner'

const DEPARTMENTS = ['Sales', 'Marketing', 'Operations', 'HR', 'Finance']

interface EditDeptModalProps {
  employee: {
    id: string
    name: string
    departments: string[]
  }
  open: boolean
  setOpen: (open: boolean) => void
}

export function EditDeptModal({ employee, open, setOpen }: EditDeptModalProps) {
  const [loading, setLoading] = useState(false)
  const [selectedDepts, setSelectedDepts] = useState<string[]>(employee.departments || [])

  async function onUpdate() {
    setLoading(true)
    const result = await updateDepartments(employee.id, selectedDepts)
    setLoading(false)

    if (result.success) {
      toast.success('Departments updated')
      setOpen(false)
    } else {
      toast.error(result.error || 'Failed to update')
    }
  }

  const toggleDept = (dept: string) => {
    setSelectedDepts(prev => 
      prev.includes(dept) 
        ? prev.filter(d => d !== dept) 
        : [...prev, dept]
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Departments</DialogTitle>
          <DialogDescription>
            Update departments for {employee.name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-2 mt-2">
            {DEPARTMENTS.map(dept => (
              <div key={dept} className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id={`edit-dept-${dept}`}
                  checked={selectedDepts.includes(dept)}
                  onChange={() => toggleDept(dept)}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor={`edit-dept-${dept}`} className="font-normal">{dept}</Label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onUpdate} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
