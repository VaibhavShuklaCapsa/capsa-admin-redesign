import { Badge } from "./badge"
import { cn } from "@/lib/utils"
import { STATUS_STYLES } from "../../constants/vendors"

export default function VendorStatusBadge({ status, className = "" }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-3 py-1 text-xs font-medium border",
        STATUS_STYLES[status] ?? "bg-deepGrey text-grey",
        className
      )}
    >
      {status}
    </Badge>
  )
}
