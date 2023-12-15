import Login from "@/components/Forms/Login"
import Image from "next/image"
import '../../globals.css'


const page = () => {
  return (
    <div className="min-h-screen w-full grid place-items-center relative px-4">
      <Image src='/assets/bg-auth.svg' alt="background" width={0} height={0} className="fixed bottom-0 left-0 w-full h-screen object-cover z-0" />
      <Login/>
    </div>
  )
}

export default page
