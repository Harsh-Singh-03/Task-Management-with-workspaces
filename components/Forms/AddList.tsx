"use client"
import { createListInBoard } from "@/actions/List"
import { Plus, X } from "lucide-react"
import { FormEvent, useState } from "react"
import { useToast } from "../ui/use-toast"
import { usePathname } from "next/navigation"

interface props {
  boardId: string,
  orgId: string
}
const AddList = ({ boardId, orgId }: props) => {

  const [isForm, setIsForm] = useState(false)
  const [title, setTitle] = useState("")
  const [isLoad, setIsLoad] = useState(false)
  const { toast } = useToast()
  const pathname = usePathname()

  const createList = async (e: FormEvent) => {
    e.preventDefault()
    if (title && title.length > 2) {
      try {
        setIsLoad(true)
        const data = await createListInBoard(orgId, boardId, title, pathname)
        if (data.success) {
           toast({title: data.message})
           setTitle("")
           setIsForm(false)
        } else {
          toast({title: data.message, variant: "destructive"})
        }
      } catch (error) {
        toast({title: "server error try again later", variant: "destructive"})
      } finally{
        setIsLoad(false)
      }
    }
  }
  return (
    <div className="w-full fixed bottom-5 md:bottom-8 left-4 md:left-6 ">
      <div className="card cursor-pointer min-w-[280px] max-w-[280px] md:min-w-[320px]">
        {!isForm ? (
          <div className="flex gap-2 items-center hover:underline" onClick={() => setIsForm(true)}>
            <Plus width={20} height={20} color="#000" />
            <span className="font-medium text-base">Add a list</span>
          </div>
        ) : (
          <form className={`w-full grid gap-4`} onSubmit={createList}>
            <input type="text" placeholder="Enter list title.." value={title} className={`input-2 w-full border-2 ${isLoad ? 'border-gray-600 text-gray-600' : 'border-black  text-black'}`}
              onChange={(e) => setTitle(e.target.value)} required minLength={3} disabled={isLoad} />
            <div className="flex items-center gap-4">
              <button type="submit" className={`btn3 px-4 ${isLoad && 'bg-gray-600'}`} disabled={isLoad} >Save</button>
              <X className="cursor-pointer" width={24} height={24} color="#000" onClick={() => setIsForm(false)} />
            </div>
          </form>
        )}
      </div>
      
    </div>
  )
}

export default AddList