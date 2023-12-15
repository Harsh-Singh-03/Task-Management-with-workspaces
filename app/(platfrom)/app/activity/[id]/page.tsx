import { getOrg } from "@/actions/Organization"
import WorkspaceHead from "@/components/Globals/WorkspaceHead"
import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'

const page = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession()
  if (!session) redirect('/')
  const data = await getOrg(params.id)
  if(data.success === false || !data.data) redirect('/app')
  return (
    <div className="mt-6 w-full">
      <WorkspaceHead name={data.data.name} id={data.data.id} isAdmin={data.isAdmin} />
    </div>
  )
}

export default page