import { getBoardPageContent } from "@/actions/Board"
import BoardTopBar from "@/components/Globals/Board/BoardTopBar"
import ListContainer from "@/components/Globals/Board/List-Container"
import { getServerSession } from "next-auth"
import Image from "next/image"
import { notFound, redirect } from "next/navigation"

const page = async ({ params }: { params: { orgId: string, boardId: string } }) => {
  const session = await getServerSession()
  if (!session || !session.user || !session.user.email) redirect('/')

  const data = await getBoardPageContent(params.orgId, params.boardId , session.user.email)
  if(!data || data.success === false || !data.board || !data.lists) notFound()

  return (
    <div className="relative w-full h-full min-h-screen overflow-y-hidden">
      <Image src={data.board.imageFullUrl} alt="board-banner" fill className="fixed top-0 left-0 w-screen h-screen object-cover" style={{zIndex: -1}} />
      <BoardTopBar boardId={data.board.id} boardTitle= {data.board.title} isAdmin={data.isAdmin} orgId={params.orgId}/>
      <ListContainer orgId={params.orgId} boardId={params.boardId} lists={data.lists} />
    </div>
  )
}

export default page