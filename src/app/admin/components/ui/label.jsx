"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/lib/utils"

function Label({
  className,
  ...props
}) {
  return (
    <LabelPrimitive.Root
  data-slot="label"
  className={cn(
    "flex items-center gap-2 select-none font-semibold leading-[140%] text-[16px] text-[rgba(9,9,11,1)] group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
    className
  )}
  style={{
    fontFamily: 'Satoshi'
  }}
  {...props}
/>
  );
}

export { Label }
