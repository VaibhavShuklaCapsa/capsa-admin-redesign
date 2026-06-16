"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "./ui/dialog"
import { addAnchorSubAdmin } from "../services/anchorDetail"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "./toast"

const PRIVILEGES = [
  { key: "approve_reject_invoice", label: "Approve & Reject Invoice" },
  { key: "review_invoice",         label: "Review Invoice" },
  { key: "upload_invoice",         label: "Upload Invoice" },
  { key: "invite_vendor",          label: "Invite Vendor" },
  { key: "add_admin",              label: "Add Admin" },
]

const DEFAULT_PASSWORD = "Capsa@1234"

const labelStyle = { fontSize: "18px", fontWeight: 500, lineHeight: "140%", color: "#09090B" }
const inputStyle = {
  width: "100%", height: "52px", padding: "0 16px",
  border: "1px solid #E4E4E7", borderRadius: "8px",
  fontSize: "18px", fontWeight: 400, lineHeight: "140%",
  color: "#09090B", background: "#fff", outline: "none",
}

export default function AddAdminDialog({ open, onOpenChange, panNumber, onSuccess }) {
  const [email, setEmail]       = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [privileges, setPrivileges] = useState({
    approve_reject_invoice: false,
    review_invoice:         false,
    upload_invoice:         false,
    invite_vendor:          false,
    add_admin:              false,
  })
  const [submitting, setSubmitting] = useState(false)

  const reset = () => {
    setEmail(""); setFirstName(""); setLastName(""); setPassword("")
    setPrivileges({ approve_reject_invoice: false, review_invoice: false, upload_invoice: false, invite_vendor: false, add_admin: false })
  }

  const handleClose = () => { reset(); onOpenChange(false) }

  const togglePrivilege = (key) =>
    setPrivileges((prev) => ({ ...prev, [key]: !prev[key] }))

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const payload = {
        panNumber,
        email,
        firstName,
        lastName,
        password,
        ...Object.fromEntries(PRIVILEGES.filter((p) => privileges[p.key]).map((p) => [p.key, true])),
      }
      const res = await addAnchorSubAdmin(payload)
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg ?? "Admin added successfully."} />, { style: { padding: 0 } })
        handleClose()
        onSuccess?.()
      } else {
        toast(<ErrorToast message={res?.messg ?? "Failed to add admin."} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = email.trim() && firstName.trim() && lastName.trim() && password.trim()

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="p-0 gap-0 border border-[#E4E4E7] shadow-lg rounded-[8px] overflow-y-auto max-h-[90vh]"
        style={{ width: "480px", maxWidth: "480px" }}
      >
        <div className="flex flex-col gap-6 p-6">
          {/* Title */}
          <DialogTitle style={{ fontSize: "18px", fontWeight: 700, lineHeight: "140%", color: "#09090B" }}>
            Add Admin
          </DialogTitle>

          <hr className="border-[#E4E4E7] -mx-6" />

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label style={labelStyle}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email Address"
              style={{ ...inputStyle, color: email ? "#09090B" : undefined }}
              className="placeholder:text-[#71717A] focus:border-[#0098DB]"
            />
          </div>

          {/* First Name */}
          <div className="flex flex-col gap-2">
            <label style={labelStyle}>First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter First Name"
              style={inputStyle}
              className="placeholder:text-[#71717A] focus:border-[#0098DB]"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col gap-2">
            <label style={labelStyle}>Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter Last Name"
              style={inputStyle}
              className="placeholder:text-[#71717A] focus:border-[#0098DB]"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              style={inputStyle}
              className="placeholder:text-[#71717A] focus:border-[#0098DB]"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPassword(DEFAULT_PASSWORD)}
                style={{
                  color: "#0098DB", fontSize: "18px", fontWeight: 400,
                  lineHeight: "140%", textDecoration: "underline",
                  background: "none", border: "none", cursor: "pointer",
                }}
              >
                Set Default Password
              </button>
            </div>
          </div>

          <hr className="border-[#E4E4E7] -mx-6" />

          {/* Privileges */}
          <div className="flex flex-col gap-4">
            <p style={labelStyle}>Select Admin Privileges</p>
            {PRIVILEGES.map((priv) => (
              <label key={priv.key} className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => togglePrivilege(priv.key)}
                  style={{
                    width: "20px", height: "20px", borderRadius: "4px", flexShrink: 0,
                    border: privileges[priv.key] ? "1.167px solid #0098DB" : "1.167px solid #E4E4E7",
                    background: privileges[priv.key] ? "#0098DB" : "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  {privileges[priv.key] && (
                    <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                      <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontSize: "18px", fontWeight: 400, lineHeight: "140%", color: "#09090B" }}>
                  {priv.label}
                </span>
              </label>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={handleClose}
              style={{
                width: "135px", height: "44px", padding: "8px 16px",
                borderRadius: "8px", border: "1px solid #E4E4E7",
                background: "transparent", color: "#09090B",
                fontSize: "16px", fontWeight: 500, lineHeight: "140%",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              style={{
                width: "135px", height: "44px", padding: "8px 16px",
                borderRadius: "8px", background: "#0098DB",
                color: "#FAFAFA", fontSize: "16px", fontWeight: 500,
                lineHeight: "140%", opacity: !canSubmit || submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Adding..." : "Add Admin"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
