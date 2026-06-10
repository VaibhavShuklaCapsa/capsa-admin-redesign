"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { cn } from "@/lib/utils"

export default function TransactionVolumeChart({
  title,
  subtitle,
  periodLabel,
  periodOptions = [],
  chartData = [],
  xLabels = [],
  selectedPeriod,
  onPeriodChange,
  emptyMessage = null,
  className = "",
}) {
  const activePeriod = selectedPeriod ?? periodOptions[0]?.value
  const maxValue = Math.max(...chartData.map((item) => item.value), 1)

  return (
    <section
      className={cn(
        "bg-white border border-borderGrey rounded-2xl p-5 shadow-sm",
        className
      )}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-customBlack mb-1">{title}</h3>
          <p className="text-grey text-sm">{subtitle}</p>
        </div>

        {periodOptions.length > 0 ? (
          <Select value={activePeriod} onValueChange={onPeriodChange}>
            <SelectTrigger className="h-auto rounded-xl px-4 py-2.5 text-sm font-medium border-borderGrey bg-white min-w-[180px]">
              <SelectValue placeholder={periodLabel} />
            </SelectTrigger>
            <SelectContent>
              {periodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span className="border border-borderGrey rounded-xl px-4 py-2.5 text-sm font-medium bg-white text-customBlack">
            {periodLabel}
          </span>
        )}
      </div>

      <div className="border-t border-gray-100 pt-6 overflow-hidden">
        {emptyMessage ? (
          <div className="flex items-center justify-center h-[280px]">
            <p className="text-grey text-sm">{emptyMessage}</p>
          </div>
        ) : (
          <>
            <div className="relative flex items-end gap-[6px] h-[280px]">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="border-t border-gray-100 w-full" />
                ))}
              </div>
              {chartData.map((bar) => (
                <div
                  key={bar.index}
                  className="relative z-10 bg-blue rounded-t-sm w-full min-w-0"
                  style={{ height: `${(bar.value / maxValue) * 100}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-grey mt-4 px-1">
              {xLabels.map((date) => (
                <span key={date}>{date}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
