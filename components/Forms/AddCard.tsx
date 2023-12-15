"use client"
import { Plus, X } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"
import { useToast } from "../ui/use-toast"
import { createCardInList } from "@/actions/Card"

interface props {
  boardId: string,
  orgId: string,
  listId: string,
  isOpen: boolean,
  cardOpen: any
}
const AddCard = ({ boardId, orgId, listId, isOpen, cardOpen }: props) => {

  const [isForm, setIsForm] = useState(isOpen)
  const [title, setTitle] = useState("")
  const [isLoad, setIsLoad] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    setIsForm(isOpen)
  }, [isOpen])
  

  const createCard = async (e: FormEvent) => {
    e.preventDefault()
    if (title && title.length > 2) {
      try {
        setIsLoad(true)
        const data = await createCardInList(orgId, boardId, listId, title)
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
        cardOpen('none')
      }
    }
  }
  return (
    <div className="w-full cursor-pointer">
      {!isForm ? (
        <div className="flex gap-2 items-center hover:underline z-50" onClick={() => setIsForm(true)}>
          <Plus width={20} height={20} className="text-gray-700" />
          <span className="font-medium text-base text-gray-700">Add a card</span>
        </div>
      ) : (
        <form className={`w-full grid gap-4 z-40`} onSubmit={createCard}>
          <input type="text" placeholder="Enter card title.." value={title} className={`input-2 w-full ${isLoad ? 'border-gray-600 text-gray-600' : 'border-black  text-black'} border-2`}
            onChange={(e) => setTitle(e.target.value)} required minLength={3} disabled={isLoad} />
          <div className="flex items-center gap-4">
            <button type="submit" className={`btn3 px-4 ${isLoad && 'bg-gray-600'}`} disabled={isLoad} >Save</button>
            <X className="cursor-pointer" width={24} height={24} color="#000" onClick={() => {setIsForm(false); cardOpen('none')}} />
          </div>
        </form>
      )}
    </div>
  )
}

export default AddCard