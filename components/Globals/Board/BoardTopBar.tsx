"use client"
import { Loader2, MoreHorizontal, Trash2, X } from 'lucide-react'
import React, { FormEvent, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import { PopoverClose } from '@radix-ui/react-popover'
import { deleteBoardInOrg, updateBoardTitle } from '@/actions/Board'
import { usePathname, useRouter } from 'next/navigation'
import { useToast } from '../../ui/use-toast'
import { Separator } from '@/components/ui/separator'
interface props {
    boardId: string,
    boardTitle: string,
    isAdmin: boolean,
    orgId: string
}
const BoardTopBar = ({ boardId, boardTitle, orgId, isAdmin }: props) => {
    const [isLoad, setIsLoad] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [title, setTitle] = useState(boardTitle)
    const pathname = usePathname()
    const { toast } = useToast()
    const router = useRouter()

    const changeTitle = async (e: FormEvent) => {
        e.preventDefault()
        if (isAdmin && title !== boardTitle) {
            try {
                setIsLoad(true)
                const data = await updateBoardTitle(orgId, boardId, title, pathname)
                if (data.success) {
                    toast({ title: data.message })
                } else {
                    toast({ title: data.message, variant: 'destructive' })
                }
            } catch (error) {
                toast({ title: "Server error try again later!", variant: 'destructive' })
            } finally {
                setIsLoad(false)
            }
        }
    }
    const deleteBoard = async () => {
        if (isAdmin) {
            try {
                setIsDeleting(true)
                const data = await deleteBoardInOrg(orgId, boardId)
                if (data.success) {
                    toast({ title: data.message })
                    router.replace(`/app/workspaces/${orgId}`)
                } else {
                    toast({ title: data.message, variant: 'destructive' })
                }
            } catch (error) {
                toast({ title: "Server error try again later!", variant: 'destructive' })
            } finally {
                setIsDeleting(false)
            }
        }
    }

    return (
        <div className='w-full h-16 z-[40] bg-black/50 fixed top-14 flex justify-between items-center px-4 md:px-6 gap-x-4'>
            <div className='flex items-center gap-4'>
                <div className='grid w-7 h-7 md:w-9 md:h-9 font-semibold text-base md:text-xl place-items-center rounded-full bg-greenshade2 text-white'>{boardTitle.slice(0, 1)}</div>
                <form onSubmit={changeTitle} className='max-w-min w-20 md:w-auto flex items-center'>
                    <input type='text' value={title} disabled={!isAdmin || isLoad} placeholder='Title..' className={`board-input ${isLoad ? 'text-gray-400' : 'text-slate-100'} ${isAdmin && 'cursor-pointer'}`} onChange={(e) => { setTitle(e.target.value) }} required minLength={3} />
                </form>
            </div>
            {isAdmin && (
                <Popover>
                    <PopoverTrigger >
                        <div className='px-2 py-1 rounded-md cursor-pointer hover:bg-white/10'>
                            <MoreHorizontal width={24} height={24} className='cursor-pointer' color='#B2C8BA' />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className="mr-2" side="bottom" align="start">
                        <div className="text-sm font-semibold text-center text-black pb-4">
                            Board actions
                        </div>
                        <PopoverClose asChild>
                            <button
                                className="h-auto w-auto p-2 absolute top-0 right-2 text-black border-0 outline-none bg-transparent">
                                <X className="h-4 w-4" />
                            </button>
                        </PopoverClose>
                        <Separator className="mb-4 bg-gray-300" />
                        <button className="flex cursor-pointer outline-none hover:underline border-none bg-transparent items-center gap-2" disabled={isDeleting} onClick={deleteBoard}>
                            {isDeleting ? (
                                <Loader2 width={20} height={20} className='text-gray-500 animate-spin' />
                            ): (
                                <Trash2 width={20} height={20} className={`text-gray-800`} />
                            )}
                            <span className={`text-sm font-medium ${isDeleting ? 'text-gray-500': 'text-gray-800'}`} >
                                {isDeleting ? 'Deleting...' : 'Delete this board'}
                            </span>
                        </button>
                    </PopoverContent>
                </Popover >
            )}
        </div >
    )
}

export default BoardTopBar