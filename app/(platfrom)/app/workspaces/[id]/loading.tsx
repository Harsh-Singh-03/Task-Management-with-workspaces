import BoardBodySkeleton from "@/components/Skeletons/BoardBodySkeleton"
import HeadSkeleton from "@/components/Skeletons/HeadSkeleton"
import { Skeleton } from "@/components/ui/skeleton"

const loading = () => {
    return (
        <div className="w-full mt-6">
            <HeadSkeleton/>
            <Skeleton className="w-[180px] h-6 my-4 md:my-6" />
            <BoardBodySkeleton/>
        </div>
    )
}

export default loading