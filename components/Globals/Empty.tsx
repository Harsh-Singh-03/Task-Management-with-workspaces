import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog"
import CreateCommunity from "../Forms/CreateCommunity"

const Empty = ({ isOrg }: { isOrg: boolean }) => {

    return (
        <div className="flex-1 flex flex-col items-center mt-10">
            <Image src='/assets/empty.svg' alt="empty" width={0} height={0} className="w-full max-w-xs h-auto object-contain" />
            {/* <p className="text-gray1 text-base lg:text-lg font-medium mt-6 text-center">{isOrg ? "Please select workspace tab to explore.." : "Create your workspace to continue"}</p> */}
            {!isOrg && (
                <Dialog>
                    <DialogTrigger><div className="btn mt-6 px-4">Create Workspace +</div></DialogTrigger>
                    <DialogContent>
                        <CreateCommunity />
                    </DialogContent>
                </Dialog>
            )}
        </div>

    )
}

export default Empty