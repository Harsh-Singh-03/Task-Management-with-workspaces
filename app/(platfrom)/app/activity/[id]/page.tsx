import { getAllWorkspaceActivity, getOrg } from "@/actions/Organization"
import ActivityItem from "@/components/Globals/ActivityItem"
import { Activity } from "lucide-react"
import { getServerSession } from "next-auth"
import { notFound, redirect } from 'next/navigation'

const page = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession()
  if (!session) redirect('/')
  const data = await getOrg(params.id)
  if (data.success === false || !data.data) redirect('/app')
  const result = await getAllWorkspaceActivity(params.id)
  if (!result || !result.success || !result.data) notFound()
  return (
    <div className=" w-full">
      <div className="flex items-center gap-4 my-4 md:my-6">
        <Activity width={40} height={40} color="#86A789" />
        <h4 className="text-base md:text-xl font-semibold">Your Activity :-</h4>
      </div>
      <div className="w-full grid gap-3 mb-6">
        {result.data.length > 0 ? result.data.map((data) => {
          const formattedDate = data.createdAt.toLocaleString('en-US', {
            month: 'short', // Short month name (e.g., Jan)
            day: 'numeric', // Day of the month (e.g., 1)
            year: 'numeric', // Full year (e.g., 2021)
            hour: 'numeric', // Hour (e.g., 1)
            minute: 'numeric', // Minute (e.g., 24)
            hour12: true, // Use 12-hour clock (true) or 24-hour clock (false)
          });
          return (
            <div key={data.id}>
              <ActivityItem data={data} formattedDate={formattedDate} />
            </div>
          )
        }): (
          <p className="text-gray1 text-base font-medium my-4">No activity found</p>
        )}
      </div>
    </div>
  )
}

export default page