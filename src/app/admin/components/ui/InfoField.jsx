import Image from "next/image"
import { cn } from "@/lib/utils"

export default function InfoField({ label, value, editable = false, className = "" }) {
  return (
    <section className={cn("min-w-0", className)}>
      <p className="text-sm text-grey mb-1">{label}</p>
      <p className="text-sm font-semibold text-customBlack flex items-center gap-2 break-words">
        <span>{value}</span>
        {editable ? (
          <Image src="/icons/pencil-edit.svg" width={14} height={14} alt="Edit" className="shrink-0" />
        ) : null}
      </p>
    </section>
  )
}
