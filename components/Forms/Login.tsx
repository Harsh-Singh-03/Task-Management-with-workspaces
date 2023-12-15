"use client"
import { signIn, useSession } from 'next-auth/react'
import { useEffect, useState, FormEvent, ChangeEvent } from 'react'
import Image from "next/image"
import Link from 'next/link'
import Loading from '../ui/Loading'
import { useRouter } from 'next/navigation'
import { isEmail } from '@/lib/utils'
import { useToast } from '../ui/use-toast'

const Login = () => {
    const session = useSession()
    const router = useRouter()
    const { toast } = useToast()

    useEffect(() => {
        if (session.status === 'authenticated') {
            router.replace('/') // will change the redirect url
        }
    }, [session])


    const [Credential, setCredential] = useState({ email: '', password: "" })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCredential({ ...Credential, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if(!isEmail(Credential.email)){
            toast({
                variant: "destructive",
                title: "Please enter a valid email."
            })
            return;
        }
        if(Credential.password.length < 8){
            toast({
                variant: "destructive",
                title: "Password should be 8 charcter long."
            })
            return;
        }
        try {
            const res = await signIn("Credentials", {
                redirect: false,
                email: Credential.email,
                password: Credential.password
            })
            if(res?.ok){
                toast({title: 'Successfully login !!'})
                router.replace('/')
            }else{
                toast({
                    variant: "destructive",
                    title: res?.error || ''
                })
            }
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Server error please try again letter!"
            })
        }
    }

    return (
        <>
            {session.status === 'unauthenticated' ? (
                <div className='auth-form flex flex-col gap-4 lg:gap-6'>
                    <h4 className='text-xl text-black font-bold text-center'>Welcome, Sign In</h4>
                    <div className='flex gap-4 lg:gap-6 max-h-min'>
                        <button className='flex-1 flex justify-center items-center gap-4 bg-white shadow-md py-2.5 rounded-sm' onClick={() => signIn('google')}>
                            <Image src="/assets/google.svg" alt='google' width={24} height={24} />
                            <span className='text-base text-black'>Google</span>
                        </button>
                        <button className='flex-1 flex justify-center items-center bg-gray-800 gap-4 shadow-md py-2.5 rounded-sm hover:shadow-sm' onClick={() => signIn('github')}>
                            <Image src="/assets/github-mark-white.png" alt='github' width={24} height={24} />
                            <span className='text-base text-white'>Github</span>
                        </button>
                    </div>
                    <div className='flex items-baseline gap-4'>
                        <span className='flex-1 h-[1.5px] bg-gray-300'></span>
                        <p className='text-base'>or</p>
                        <span className='flex-1 h-[1.5px] bg-gray-300'></span>
                    </div>
                    <form className='grid w-full gap-4' onSubmit={(e) => handleSubmit(e)}>
                        <input type="email" name="email" value={Credential.email} className='form-input' placeholder='example@gmail.com' onChange={handleChange} required />
                        <input type="password" value={Credential.password} name="password" className='form-input' placeholder='password...' onChange={handleChange} required minLength={8} />
                        <button type='submit' className='mt-4 w-full btn'>SIGN IN</button>
                    </form>
                    <p className='text-gray-500 text-center text-sm'>Don't have an account? <Link href='/sign-up' className='text-greenshade font-semibold hover:border-b-2 hover:border-b-greenshade'>Create Account</Link></p>
                </div>
            ) : <Loading />}
        </>
    )
}

export default Login