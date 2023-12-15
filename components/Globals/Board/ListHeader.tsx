"use client"

import { CopyList, deleteListFromBoard, updateListTitle } from "@/actions/List"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { PopoverClose } from "@radix-ui/react-popover"
import { Copy, CopyPlus, MoreHorizontal, PlusSquare, Trash2, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { FormEvent, useEffect, useRef, useState } from "react"

interface props {
  listTitle: string,
  id: string,
  boardId: string,
  orgId: string,
  cardOpen: any
}
const ListHeader = ({ listTitle, id, boardId, orgId, cardOpen }: props) => {
  const [isLoad, setIsLoad] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCoping, setIsCoping] = useState(false)
  const ref = useRef<HTMLButtonElement | null>(null);
  const [title, setTitle] = useState(listTitle)
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    setTitle(listTitle)
  }, [listTitle])
  
  const updataTitle = async (e: FormEvent) => {
    e.preventDefault()
    if (title !== listTitle && title.length > 2) {
      try {
        setIsLoad(true)
        const data = await updateListTitle(title, id, orgId, boardId, pathname)
        if (data.success) {
          toast({ title: data.message })
        } else {
          toast({ title: data.message, variant: "destructive" })
        }
      } catch (error) {
        toast({ title: "server error try again later", variant: "destructive" })
      } finally {
        setIsLoad(false)
      }
    }
  }
  const deleteList = async () => {
    try {
      setIsDeleting(true)
      const data = await deleteListFromBoard(id, orgId, boardId)
      if (data.success) {
        toast({ title: data.message })
        const buttonRef = ref.current as HTMLButtonElement | null;
        if (buttonRef) {
          buttonRef.click();
        }
      } else {
        toast({ title: data.message, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "server error try again later", variant: "destructive" })
    } finally {
      setIsDeleting(false)
    }
  }
  const copy = async () => {
    try {
      setIsCoping(true)
      const data = await CopyList(id, orgId, boardId)
      if (data.success) {
        toast({ title: data.message })
        const buttonRef = ref.current as HTMLButtonElement | null;
        if (buttonRef) {
          buttonRef.click();
        }
      } else {
        toast({ title: data.message, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "server error try again later", variant: "destructive" })
    } finally {
      setIsCoping(false)
    }
  }

  const openUpCard = () => {
    const buttonRef = ref.current as HTMLButtonElement | null;
    if (buttonRef) {
      buttonRef.click();
    }
    cardOpen(id)
  }
  return (
    <div className='flex items-start gap-4 justify-between'>
      <form className='max-w-min w-20 md:w-auto flex items-center' onSubmit={updataTitle}>
        <input type='text' value={title} disabled={isLoad} placeholder='title..' className={`focus:p-1 outline-2 outline-black bg-transparent max-w-[200px] md:max-w-[240px] rounded-sm cursor-pointer font-semibold ${isLoad ? 'text-gray-600' : 'text-black'} text-base placeholder:text-sm`} onChange={(e) => { setTitle(e.target.value) }} required minLength={3} />
      </form>
      <Popover>
        <PopoverTrigger>
          <MoreHorizontal width={24} height={24} className="cursor-pointer text-gray-700" />
        </PopoverTrigger>
        <PopoverContent>
          <div className="text-sm font-semibold text-center text-black pb-4">
            List actions
          </div>
          <PopoverClose asChild>
            <button ref={ref}
              className="h-auto w-auto p-2 absolute top-0 right-2 text-black border-0 outline-none bg-transparent">
              <X className="h-4 w-4" />
            </button>
          </PopoverClose>
          <div className="flex items-center gap-3 mb-4 hover:underline cursor-pointer" onClick={openUpCard}>
            <PlusSquare width={20} height={20} className="text-gray-800"/>
            <span className={`text-sm font-medium text-gray-800`} >Add card</span>
          </div>
          <div className="flex items-center gap-3 mb-4 hover:underline cursor-pointer" onClick={copy}>
            <Copy width={20} height={20} className={`${isCoping ? 'text-gray-500' : 'text-gray-800'}`} />
            <span className={`text-sm font-medium ${isCoping ? 'text-gray-500' : 'text-gray-800'}`} >Copy list</span>
          </div>
          <Separator className="mb-4 bg-gray-300" />
          <button className="flex cursor-pointer outline-none border-none bg-transparent items-center gap-2 hover:underline"
            disabled={isDeleting} onClick={deleteList} >
            <Trash2 width={20} height={20} className={`${isDeleting ? 'text-gray-600' : 'text-gray-800'}`} />
            <span className={`text-sm font-medium ${isDeleting ? 'text-gray-600' : 'text-gray-800'}`} >Delete this list</span>
          </button>
        </PopoverContent>
      </Popover>

    </div>
  )
}

export default ListHeader