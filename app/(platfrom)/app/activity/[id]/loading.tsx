import ActivitySkeleton from "@/components/Skeletons/ActivitySkeleton"
import { Skeleton } from "@/components/ui/skeleton"


const loading = () => {
    return (
        <div className="w-full">
            <div className="flex items-center gap-4 my-4 md:my-6">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <Skeleton className="w-[150px] h-5" />
            </div>
            <div className="w-full">
                <ActivitySkeleton/>
                <ActivitySkeleton/>
                <ActivitySkeleton/>
                <ActivitySkeleton/>
                <ActivitySkeleton/>
            </div>
        </div>
    )
}

export default loading