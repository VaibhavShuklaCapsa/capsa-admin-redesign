"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"

// Generic single-field edit modal
// Props:
//   open        - boolean
//   onClose     - (false) => void
//   title       - string  e.g. "Edit Email Address"
//   label       - string  e.g. "Email Address"
//   placeholder - string  e.g. "Enter email address"
//   onUpdate    - async (value) => void  — should throw on error, resolve on success
//   buttonColor - hex color string (default #0098DB)
export default function EditFieldModal({ open, onClose, title, label, placeholder, onUpdate, buttonColor = "#0098DB" }) {
  const [value, setValueState]   = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleClose = () => {
    setValueState("")
    setSubmitting(false)
    onClose(false)
  }

  const handleUpdate = async () => {
    if (!value.trim()) return
    setSubmitting(true)
    try {
      await onUpdate?.(value)
      // Only close if onUpdate resolved without throwing
      handleClose()
    } catch {
      // onUpdate threw (error already toasted inside) — keep modal open
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open && !submitting) handleClose() }}>
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

        <div className="space-y-2 py-2">
          <label
            style={{
              color: "#09090B",
              fontFamily: "Satoshi",
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: "140%",
              display: "block",
            }}
          >
            {label}
          </label>
          <Input
            value={value}
            onChange={(e) => setValueState(e.target.value)}
            placeholder={placeholder}
            style={{
              color: "#09090B",
              fontFamily: "Satoshi",
              fontSize: "18px",
              fontWeight: 400,
              lineHeight: "140%",
            }}
            className="border-borderGrey"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleUpdate}
            disabled={submitting || !value.trim()}
            style={{
              display: "flex",
              height: "44px",
              padding: "8px 16px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              borderRadius: "8px",
              background: submitting || !value.trim() ? "#A3A3A3" : buttonColor,
              color: "#fff",
              fontFamily: "Satoshi",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: submitting || !value.trim() ? "not-allowed" : "pointer",
              minWidth: "100px",
            }}
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : "Update"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
