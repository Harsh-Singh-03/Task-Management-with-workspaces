import Newpass from "@/components/Forms/Newpass"
import Image from "next/image"


const page = async ({ params }: { params: { id: string, token: string } }) => {

    return (
        <div className="min-h-screen w-full grid place-items-center relative px-4">
            <Image src='/assets/bg-auth.svg' alt="background" width={0} height={0} className="fixed bottom-0 left-0 w-full h-screen object-cover z-0" />
            <Newpass id={params.id || ''} token={params.token || ""} />
        </div>
    )
}

export default page