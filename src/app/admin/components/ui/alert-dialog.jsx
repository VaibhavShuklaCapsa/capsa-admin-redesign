"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"

function AlertDialog({ ...props }) {
  return <AlertDialogPrimitive.Root {...props} />
}

function AlertDialogTrigger({ ...props }) {
  return <AlertDialogPrimitive.Trigger {...props} />
}

function AlertDialogPortal({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Portal className={className} {...props} />
  )
}

function AlertDialogOverlay({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-overlay/50 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({ className, children, ...props }) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-[95vw] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-popover p-6 shadow-lg",
          className
        )}
        {...props}
      >
        {children}
        <AlertDialogPrimitive.Close className="sr-only" />
      </AlertDialogPrimitive.Content>
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({ className, ...props }) {
  return (
    <div className={cn("mb-2 flex flex-col space-y-1", className)} {...props} />
  )
}

function AlertDialogFooter({ className, ...props }) {
  return (
    <div className={cn("mt-4 flex items-center justify-end gap-2", className)} {...props} />
  )
}

function AlertDialogTitle({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Title className={cn("text-sm font-semibold", className)} {...props} />
  )
}

function AlertDialogDescription({ className, ...props }) {
  return (
    <AlertDialogPrimitive.Description className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
}

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
}
