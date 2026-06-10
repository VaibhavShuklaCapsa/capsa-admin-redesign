"use client"

import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { cn } from "@/lib/utils"

export default function VendorRowActions({
  actionsTitle = "Actions",
  actions = [],
  onAction,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="p-2 rounded-md hover:bg-deepGrey"
          aria-label="Row actions"
        >
          <MoreHorizontal className="size-5 text-grey" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[200px]">
        <DropdownMenuLabel className="text-sm font-semibold text-customBlack">
          {actionsTitle}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            className={cn("cursor-pointer text-sm py-2.5", action.className)}
            onClick={() => onAction?.(action.id)}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
