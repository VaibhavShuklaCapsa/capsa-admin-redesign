"use client"

import { useState } from "react"
import { format } from "date-fns"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

export default function DateRangePicker({
  label = "Select Date Range",
  placeholder,
  calendarIcon = "/icons/calendar.svg",
  showChevron = false,
  className = "",
  value,
  onChange,
}) {
  const [range, setRange]   = useState(value)
  const [month, setMonth]   = useState(new Date())
  const [open, setOpen]     = useState(false)

  const displayLabel =
    range?.from && range?.to
      ? `${format(range.from, "MMM d, yyyy")} - ${format(range.to, "MMM d, yyyy")}`
      : placeholder ?? label

  const handleSelect = (selected) => {
    setRange(selected)
    onChange?.(selected)
    if (selected?.from && selected?.to) {
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "bg-white border border-borderGrey rounded-xl px-4 py-2.5 flex items-center gap-2 shadow-sm text-sm font-medium text-customBlack",
            className
          )}
        >
          <Image src={calendarIcon} width={18} height={18} alt="Calendar" />
          <span className="text-grey">{displayLabel}</span>
          {showChevron ? (
            <Image src="/icons/drop-down.svg" width={14} height={14} alt="" />
          ) : null}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end" collisionPadding={24}>
        <Calendar
          mode="range"
          selected={range}
          onSelect={handleSelect}
          month={month}
          onMonthChange={setMonth}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
