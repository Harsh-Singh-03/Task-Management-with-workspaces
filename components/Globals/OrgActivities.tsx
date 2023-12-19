"use client"
import React, { useEffect, useState } from 'react'
import ActivityItem from './ActivityItem';
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '../ui/use-toast';
import ActivitySkeleton from '../Skeletons/ActivitySkeleton';
interface props {
    data: any[],
    page: string
}
const OrgActivities = ({ data, page }: props) => {
    const [activities, setActivities] = useState(data)
    // const [Page, setPage] = useState(page)
    const router = useRouter()
    const pathname = usePathname()
    const { toast } = useToast()
    const [isActLoad, setIsActLoad] = useState(false)

    useEffect(() => {
        setActivities(data)
        setIsActLoad(false)
    }, [data])

    const NextPage = () => {
        if (activities.length === 20) {
            setIsActLoad(true)
            // setPage(`${Number(page) + 1}`)
            router.push(`${pathname}?page=${Number(page) + 1}`)
            toast({ title: 'Filter applied : next page' })
        }
    }
    const PrevPage = () => {
        if (Number(page) > 1) {
            setIsActLoad(true)
            // setPage(`${Number(page) - 1}`)
            router.push(`${pathname}?page=${Number(page) - 1}`)
            toast({ title: 'Filter applied : prev page' })
        }
    }

    return (
        <>
            {isActLoad ? (
                <div className="w-full">
                    <ActivitySkeleton />
                    <ActivitySkeleton />
                    <ActivitySkeleton />
                    <ActivitySkeleton />
                    <ActivitySkeleton />
                </div>
            ) : (
                <div className="w-full grid gap-3 mb-6">
                    {activities.length > 0 ? activities.map((data) => {
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
                    }) : (
                        <p className="text-gray1 text-base font-medium my-4">No activity found</p>
                    )}
                    <div className='flex gap-2 items-center justify-center md:justify-start w-full'>
                        <button className={`btn2 py-1.5 px-4 border font-medium ${Number(page) < 2 && 'pointer-events-none opacity-40 bg-black/10'}`} onClick={PrevPage}>Prev</button>
                        <span className='font-medium rounded-md text-sm py-1 px-2 grid place-items-center bg-gray-700 text-white' >{Number(page) ? page : 1}</span>
                        <button className={`btn2 py-1.5 px-4 border font-medium ${activities.length < 20 && 'pointer-events-none opacity-40 bg-black/10'}`} onClick={NextPage}>Next</button>
                    </div>
                </div>

            )}
        </>
    )
}

export default OrgActivities