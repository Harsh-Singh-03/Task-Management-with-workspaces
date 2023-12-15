import { Skeleton } from '../ui/skeleton'

const BoardBodySkeleton = () => {
    return (
        <div className="flex mt-8 lg:mt-12 flex-wrap items-center gap-6">
            <Skeleton className=" w-80 aspect-video rounded-lg" />
            <Skeleton className=" w-80 aspect-video  rounded-lg" />
            <Skeleton className=" w-80 aspect-video  rounded-lg" />
        </div>
    )
}

export default BoardBodySkeleton