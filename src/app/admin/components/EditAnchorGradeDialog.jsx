"use client"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "./ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { editAnchorGrade } from "../services/anchorDetail"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "./toast"

const GRADE_OPTIONS = ["A", "B", "C", "D"]

export default function EditAnchorGradeDialog({ open, onOpenChange, panNumber, currentGrade, onSuccess }) {
  const [grade, setGrade]         = useState(currentGrade || "A")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (open) setGrade(currentGrade || "A")
  }, [open, currentGrade])

  const handleUpdate = async () => {
    setSubmitting(true)
    try {
      const res = await editAnchorGrade({ panNumber, grade })
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg ?? "Grade updated successfully."} />, { style: { padding: 0 } })
        onOpenChange(false)
        onSuccess?.()
      } else {
        toast(<ErrorToast message={res?.messg ?? "Failed to update grade."} />, { style: { padding: 0 } })
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
          <div className="flex items-center justify-between">
            <DialogTitle
              style={{
                fontSize: "18px",
                fontWeight: 700,
                lineHeight: "140%",
                color: "#09090B",
              }}
            >
              Edit Anchor Grade
            </DialogTitle>
          </div>

          <hr className="border-[#E4E4E7] -mx-6" />

          {/* Grade selector */}
          <div className="flex flex-col gap-3">
            <label
              style={{
                fontSize: "18px",
                fontWeight: 500,
                lineHeight: "140%",
                color: "#09090B",
              }}
            >
              Select Anchor Grade
            </label>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center justify-between w-full border border-[#E4E4E7] rounded-lg px-4 h-12 text-base bg-white focus:outline-none text-[#09090B]">
                  <span>{grade}</span>
                  <ChevronDown className="size-5 text-grey shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}>
                {GRADE_OPTIONS.map((g) => (
                  <DropdownMenuItem
                    key={g}
                    className="cursor-pointer text-base px-4 py-3"
                    onClick={() => setGrade(g)}
                  >
                    {g}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <button
              onClick={handleUpdate}
              disabled={submitting}
              style={{
                height: "44px",
                padding: "8px 16px",
                borderRadius: "8px",
                background: "#0098DB",
                color: "#FAFAFA",
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "140%",
                opacity: submitting ? 0.7 : 1,
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
