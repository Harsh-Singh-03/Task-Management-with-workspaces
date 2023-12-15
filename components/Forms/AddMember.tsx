"use client"

import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { DialogClose } from "../ui/dialog"
import { useToast } from "../ui/use-toast";
import { usePathname } from "next/navigation";
import { Loader2, Verified, X } from "lucide-react";
import { addMembersInOrg, verifyMember } from "@/actions/Organization";
interface props {
    orgName: string;
    orgId: string
}
const AddMembers = ({ orgName, orgId }: props) => {
    const ref = useRef<HTMLButtonElement | null>(null);
    const [Credential, setCredential] = useState({ email: "" })
    const [membersArray, setMembersArray] = useState<string[]>([])
    const [membersIdArray, setMembersIdArray] = useState<string[]>([])
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
    const [verifyColor, setVerifyColor] = useState("#fff")
    const pathname = usePathname()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCredential({ ...Credential, [e.target.name]: e.target.value })
        setVerifyColor('#fff')
    }

    const EmailVerify = async (e: FormEvent) => {
        e.preventDefault()
        if(verifyColor !== "#BB2124"){
            try {
                setIsLoading(true)
                if(membersArray.includes(Credential.email)){
                    toast({title: 'Email already selected try different email!'})
                    setVerifyColor('#BB2124')
                    return
                }
                const data = await verifyMember(orgId, Credential.email)
                if(data.success === true && data.id){
                    setVerifyColor('#4BB543')
                    toast({title: data.message})
                    setMembersArray(prevMembersArray => [...prevMembersArray, Credential.email]);
                    setMembersIdArray(prevMembersIdArray => [...prevMembersIdArray, data.id]);
                    setCredential({email: ''})
                }
                if(data.success === false){
                    setVerifyColor("#BB2124")
                    toast({title: data.message, variant: "destructive"})
                }
            } catch (error) {
                setVerifyColor("#BB2124")
                toast({title: 'Some error occure while checking email try again!', variant: "destructive"})
            }finally{
                setIsLoading(false)
            }
        }
    }

    const remove = (email: string, id: string) =>{
        setMembersArray(prevMembersArray => prevMembersArray.filter(memberEmail => memberEmail !== email))
        setMembersIdArray(prevMembersIdArray => prevMembersIdArray.filter(id => id !== id))
    }

    const AddMembers = async() =>{
        try {
            setIsLoadingSubmit(true)
            setIsLoading(true)
            if(membersIdArray && membersIdArray.length > 0){
                const data = await addMembersInOrg(orgId, membersIdArray, pathname)
                if(data.success === false){
                    toast({title: data.message, variant: "destructive"})
                }
                if(data.success === true){
                    const buttonRef = ref.current as HTMLButtonElement | null;
                    if (buttonRef) {
                        buttonRef.click();
                    }
                    toast({title: data.message})
                }
            }
        } catch (error) {
             toast({title: 'Some error occure while adding member try again!', variant: "destructive"})
        }finally{
            setIsLoadingSubmit(false)
            setIsLoading(false)
        }
    }


    return (
        <div className="w-full">
            <h4 className='text-lg text-black font-bold text-center mb-6'>Add Members to {orgName}</h4>
            <div className="mb-6 flex flex-wrap gap-2 w-full items-center">
              {membersIdArray.map((id, index) =>{
                return (
                    <div key={index} className="flex gap-2 items-center px-2 py-1 border border-gray-300 rounded-full">
                        <span className="text-gray-500 text-sm font-medium">{membersArray[index]}</span>
                        <X className="text-gray-500 hover:text-black cursor-pointer" width={14} height={14} onClick={() => remove(membersArray[index], id)}  />
                    </div>
                )
              })}
            </div>
            <form className={`flex w-full gap-4 mb-4 ${isLoading && 'opacity-80'}`} onSubmit={(e) => EmailVerify(e)} >
                <input type="email" value={Credential.email} name="email" className='form-input font-medium' placeholder='Enter user email...' onChange={handleChange} required disabled={isLoading} />
                <button type="submit" className="btn3 flex gap-2 px-4 items-center">
                    {isLoading ? <Loader2 width={20} height={20} color="#fff" className="animate-spin" /> : <Verified width={20} height={20} className="cursor-pointer" color={verifyColor} />} 
                </button>
            </form>

            <div className="w-full">
                <button className={`mt-2 w-full btn ${isLoading || membersArray.length === 0 ? 'pointer-events-none bg-greenshade/80' : '' }`} disabled={isLoading} onClick={AddMembers}>{isLoadingSubmit ? "Processing..." : 'Add Members'}</button>
            </div>

            <DialogClose asChild>
                <button className='hidden' ref={ref}>
                    Close
                </button>
            </DialogClose>

        </div>
    )
}

export default AddMembers