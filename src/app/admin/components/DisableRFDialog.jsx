"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "./ui/dialog"
import { toggleAnchorRF } from "../services/anchorDetail"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "./toast"

// rfEnabled = true  → user wants to DISABLE (send enabled: false)
// rfEnabled = false → user wants to ENABLE  (send enabled: true)
export default function ToggleRFDialog({ open, onOpenChange, panNumber, rfEnabled, onSuccess }) {
  const [submitting, setSubmitting] = useState(false)

  const isDisabling = rfEnabled === true
  const title       = isDisabling ? "Disable Reverse Factoring" : "Enable Reverse Factoring"
  const bodyText    = isDisabling
    ? "You are choosing to disable reverse factoring for this anchor. Do you wish to proceed?"
    : "You are choosing to enable reverse factoring for this anchor. Do you wish to proceed?"
  const confirmLabel = isDisabling ? "Yes, Disable" : "Yes, Enable"
  const loadingLabel = isDisabling ? "Disabling..."  : "Enabling..."

  const handleToggle = async () => {
    setSubmitting(true)
    try {
      const res = await toggleAnchorRF({ panNumber, enabled: !isDisabling })
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg ?? `Reverse factoring ${isDisabling ? "disabled" : "enabled"}.`} />, { style: { padding: 0 } })
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast(<ErrorToast message={res?.messg ?? "Failed to update reverse factoring."} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 gap-0 border border-[#E4E4E7] shadow-lg rounded-[8px]"
        style={{ width: "451px", maxWidth: "451px" }}
      >
        <div className="flex flex-col gap-6 p-6">
          <DialogTitle
            style={{ fontSize: "18px", fontWeight: 700, lineHeight: "140%", color: "#09090B" }}
          >
            {title}
          </DialogTitle>

          <p style={{ fontSize: "14px", fontWeight: 400, lineHeight: "140%", color: "#71717A" }}>
            {bodyText}
          </p>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              style={{
                height: "44px", padding: "8px 16px", borderRadius: "8px",
                border: "1px solid #E4E4E7", background: "transparent",
                color: "#09090B", fontSize: "16px", fontWeight: 500, lineHeight: "140%",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleToggle}
              disabled={submitting}
              style={{
                height: "44px", padding: "8px 16px", borderRadius: "8px",
                background: "#0098DB", color: "#FAFAFA",
                fontSize: "16px", fontWeight: 500, lineHeight: "140%",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? loadingLabel : confirmLabel}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
