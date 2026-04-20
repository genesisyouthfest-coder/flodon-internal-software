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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateEmployee } from '@/app/admin/employees/actions'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'

const DEPARTMENTS = ['Sales', 'Marketing', 'Operations', 'HR', 'Finance']

interface EditEmployeeModalProps {
  employee: {
    id: string
    full_name: string
    email: string
    departments: string[]
  }
  open: boolean
  setOpen: (open: boolean) => void
}

export function EditEmployeeModal({ employee, open, setOpen }: EditEmployeeModalProps) {
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState(employee.full_name || '')
  const [email, setEmail] = useState(employee.email || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedDepts, setSelectedDepts] = useState<string[]>(employee.departments || [])

  async function onUpdate() {
    if (!name || !email) {
      toast.error('Name and email are required')
      return
    }

    setLoading(true)
    const result = await updateEmployee(employee.id, {
      name,
      email,
      password: password || undefined,
      departments: selectedDepts
    })
    setLoading(false)

    if (result.success) {
      toast.success('Employee details updated')
      setOpen(false)
    } else {
      toast.error(result.error || 'Failed to update employee')
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
          <DialogTitle>Edit Employee Details</DialogTitle>
          <DialogDescription>
            Update full information for {employee.full_name}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="john@flodon.in" />
          </div>
          <div className="space-y-2">
            <Label>New Password (Optional)</Label>
            <div className="relative">
              <Input 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Leave blank to keep current" 
              />
              <Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
              </Button>
            </div>
          </div>
          <div className="space-y-2 mt-2">
            <Label>Departments</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
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
