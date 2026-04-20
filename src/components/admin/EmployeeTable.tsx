'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, UserCheck, UserMinus } from 'lucide-react'
import { format } from 'date-fns'
import { toggleEmployeeStatus, deleteEmployee } from '@/app/admin/employees/actions'
import { toast } from 'sonner'
import { EditEmployeeModal } from './EditEmployeeModal'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface EmployeeTableProps {
  employees: any[]
}

export function EmployeeTable({ employees }: EmployeeTableProps) {
  const [editingEmployee, setEditingEmployee] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [deletingEmployee, setDeletingEmployee] = useState<any>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    const result = await toggleEmployeeStatus(id, !currentStatus)
    if (result.success) {
      toast.success(`Employee ${currentStatus ? 'deactivated' : 'activated'}`)
    } else {
      toast.error(result.error || 'Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (!deletingEmployee) return
    const result = await deleteEmployee(deletingEmployee.id)
    if (result.success) {
      toast.success('Employee deleted completely')
      setDeleteOpen(false)
    } else {
      toast.error(result.error || 'Failed to delete employee')
    }
  }

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Departments</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((emp) => (
              <TableRow key={emp.id}>
                <TableCell className="font-medium">{emp.full_name}</TableCell>
                <TableCell>{emp.email}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {emp.departments?.map((dept: string) => (
                      <Badge key={dept} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {dept}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {emp.email === 'admin@flodon.in' ? (
                    <Badge variant="default">Admin</Badge>
                  ) : (
                    <Badge variant="outline">Employee</Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {format(new Date(emp.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge className="bg-success text-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded transition-all">Active</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setEditingEmployee(emp)
                        setModalOpen(true)
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setDeletingEmployee(emp)
                        setDeleteOpen(true)
                      }}
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingEmployee && (
        <EditEmployeeModal 
          employee={editingEmployee}
          open={modalOpen}
          setOpen={setModalOpen}
        />
      )}

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the employee account ({deletingEmployee?.full_name}) and remove their access to the CRM. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
