import HeadSkeleton from "@/components/Skeletons/HeadSkeleton"
import TableSkeleton from "@/components/Skeletons/TableSkeleton"
import Loading from "@/components/ui/Loading"
import { Skeleton } from "@/components/ui/skeleton"

const loading = () => {
    return (
        <div className="w-full mt-6">
            <HeadSkeleton />
            {/* <div className="min-w-full mt-52 grid place-items-center">
                <Loading />
            </div> */}
            <TableSkeleton/>
        </div>
    )
}

export default loading