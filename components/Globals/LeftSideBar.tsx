"use client"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import {
    Activity,
    CreditCard,
    Layout,
    Plus,
    Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import CreateCommunity from "../Forms/CreateCommunity";

interface props {
    orgs: { name: string, id: string, adminId: string }[]
    mobile: boolean
}
const LeftSideBar = ({ orgs, mobile }: props) => {
    const pathname = usePathname()
    const [open, setOpen] = useState<string[]>([])

    useEffect(() => {
        const id = pathname.split('/')
        let no = orgs.findIndex(org => org.id === id[3])
        setOpen([`item-${no}`])
    }, [pathname])

    const change = (e: any) => {
        setOpen(e)
    }
    return (
        <div className={`max-w-xs lg:max-w-sm w-full mt-4 ${mobile ? 'block' : 'hidden'} md:block h-full ${mobile ? 'overflow-y-scroll' : ""}`}>
            <div className="flex my-2 pl-2 justify-between items-center">
                <p className="text-base md:text-lg text-gray-900 font-bold tracking-wider">Workspaces :</p>
                <Dialog>
                    <DialogTrigger><div><Plus className="hover:bg-gray-100 cursor-pointer object-contain" width={30} height={30} color="#000" /></div></DialogTrigger>
                    <DialogContent>
                        <CreateCommunity />
                    </DialogContent>
                </Dialog>
            </div>
            <Accordion type="multiple" className="w-full" value={open} onValueChange={(e) => change(e)}>
                {orgs.map((org: { name: string, id: string, adminId: string }, index: number) => {
                    return (
                        <AccordionItem value={`item-${index}`} key={index}>
                            <AccordionTrigger className={pathname.split('/')[3] === org.id && !open.includes(`item-${index}`) ? "bg-green-200/30 rounded-md" : "hover:bg-gray-100"}>
                                <div className="flex items-center gap-4">
                                    <span className="rounded-full w-8 h-8 text-white bg-greenshade2 text-sm font-semibold grid place-items-center">{org.name?.slice(0, 1).toUpperCase()}</span>
                                    <p className={`text-sm md:text-base font-semibold capitalize ${pathname.split('/')[3] === org.id && !(open as string[]).includes(`item-${index}`) ? "text-green-800" : "text-gray-800"}`}>{org.name}</p>

                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="">
                                <Link href={`/app/workspaces/${org.id}`} className={`flex gap-4 rounded-md items-center px-6 py-3 cursor-pointer ${pathname === `/app/workspaces/${org.id}` ? 'bg-green-200/30' : 'hover:bg-gray-100'}`}>
                                    <Layout className="w-6 h-6" color={pathname === `/app/workspaces/${org.id}` ? "#86A789" : "#808080"} />
                                    <p className={`text-sm md:text-base font-medium ${pathname === `/app/workspaces/${org.id}` && 'text-green-800'}`}>Boards</p>
                                </Link>
                                <Link href={`/app/activity/${org.id}`} className={`flex gap-4 items-center px-6 py-3 cursor-pointer ${pathname === `/app/activity/${org.id}` ? 'bg-green-200/30' : 'hover:bg-gray-100'}`}>
                                    <Activity className="w-6 h-6" color={pathname === `/app/activity/${org.id}` ? "#86A789" : "#808080"} />
                                    <p className={`text-sm md:text-base font-medium ${pathname === `/app/activity/${org.id}` && 'text-green-800'}`}>Actvity</p>
                                </Link>
                                {/* <Link  href={`/app/payment/${org.id}`} className={`flex gap-4 items-center px-6 py-3 cursor-pointer ${pathname === `/app/payment/${org.id}` ? 'bg-green-200/30' : 'hover:bg-gray-100'}`}>
                                    <CreditCard className="w-6 h-6" color={pathname === `/app/payment/${org.id}` ? "#86A789" : "#808080"} />
                                    <p className={`text-sm md:text-base font-medium ${pathname === `/app/payment/${org.id}` && 'text-green-800'}`}>Payment</p>
                                </Link> */}
                                <Link href={`/app/settings/${org.id}`} className={`flex gap-4 items-center px-6 py-3 cursor-pointer ${pathname === `/app/settings/${org.id}` ? 'bg-green-200/30' : 'hover:bg-gray-100'}`}>
                                    <Settings className="w-6 h-6" color={pathname === `/app/settings/${org.id}` ? "#86A789" : "#808080"} />
                                    <p className={`text-sm md:text-base font-medium ${pathname === `/app/settings/${org.id}` && 'text-green-800'}`}>Settings</p>
                                </Link>
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    )
}

export default LeftSideBar