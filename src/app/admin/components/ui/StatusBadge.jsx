import { Badge } from "./badge"
import { cn } from "@/lib/utils"
import { ADMIN_ACCOUNT_STATUS_STYLES } from "../../constants/status"

export default function StatusBadge({ status, className = "" }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium border",
        ADMIN_ACCOUNT_STATUS_STYLES[status] ?? "bg-deepGrey text-grey border-transparent",
        className
      )}
    >
      {status}
    </Badge>
  )
}
