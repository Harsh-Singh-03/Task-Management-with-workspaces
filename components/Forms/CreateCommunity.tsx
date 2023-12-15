"use client"

import { useState, useRef, ChangeEvent, FormEvent } from 'react'
import { DialogClose } from '@radix-ui/react-dialog'
import { CreateOrg } from '@/actions/Organization';
import { useToast } from '../ui/use-toast';
import { usePathname } from 'next/navigation';

const CreateCommunity = () => {
    const ref = useRef<HTMLButtonElement | null>(null);
    const [Credential, setCredential] = useState({ name: "" })
    const {toast} = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname()
    
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCredential({ ...Credential, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const data = await CreateOrg(Credential.name, pathname)
            if (data.success) {
                const buttonRef = ref.current as HTMLButtonElement | null;
                if (buttonRef) {
                    buttonRef.click();
                }
                toast({title: data.message})
            }else{
                toast({variant: "destructive", title: data.message})
            }
        } catch (error: any) {
            toast({variant: "destructive",title: "Server error try again !"})
        } finally{
            setIsLoading(false)
        }
    }

    return (
        <> 
            <form className={`grid w-full gap-4 ${isLoading && 'opacity-80'}`} onSubmit={(e) => handleSubmit(e)} >
                <input type="text" value={Credential.name} name="name" className='form-input font-medium' placeholder='Enter workspace name...' onChange={handleChange} required minLength={3} disabled={isLoading} />
                <button type='submit' className='mt-2 w-full btn' disabled={isLoading}>{isLoading ? "Processing..." : 'Create Workspace'}</button>
            </form>
            <DialogClose asChild>
                <button className='hidden' ref={ref}>
                    Close
                </button>
            </DialogClose>
        </>
    )
}

export default CreateCommunity