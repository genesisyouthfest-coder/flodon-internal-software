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
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PlusCircle } from 'lucide-react'
import { createEmployee } from '@/app/admin/employees/actions'
import { toast } from 'sonner'

const DEPARTMENTS = ['Sales', 'Marketing', 'Operations', 'HR', 'Finance']

export function AddEmployeeModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedDepts, setSelectedDepts] = useState<string[]>([])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const result = await createEmployee({
      name,
      email,
      password,
      departments: selectedDepts
    })

    setLoading(false)

    if (result.success) {
      toast.success('Employee created successfully')
      setOpen(false)
      setSelectedDepts([])
    } else {
      toast.error(result.error || 'Failed to create employee')
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
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Add Employee</DialogTitle>
            <DialogDescription>
              Create a new employee account. They will be able to log in with these credentials.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="john@flodon.in" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label>Departments</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {DEPARTMENTS.map(dept => (
                  <div key={dept} className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={`dept-${dept}`}
                      checked={selectedDepts.includes(dept)}
                      onChange={() => toggleDept(dept)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor={`dept-${dept}`} className="font-normal">{dept}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Employee'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
