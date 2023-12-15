"use client"
import { useState } from 'react'
import { Separator } from '../ui/separator'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useToast } from '../ui/use-toast'
import { usePathname } from 'next/navigation'
import { deleteOrg, updateOrg } from '@/actions/Organization'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog'
import AddMembers from '../Forms/AddMember'
import { Progress } from "@/components/ui/progress"

interface props {
  name: string,
  id: string,
  isAdmin: boolean;
  isSettings?: boolean
}
const WorkspaceHead = ({ name, id, isAdmin, isSettings }: props) => {
  const [isLoad, setIsLoad] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isProgress, setIsProgress] = useState(0)
  const [newName, setNewName] = useState(name)
  const { toast } = useToast()
  const pathname = usePathname()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (newName !== name && isAdmin === true) {
      try {
        setIsLoad(true)
        const data = await updateOrg(id, newName, pathname)
        if (data.success) {
          toast({ title: data.message })
        } else {
          toast({ title: data.message, variant: "destructive" })
        }
      } catch (error: any) {
        console.log(error.message)
        toast({
          title: "Server error try again later",
          variant: 'destructive'
        })
      } finally {
        setIsLoad(false)
      }
    }
  }

  const deleteWorspace = async () => {
    try {
      setIsProgress(30)
      setIsDeleting(true)
      const data = await deleteOrg(id)
      setIsProgress(75)
      if (data.success) {
        toast({ title: `${name} deleted successfully` })
      } else {
        toast({ title: data.message, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Server error try again later!', variant: "destructive" })
    } finally {
      setIsDeleting(false)
      setIsProgress(100)
    }
  }
  return (
    <div className='w-full'>
      <div className='flex gap-4 md:gap-6 flex-col lg:flex-row lg:justify-between lg:items-start'>
        <div className='flex gap-4 items-center '>
          <div className='w-12 h-12 cursor-pointer rounded-full bg-greenshade text-white text-xl font-bold tracking-wider grid place-items-center'>{name.slice(0, 1)}</div>
          <div className='grid '>
            <form onSubmit={handleSubmit} className=' w-20 md:w-auto flex items-center max-w-[150px]'>
              <input type='text' value={newName} disabled={!isAdmin} placeholder='Title..' className={`board-input ${isLoad ? 'text-gray-500' : 'text-black'} ${isAdmin && 'cursor-pointer'}`} onChange={(e) => { setNewName(e.target.value) }} />
            </form>

            <h4 className={`text-sm font-medium ${!isAdmin ? 'text-gray1' : 'text-greenshade'}`}>{isAdmin ? "#admin" : "#member"}</h4>
          </div>
        </div>
        {isAdmin === true && isSettings && (
          <div className='flex w-full lg:w-auto gap-2'>
            <Dialog>
              <DialogTrigger className='flex-1 lg:flex-none'>
                <div className='btn flex items-center gap-1 w-full md:px-3.5 py-2 justify-center' style={{ pointerEvents: isLoad ? 'none' : 'auto' }}>
                  <Plus width={20} height={20} className='cursor-pointer' color='#fff' />
                  <span className='text-white text-sm font-medium cursor-pointer'>Add Members</span>
                </div>
              </DialogTrigger>
              <DialogContent className=''>
                {/* <div className='h-full my-6 overflow-y-scroll custom-scrollbar'>
                </div> */}
                <AddMembers orgId={id} orgName={name} />
              </DialogContent>
            </Dialog>
            <AlertDialog>
              <AlertDialogTrigger asChild className='flex-1 lg:flex-auto' >
                <button className='btn w-full flex items-center justify-center gap-2 lg:gap-1.5 bg-red-500 py-2 hover:bg-red-500/70 md:px-3.5' disabled={isLoad}>
                  <Trash2 width={20} height={20} className='cursor-pointer' color='#fff' />
                  <span className='text-white text-sm font-medium cursor-pointer'>Delete</span>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className='text-sm text-left'>
                    This action cannot be undone. This will permanently delete this
                    workspace and remove all of his data from our servers.<br /><Separator className='my-2' />
                    <strong>NOTE:</strong> This action will take some time to delete all data please do not close this tab.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={deleteWorspace}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
      <Separator className='my-4 md:my-6' />
      {isDeleting && (
        <>
          <div className='fixed top-0 left-0 z-50 w-screen h-screen bg-black/80 flex flex-col justify-center items-center'>
            <div className='flex justify-center items-center gap-4 md:gap-6 mb-4 md:mb-6'>
              <Loader2 className='w-10 h-10 animate-spin text-slate-100' />
              <p className='text-slate-100 text-base font-semibold text-center'>Deleting {name}....</p>
            </div>
            <Progress className='w-full min-w-[280px] max-w-xs ' value={isProgress} />
          </div>
        </>
        
      )}
    </div>
  )
}

export default WorkspaceHead