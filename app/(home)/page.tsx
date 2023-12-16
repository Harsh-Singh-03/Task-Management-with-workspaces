import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

export default async function  Home() {
  const session = await getServerSession()
  
  return (
    <div className=" min-h-screen relative w-full grid">
       <Image src='/assets/home-bg.svg' alt="background" width={0} height={0} className="fixed bottom-0 left-0 w-full h-screen object-cover z-0" />
      <div className="z-10 mt-40 flex flex-col items-center" >
        <h2 className="text-white font-bold text-3xl md:text-6xl text-center">Welcome, TO T-<i>ASK</i></h2>
        <p className="text-lg md:text-xl text-center my-6 md:my-8 text-white">The Task Management That All You Need !</p>
        <div className="flex gap-2 justify-center items-center">
          {session && session.user ? (
            <>
            <Link href='/app' className="btn bg-white/40 px-6">GO TO DASHBOARD</Link>
            </>
          ): (
            <>
            <Link href='/sign-in' className="btn2  bg-white/40 px-6 text-white hover:text-black">LOGIN</Link>
            <Link href='/sign-up' className="btn px-6">GET STARTED FOR FREE</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
