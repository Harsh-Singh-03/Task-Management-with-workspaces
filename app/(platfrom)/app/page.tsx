import Empty from "@/components/Globals/Empty"
import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'

const page = async () => {
  const session = await getServerSession()
  if (!session) redirect('/')

  return (
    <div className="w-full">
      <Empty isOrg={false} />
    </div>
  )
}

export default page