import { getAllWorkspaceActivity, getOrg } from "@/actions/Organization"
import ActivityItem from "@/components/Globals/ActivityItem"
import OrgActivities from "@/components/Globals/OrgActivities"
import { Activity } from "lucide-react"
import { getServerSession } from "next-auth"
import { notFound, redirect } from 'next/navigation'

const page = async  ({ params, searchParams }: { params: { id: string }, searchParams: { [key: string]: string | undefined } }) => {
  const session = await getServerSession()
  if (!session) redirect('/')
  const data = await getOrg(params.id)
  if (data.success === false || !data.data) redirect('/app')
  const result = await getAllWorkspaceActivity(params.id, Number(searchParams.page) || 1 , 20)
  if (!result || !result.success || !result.data) notFound()
  return (
    <div className=" w-full">
      <div className="flex items-center gap-4 my-4 md:my-6">
        <Activity width={40} height={40} color="#86A789" />
        <h4 className="text-base md:text-xl font-semibold">Your Activity :-</h4>
      </div>
      <OrgActivities data={result.data} page={searchParams.page || "1"} />
  
    </div>
  )
}

export default page