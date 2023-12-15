import { Skeleton } from '../ui/skeleton'

const ActivitySkeleton = () => {
    return (
        <div className="flex items-start gap-x-3 w-full mt-4">
            <Skeleton className="h-6 w-6 bg-neutral-200" />
            <div className="w-full">
                <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
                <Skeleton className="w-full h-10 bg-neutral-200" />
            </div>
        </div>
    )
}

export default ActivitySkeleton