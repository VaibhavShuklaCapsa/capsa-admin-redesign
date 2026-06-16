"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "./ui/dialog"
import { changeAnchorRate, toggleAnchorRF } from "../services/anchorDetail"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "./toast"

export default function EnableRFDialog({ open, onOpenChange, panNumber, currentRate, onSuccess }) {
  const [rate, setRate]           = useState(currentRate ?? "")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) setRate(currentRate ?? "")
  }, [open, currentRate])

  const handleEnable = async () => {
    setSubmitting(true)
    try {
      const rateRes = await changeAnchorRate({ panNumber, rate: String(rate) })
      if (rateRes?.res !== "success") {
        toast(<ErrorToast message={rateRes?.messg ?? "Failed to set anchor rate."} />, { style: { padding: 0 } })
        return
      }
      const rfRes = await toggleAnchorRF({ panNumber, enabled: true })
      if (rfRes?.res === "success") {
        toast(<SuccessToast message={rfRes?.messg ?? "Reverse factoring enabled."} />, { style: { padding: 0 } })
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast(<ErrorToast message={rfRes?.messg ?? "Failed to enable reverse factoring."} />, { style: { padding: 0 } })
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
          <DialogTitle
            style={{ fontSize: "18px", fontWeight: 700, lineHeight: "140%", color: "#09090B" }}
          >
            Set Anchor Rate
          </DialogTitle>

          <hr className="border-[#E4E4E7] -mx-6" />

          <div className="flex flex-col gap-3">
            <label style={{ fontSize: "18px", fontWeight: 500, lineHeight: "140%", color: "#09090B" }}>
              Anchor Rate (%)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="0"
              className="w-full border border-[#E4E4E7] rounded-lg px-4 h-12 text-base text-[#09090B] bg-white outline-none focus:border-[#0098DB] placeholder:text-grey"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleEnable}
              disabled={submitting || rate === ""}
              style={{
                height: "44px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#0098DB",
                color: "#FAFAFA",
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "140%",
                opacity: submitting || rate === "" ? 0.7 : 1,
              }}
            >
              {submitting ? "Enabling..." : "Enable Reverse Factoring"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
