import { getAllBoardsOfWorkspace } from "@/actions/Board"
import { getOrg } from "@/actions/Organization"
import Boards from "@/components/Globals/Boards"
import WorkspaceHead from "@/components/Globals/WorkspaceHead"
import { User2 } from "lucide-react"
import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'

const page = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession()
  if (!session) redirect('/')
  const data = await getOrg(params.id)
  if(data.success === false || !data.data) redirect('/app')
  const BoardsData = await getAllBoardsOfWorkspace(data.data.id)
  return (
    <div className="mt-6 w-full">
      <WorkspaceHead id={data.data.id} name={data.data.name} isAdmin={data.isAdmin} />
      <div className="w-full">
        {/* Boards */}
        <div className="flex items-center gap-4 mb-4 md:mb-6">
           <User2 width={40} height={40} color="#86A789"/>
          <h4 className="text-base md:text-xl font-semibold">Your Boards :-</h4>
        </div>
        <Boards boardsData={BoardsData.data || []} orgId={data.data.id} />
      </div>
    </div>
  )
}

export default page