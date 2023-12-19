"use client"
import { useState, FormEvent, ChangeEvent } from 'react'
import Link from 'next/link'
import { isEmail } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { useToast } from '../ui/use-toast'
import { resetPassRequest } from '@/actions/User'

const Reqpass = () => {

    const [isLoad, setIsLoad] = useState(false)
    const { toast } = useToast()
    const [email, setEmail] = useState('')

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!isEmail(email)) {
            toast({
                variant: "destructive",
                title: "Please enter a valid email."
            })
            return;
        }
        try {
            setIsLoad(true)
            const res = await resetPassRequest(email)
            if (res && res.success) {
                toast({ title: res.message })
            } else {
                toast({ title: res.message, variant: 'destructive' })
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Server error please try again letter!"
            })
        } finally {
            setIsLoad(false)
        }
    }

    return (
        <div className='auth-form flex flex-col gap-4 lg:gap-6'>
            <h4 className='text-xl text-black font-bold text-center'>Reset password request</h4>
            <div className='flex items-baseline gap-4'>
                <span className='flex-1 h-[1.5px] bg-gray-300'></span>
                <p className='text-base'>or</p>
                <span className='flex-1 h-[1.5px] bg-gray-300'></span>
            </div>
            <form className='grid w-full gap-4' onSubmit={(e) => handleSubmit(e)}>
                <input type="email" name="email" value={email} className='form-input' placeholder='example@gmail.com' onChange={handleChange} required />
                <button type='submit' className='flex justify-center items-center gap-2 mt-4 w-full btn'>
                    {isLoad && (
                        <Loader2 className='w-5 h-5 text-gray-200 animate-spin' />
                    )}
                    {isLoad ? "Processing..." : 'Submit request'}
                </button>
            </form>
            <p className='text-gray-500 text-center text-sm'>Don't have an account? <Link href='/sign-up' className='text-greenshade font-semibold hover:border-b-2 hover:border-b-greenshade'>Create Account</Link></p>
        </div>

    )
}

export default Reqpass