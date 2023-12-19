"use client"

import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useState } from 'react'
import { usePathname } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { signOut } from 'next-auth/react'
import CreateCommunity from "../Forms/CreateCommunity"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "../ui/skeleton"
import { resetPassRequest } from "@/actions/User"
import { useToast } from "../ui/use-toast"
import { Loader2 } from "lucide-react"

const TopBar = () => {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const session = useSession()
    const [isLoad, setIsLoad] = useState(false)
    const {toast} = useToast()

    const SubmitRequest = async () => {
        try {
            setIsLoad(true)
            const res = await resetPassRequest(session.data?.user?.email || "")
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
        <header className="site-header bg-bg1/70 z-10">
            <div className="flex items-center gap-4">
                <Link href={pathname === '/app' || pathname === '/' ? '/' : "/app"} className="flex items-center">
                    <Image src="/assets/logo.svg" alt="logo" className="object-contain" width={48} height={48} />
                    <h4 className="font-bold text-base lg:text-xl text-gray-900 -translate-x-2">-<i>ASK</i></h4>
                </Link>
                {pathname !== '/' && (
                    <div className="hidden md:block">
                        <Dialog>
                            <DialogTrigger><div className="btn px-4 py-1.5 ml-4 hidden md:block">Create +</div></DialogTrigger>
                            <DialogContent>
                                <CreateCommunity />
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-4">
                {session.status === "loading" && (
                   <Skeleton className="w-40 h-10"/>
                )}
                {session.status === "unauthenticated" && (
                    <>
                        <Link href='/sign-in' className="btn2 px-4 py-1">Login</Link>
                        <Link href='/sign-up' className="btn hidden md:block px-4 py-1.5 bg-gray-900 hover:bg-gray-600">Get started for free</Link>
                    </>
                )}
                {session.status === "authenticated" && pathname === '/' && (
                    <Link href='/app' className="btn px-4 py-1.5 bg-gray-900 hover:bg-gray-600">Dashboard</Link>
                )}
                {/* Nav Functionality  Menu  */}
                {session.status === "authenticated" && pathname !== '/' && (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger className={`transition-all rounded-md border-gray-300 px-3 py-1.5 border ${open && 'bg-gray-100 border-2'} hover:bg-gray-100`} >
                            <div className="flex items-center">
                                <Avatar>
                                    {session.data.user?.image ? (
                                        <AvatarImage src={session.data.user.image} alt="profile-icon" />
                                    ): (
                                        <AvatarFallback>{session.data.user?.name?.slice(0, 1)}</AvatarFallback>
                                    )}
                                </Avatar>
                                <span className="text-gray-800 text-sm font-medium ml-2">{session.data.user?.name}</span>
                                <Image src="/assets/select.svg" alt="logo" width={16} height={16} className="object-contain ml-2" />
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="mr-4 shadow-xl bg-slate-100">
                            <div>
                                <Dialog>
                                    <DialogTrigger className="w-full">
                                        <div className="w-full flex gap-3 items-center cursor-pointer hover:bg-gray-100 p-2 rounded">
                                            <Image src='/assets/create.svg' width={20} height={20} alt="logo" className="object-contain" />
                                            <p className="text-gray-600 text-sm font-medium tracking-wide">Create Workspace</p>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <CreateCommunity />
                                    </DialogContent>
                                </Dialog>

                                <hr className="my-2" />
                                <div onClick={SubmitRequest} className="flex gap-3 items-center cursor-pointer hover:bg-gray-100 p-2 rounded">
                                    {isLoad ? (
                                        <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                                    ) : (
                                        <Image src='/assets/setting.svg' width={20} height={20} alt="logo" className="object-contain" />
                                    )}
                                    <p className="text-gray-600 text-sm font-medium tracking-wide">{isLoad ? 'processing..' :'Reset Password'}</p>
                                </div>
                                <div className="flex gap-3 items-center cursor-pointer hover:bg-red-100 p-2 rounded" onClick={() => signOut()}>
                                    <Image src='/assets/logout.svg' width={20} height={20} alt="logo" className="object-contain" />
                                    <p className="text-red-600 text-sm font-semibold tracking-wide">Sign Out</p>
                                </div>
                            </div>

                        </PopoverContent>
                    </Popover>
                )}
            </div>
        </header>
    )

}

export default TopBar