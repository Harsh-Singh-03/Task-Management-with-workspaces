import { generateLogMessage } from "@/lib/LogMessage"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const ActivityItem = ({ data, formattedDate }: any) => {
    return (
        <div className="flex items-center gap-x-2">
            <Avatar className="h-8 w-8">
                <AvatarImage src={data.userImage} />
                <AvatarFallback >{data.userName.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
                <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-neutral-700">
                        {data.userName}
                    </span> {generateLogMessage(data)}
                </p>
                <p className="text-xs text-muted-foreground">
                    {formattedDate}
                </p>
            </div>
        </div>
    )
}

export default ActivityItem