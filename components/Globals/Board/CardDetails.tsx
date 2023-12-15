"use client"

import { CopyCard, deleteCardFromList, updateCardDesc, updateCardLabel, updateCardTitle } from "@/actions/Card"
import { DialogClose } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Copy, Layout, Text, Trash, X } from "lucide-react"
import { useParams } from "next/navigation"
import { FormEvent, useEffect, useRef, useState } from "react"
import CardActivity from "./CardActivity"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { PopoverClose } from "@radix-ui/react-popover"
import { getContrastTextColor } from "@/lib/utils"

interface props {
  listId: string,
  data: any,
  listTitle: string
}
const CardDetails = ({ data, listId, listTitle }: props) => {
  const [title, setTitle] = useState(data.title)
  const [Desc, setDesc] = useState(data.description || "")
  const [isLoad, setIsLoad] = useState({ title: false, desc: false, delete: false, copy: false })
  const [isLabelLoad, setIsLabelLoad] = useState(false)
  const [isDescEdit, setIsDescEdit] = useState(false)
  const [labelData, setLabelData] = useState({ label: "", labelColor: '' })
  const { orgId, boardId } = useParams()
  const { toast } = useToast()
  const ref = useRef<HTMLButtonElement | null>(null);
  const ref2 = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    setDesc(data.description || '')
    setTitle(title)
  }, [data])

  // Title update
  const updataTitle = async (e: FormEvent) => {
    e.preventDefault()
    if (title !== data.title && title.length > 2) {
      try {
        setIsLoad({ title: true, desc: false, delete: false, copy: false })
        const result = await updateCardTitle(title, data.id, listId, boardId as string, orgId as string)
        if (result.success) {
          toast({ title: result.message })
        } else {
          toast({ title: result.message, variant: "destructive" })
        }
      } catch (error) {
        toast({ title: "server error try again later", variant: "destructive" })
      } finally {
        setIsLoad({ title: false, desc: false, delete: false, copy: false })
        setIsDescEdit(false)
      }
    }
  }
  // Description update
  const updataDesc = async (e: FormEvent) => {
    e.preventDefault()
    if (Desc !== data.description && Desc.length > 8) {
      try {
        setIsLoad({ title: false, desc: true, delete: false, copy: false })
        const result = await updateCardDesc(Desc, data.id, listId, boardId as string, orgId as string)
        if (result.success) {
          toast({ title: result.message })
        } else {
          toast({ title: result.message, variant: "destructive" })
        }
      } catch (error) {
        toast({ title: "server error try again later", variant: "destructive" })
      } finally {
        setIsLoad({ title: false, desc: false, delete: false, copy: false })
      }
    }
  }
  //  Delete card
  const deleteCard = async () => {
    try {
      setIsLoad({ title: false, desc: false, delete: true, copy: false })
      const result = await deleteCardFromList(data.id, listId, boardId as string, orgId as string,)
      if (result.success) {
        toast({ title: result.message })
        const buttonRef = ref.current as HTMLButtonElement | null;
        if (buttonRef) {
          buttonRef.click();
        }
      } else {
        toast({ title: result.message, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "server error try again later", variant: "destructive" })
    } finally {
      setIsLoad({ title: false, desc: false, delete: false, copy: false })
    }
  }
  // Copy Card
  const copyCard = async () => {
    try {
      setIsLoad({ title: false, desc: false, delete: false, copy: true })
      const result = await CopyCard(data.id, listId, boardId as string, orgId as string,)
      if (result.success) {
        toast({ title: result.message })
        const buttonRef = ref.current as HTMLButtonElement | null;
        if (buttonRef) {
          buttonRef.click();
        }
      } else {
        toast({ title: result.message, variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "server error try again later", variant: "destructive" })
    } finally {
      setIsLoad({ title: false, desc: false, delete: false, copy: false })
    }
  }
  // updata label
  const updateLabel = async (e: FormEvent) =>{
    e.preventDefault()
    if(labelData.label && labelData.labelColor){
      try {
        setIsLabelLoad(true)
        const result = await updateCardLabel(labelData.label, labelData.labelColor ,data.id, listId, boardId as string, orgId as string,)
        if (result.success) {
          toast({ title: result.message })
          const buttonRef = ref2.current as HTMLButtonElement | null;
          if (buttonRef) {
            buttonRef.click();
          }
        } else {
          toast({ title: result.message, variant: "destructive" })
        }
      } catch (error) {
        toast({ title: "server error try again later", variant: "destructive" })
      } finally {
        setIsLabelLoad(false)
      }
    }
  }

  return (
    <div className="w-full custom-max-height overflow-y-scroll">
      {/* Card Header */}
      <div className="flex items-start gap-x-3 mb-6 w-full">
        <Layout className="h-5 w-5 mt-1 text-gray-800" />
        <div className="w-full flex justify-between items-center">
          <form className='w-min md:w-auto' onSubmit={updataTitle}>
            <input type='text' value={title} disabled={isLoad.title} placeholder='Enter card title..' className={`bg-transparent max-w-[180px] md:max-w-[240px] outline-none rounded-sm cursor-pointer font-semibold ${isLoad.title ? 'text-gray-600' : 'text-black'} text-lg md:text-xl placeholder:text-base placeholder:font-medium`} onChange={(e) => { setTitle(e.target.value) }} required minLength={3} />
            <p className="text-sm tracking-wide text-muted-foreground">
              in list <span className="underline">{listTitle}</span>
            </p>
          </form>
          <Popover>
            <PopoverTrigger>
              <span className={`text-sm font-medium px-3 py-1 mr-2 cursor-pointer rounded-sm`} style={{ color: getContrastTextColor(data.labelColor), background: data.labelColor || "#000"}}>{data.label || 'Add label'}</span>
            </PopoverTrigger>
            <PopoverContent>
              <div className="text-sm font-semibold text-center text-black mb-2">
                Change label
              </div>
              <PopoverClose asChild>
                <button ref={ref2}
                  className="h-auto w-auto p-2 absolute top-0 right-2 text-black border-0 outline-none bg-transparent">
                  <X className="h-4 w-4" />
                </button>
              </PopoverClose>
              <form className="grid gap-3" onSubmit={updateLabel}>
                <input type="text" className="form-input py-1 placeholder:text-sm text-sm" placeholder="Enter label title.." required minLength={3} onChange={(e) => setLabelData({ label: e.target.value, labelColor: labelData.labelColor })} disabled={isLabelLoad} />
                <div className="flex gap-3 items-center">
                  <span className="text-sm font-medium text-gray-700">Choose color:</span>
                  <input type="color" className="rounded cursor-pointer" required disabled={isLabelLoad}
                    onChange={(e) => setLabelData({ label: labelData.label, labelColor: e.target.value })} />
                </div>
                <button type="submit" className={`btn3 w-full ${isLabelLoad && 'bg-gray-500 text-gray-800'}`} disabled={isLabelLoad} >Save</button>
              </form>
            </PopoverContent>
          </Popover>
        </div>

      </div>
      {/* Card Body */}
      <div className="flex flex-col md:flex-row gap-3 w-full items-start">
        {/* Description Form */}
        <div className="flex-1 w-full">
          <div className="flex items-center gap-3">
            <Text className="h-5 w-5 text-gray-800" />
            <h4 className="text-base md:text-lg text-black font-medium">Description</h4>
          </div>
          <form className="mt-2 ml-8" onSubmit={updataDesc}>
            <textarea placeholder="Add more details.." rows={3} value={Desc} onChange={(e) => { setDesc(e.target.value); setIsDescEdit(true) }} className={`w-full bg-gray-100 ${isLoad.desc ? 'text-gray-600' : 'text-black'} border-none outline-none text-base font-medium placeholder:text-gray-800 rounded py-2 px-3`} required minLength={8} disabled={isLoad.desc} />
            {isDescEdit && data.description !== Desc && (
              <button type="submit" className={`${isLoad.desc ? 'bg-gray-600' : 'bg-black'} btn3 px-4 mt-2`} >Save</button>
            )}
          </form>
        </div>
        {/* Action Buttons */}
        <div className="flex items-start gap-2 flex-col w-full md:w-auto">
          <h4 className="text-base md:text-lg text-black font-medium">Action</h4>
          <div className="w-full flex md:grid md:w-auto gap-3 md:gap-2">
            <button className="flex-1 md:flex-none flex gap-2 md:min-w-[160px] bg-gray-100 hover:bg-gray-100/80 items-center px-4 py-2.5 rounded" disabled={isLoad.copy} onClick={copyCard}>
              <Copy className={`${isLoad.copy ? 'text-gray-500' : 'text-black'} w-4 h-4`} />
              <span className={`${isLoad.copy ? 'text-gray-500' : 'text-black'} font-medium text-sm`}>Copy</span>
            </button>
            <button className="flex-1 md:flex-none flex gap-2 md:min-w-[160px] bg-gray-100 hover:bg-gray-100/80 items-center px-4 py-2.5 rounded" onClick={deleteCard} disabled={isLoad.delete}>
              <Trash className={`${isLoad.delete ? 'text-gray-500' : 'text-black'} w-4 h-4`} />
              <span className={`${isLoad.delete ? 'text-gray-500' : 'text-black'} font-medium text-sm`}>Delete</span>
            </button>

          </div>
        </div>
      </div>
      {/* Activity */}
      <CardActivity data={data} />
      {/* Dialog close */}
      <DialogClose asChild>
        <button ref={ref}
          className="hidden h-auto w-auto p-2 absolute top-0 right-2 text-black border-0 outline-none bg-transparent">
          <X className="h-4 w-4" />
        </button>
      </DialogClose>
    </div>
  )
}

export default CardDetails
