"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog"
import { deleteAnchorSubAdmin } from "../services/anchorDetail"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "./toast"

export default function DeleteAdminDialog({ open, onOpenChange, subAnchorAdmin, onSuccess }) {
  const [submitting, setSubmitting] = useState(false)

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      const res = await deleteAnchorSubAdmin(subAnchorAdmin)
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg ?? "Admin deleted successfully."} />, { style: { padding: 0 } })
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast(<ErrorToast message={res?.messg ?? "Failed to delete admin."} />, { style: { padding: 0 } })
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
          <DialogTitle style={{ fontSize: "18px", fontWeight: 700, lineHeight: "140%", color: "#09090B" }}>
            Delete Admin
          </DialogTitle>

          <p style={{ fontSize: "14px", fontWeight: 400, lineHeight: "140%", color: "#71717A" }}>
            Do you wish to proceed to delete this admin. This action is irreversible
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
              onClick={handleDelete}
              disabled={submitting}
              style={{
                height: "44px", padding: "8px 16px", borderRadius: "8px",
                background: "#B91C1C", color: "#FAFAFA",
                fontSize: "16px", fontWeight: 500, lineHeight: "140%",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Deleting..." : "Yes, Delete"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
