"use client"
import Image from "next/image"
import CreateBoard from "../Forms/Create-Board"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import Link from "next/link"
import { Info, PlusIcon } from "lucide-react"
interface props {
    boardsData: any[],
    orgId: string
}
const Boards = ({ boardsData, orgId }: props) => {

    return (
        <div className="w-full mb-6">
            <div className="relative flex flex-wrap items-center gap-4 w-full">
                {boardsData && boardsData.map((data, index) => {
                    return (
                        <Link
                            key={index}
                            href={`/board/${orgId}/${data.id}`}
                            className="min-w-full md:min-w-min md:max-w-xs shadow-sm relative aspect-video bg-no-repeat bg-center bg-cover rounded-lg h-full w-full p-4 overflow-hidden"
                            style={{ backgroundImage: `url(${data.imageThumbUrl})` }}
                        >
                            <div className="absolute inset-0 bg-black/10 hover:bg-black/40 transition" />
                            <p className="relative text-base font-semibold text-white">
                                {data.title}
                            </p>
                        </Link>
                    )
                })}
                <Dialog>
                    <DialogTrigger className="w-full relative min-w-full md:min-w-min md:max-w-xs aspect-video">
                        <div className="w-full h-full rounded-lg p-4 bg-gray-200 shadow-sm flex flex-col justify-center items-center cursor-pointer hover:shadow-lg">
                            <PlusIcon width={30} height={30} color="#000" />
                            <span className="text-base font-semibold">Create New Board</span>
                            <Info className="absolute bottom-4 right-4 cursor-pointer" width={20} height={20} color="#000" />
                        </div>
                    </DialogTrigger>
                    <DialogContent className="rounded-lg">
                        <CreateBoard orgId={orgId} />
                    </DialogContent>
                </Dialog>

            </div>

        </div>
    )
}

export default Boards