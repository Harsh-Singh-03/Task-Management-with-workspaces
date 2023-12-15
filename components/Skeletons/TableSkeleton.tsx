import { Skeleton } from "../ui/skeleton"


const TableSkeleton = () => {
    return (
        <div className="w-full">
            <div className="flex flex-col gap-4 items-end md:items-center md:flex-row justify-between my-4 md:my-6">
                <div className="flex items-center gap-2 w-full">
                    <Skeleton className="w-full md:w-[200px] h-8 rounded-md" />
                    <Skeleton className="w-[100px] h-8 rounded-md" />
                </div>
                <Skeleton className="w-[180px] h-8 rounded-md" />
            </div>
            <div className="w-full mb-4 relative overflow-x-auto border border-gray-200 rounded-md p-4 md:p-6">
                <div className="flex w-full justify-between mb-4 :mb-6">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-20 h-4" />
                </div>
                <div className="flex w-full justify-between mb-4 :mb-6">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-20 h-4" />
                </div>
                <div className="flex w-full justify-between">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-20 h-4" />
                </div>

            </div>
            <div className="flex justify-between items-center">
                <div><Skeleton className="w-[100px] h-5 rounded" /></div>
                <div className="flex items-center gap-2" >
                    <Skeleton className="h-6 w-14 rounded" />
                    <Skeleton className="h-6 w-14 rounded" />
                </div>
            </div>
        </div>
    )
}

export default TableSkeleton