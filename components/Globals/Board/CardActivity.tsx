
"use client"

import { getCardActivity } from "@/actions/Card"
import ActivitySkeleton from "@/components/Skeletons/ActivitySkeleton"
import { useToast } from "@/components/ui/use-toast"
import { Activity } from "lucide-react"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import ActivityItem from "../ActivityItem"

interface props {
    data: any,
}
const CardActivity = ({ data }: props) => {
    const { orgId } = useParams()
    const [isLoad, setIsLoad] = useState(false)
    const [activity, setActivity] = useState<any[]>([])
    const { toast } = useToast()

    const getData = async () => {
        try {
            setIsLoad(true)
            const result = await getCardActivity(data.id as string, orgId as string)
            if (result.success === true && result.data) {
                setActivity(result.data || [])
            } else {
                toast({ title: result.message, variant: 'destructive' })
            }
        } catch (error) {
            toast({ title: 'server error try again!', variant: 'destructive' })
        } finally {
            setIsLoad(false)
        }
    }

    useEffect(() => {
        getData()
    }, [data])
    
    return (
        <div className="w-full">
            {activity && activity.length > 0 && (
                <div className="flex items-center gap-3 mt-4">
                    <Activity className="h-5 w-5 text-gray-800" />
                    <h4 className="text-base md:text-lg text-black font-medium">Activity</h4>
                </div>
            )}
            {isLoad ? (
               <ActivitySkeleton />
            ) : (
                <div className="mt-2  md:ml-6 grid gap-3">
                    {activity && activity.length > 0 && activity.map((data) => {
                        const formattedDate = data.createdAt.toLocaleString('en-IN', {
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
                    })}
                </div>
            )}
        </div>
    )
}

export default CardActivity