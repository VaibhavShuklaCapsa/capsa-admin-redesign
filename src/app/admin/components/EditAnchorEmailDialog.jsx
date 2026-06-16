"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "./ui/dialog"
import { editAnchorEmail } from "../services/anchorDetail"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "./toast"

export default function EditAnchorEmailDialog({ open, onOpenChange, panNumber, currentEmail, onSuccess }) {
  const [email, setEmail]         = useState(currentEmail ?? "")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) setEmail(currentEmail ?? "")
  }, [open, currentEmail])

  const handleUpdate = async () => {
    setSubmitting(true)
    try {
      const res = await editAnchorEmail({ panNumber, email })
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg ?? "Email updated successfully."} />, { style: { padding: 0 } })
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast(<ErrorToast message={res?.messg ?? "Failed to update email."} />, { style: { padding: 0 } })
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
        style={{ width: "652px", maxWidth: "652px" }}
      >
        <div className="flex flex-col gap-6 p-6">
          {/* Header */}
          <DialogTitle
            style={{
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: "140%",
              color: "#09090B",
            }}
          >
            Edit Email Address
          </DialogTitle>

          <hr className="border-[#E4E4E7] -mx-6" />

          {/* Email input */}
          <div className="flex flex-col gap-3">
            <label
              style={{
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "140%",
                color: "#09090B",
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full border border-[#E4E4E7] rounded-lg px-4 h-12 text-base text-[#09090B] bg-white outline-none focus:border-[#0098DB] placeholder:text-grey"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <button
              onClick={handleUpdate}
              disabled={submitting || !email.trim()}
              style={{
                height: "44px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#0098DB",
                color: "#FAFAFA",
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "140%",
                opacity: submitting || !email.trim() ? 0.7 : 1,
              }}
            >
              {submitting ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
