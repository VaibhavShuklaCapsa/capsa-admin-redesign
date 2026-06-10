"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Button } from "../ui/button"

// Generic confirmation modal (Block / Delete / any destructive action)
// Props:
//   open          - boolean
//   onClose       - (false) => void
//   title         - string  e.g. "Delete Account"
//   description   - string  e.g. "Do you wish to proceed..."
//   confirmLabel  - string  e.g. "Yes, Delete"
//   confirmColor  - string  tailwind bg class e.g. "bg-[#EF4444] hover:bg-[#EF4444]/90"
//   onConfirm     - () => void  called when user clicks confirm button
const btnBase = {
  display: "flex",
  height: "44px",
  padding: "8px 16px",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  borderRadius: "8px",
  fontFamily: "Satoshi",
  fontSize: "16px",
  fontWeight: 500,
  lineHeight: "140%",
  cursor: "pointer",
  border: "none",
}

export default function ConfirmActionModal({ open, onClose, title, description, confirmLabel, confirmBgColor = "#EF4444", onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle
            style={{
              color: "#09090B",
              fontFamily: "Satoshi",
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: "140%",
            }}
          >
            {title}
          </DialogTitle>
        </DialogHeader>

        <p
          style={{
            color: "#71717A",
            fontFamily: "Satoshi",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "140%",
            padding: "8px 0",
          }}
        >
          {description}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          {/* Cancel button */}
          <button
            onClick={() => onClose(false)}
            style={{
              ...btnBase,
              background: "#fff",
              border: "1px solid #E4E4E7",
              color: "#09090B",
            }}
          >
            Cancel
          </button>

          {/* Confirm button — color passed per page */}
          <button
            onClick={() => { onConfirm?.(); onClose(false) }}
            style={{
              ...btnBase,
              background: confirmBgColor,
              color: "#fff",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
