import { getOrg } from "@/actions/Organization"
import DataTable from "@/components/Globals/DataTable"
import WorkspaceHead from "@/components/Globals/WorkspaceHead"
import { getServerSession } from "next-auth"
import { redirect } from 'next/navigation'

const page = async ({ params, searchParams }: { params: { id: string }, searchParams: { [key: string]: string | undefined } }) => {
  const session = await getServerSession()
  if (!session) redirect('/')
  
  const data = await getOrg(params.id, searchParams.search, Number(searchParams.page) || 1  , Number(searchParams.pagesize) || 10 )
  if(data.success === false || !data.data) redirect('/app')
  // console.log(searchParams)
  return (
    <div className="mt-6 w-full">
      <WorkspaceHead name={data.data.name} id={data.data.id} isAdmin={data.isAdmin} isSettings={true} />
      <DataTable members={data.data.members} isAdmin={data.isAdmin} adminId={data.data.adminId} pageSize={searchParams.pagesize || '10'} pageNumber={searchParams.page || '1'} searchString={searchParams.search || ''} orgId={data.data.id} />
    </div>
  )
}

export default page