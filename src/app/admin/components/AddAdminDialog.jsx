"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "./ui/dialog"
import { Eye, EyeOff } from "lucide-react"
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

const labelStyle = {
  fontFamily: "Satoshi",
  fontSize: "18px",
  fontWeight: 500,
  lineHeight: "140%",
  color: "#09090B",
}

const inputStyle = {
  width: "100%",
  height: "52px",
  padding: "0 16px",
  border: "1px solid #E4E4E7",
  borderRadius: "8px",
  fontFamily: "Satoshi",
  fontSize: "18px",
  fontWeight: 400,
  lineHeight: "140%",
  color: "#09090B",
  background: "#fff",
  outline: "none",
}

export default function AddAdminDialog({ open, onOpenChange, panNumber, onSuccess }) {
  const [email, setEmail]         = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName]   = useState("")
  const [password, setPassword]   = useState("")
  const [privileges, setPrivileges] = useState({
    approve_reject_invoice: false,
    review_invoice:         false,
    upload_invoice:         false,
    invite_vendor:          false,
    add_admin:              false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting]     = useState(false)

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
        style={{
          width: "652px",
          maxWidth: "95vw",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "24px",
          borderRadius: "8px",
          border: "1px solid #E4E4E7",
          background: "#FFF",
          boxShadow: "0 4px 6px -4px rgba(16, 24, 40, 0.10), 0 10px 15px -3px rgba(0, 0, 0, 0.10)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Title */}
        <DialogTitle
          style={{
            fontFamily: "Satoshi",
            fontSize: "18px",
            fontWeight: 700,
            lineHeight: "140%",
            color: "#09090B",
            margin: 0,
          }}
        >
          Add Admin
        </DialogTitle>

        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
          <label style={labelStyle}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email Address"
            autoComplete="off"
            style={inputStyle}
            className="placeholder:text-[#71717A] placeholder:font-[Satoshi] focus:border-[#0098DB]"
          />
        </div>

        {/* First Name */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
          <label style={labelStyle}>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Enter First Name"
            autoComplete="off"
            style={inputStyle}
            className="placeholder:text-[#71717A] placeholder:font-[Satoshi] focus:border-[#0098DB]"
          />
        </div>

        {/* Last Name */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
          <label style={labelStyle}>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Enter Last Name"
            autoComplete="off"
            style={inputStyle}
            className="placeholder:text-[#71717A] placeholder:font-[Satoshi] focus:border-[#0098DB]"
          />
        </div>

        {/* Password */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
          <label style={labelStyle}>Password</label>
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              autoComplete="new-password"
              style={{ ...inputStyle, paddingRight: "48px" }}
              className="placeholder:text-[#71717A] placeholder:font-[Satoshi] focus:border-[#0098DB]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              style={{
                position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer", padding: 0,
                color: "#71717A", display: "flex", alignItems: "center",
              }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setPassword(DEFAULT_PASSWORD)}
              style={{
                fontFamily: "Satoshi",
                fontSize: "18px",
                fontWeight: 400,
                lineHeight: "140%",
                color: "#0098DB",
                textAlign: "right",
                textDecoration: "underline",
                textDecorationStyle: "solid",
                textDecorationSkipInk: "none",
                textDecorationThickness: "auto",
                textUnderlineOffset: "auto",
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: 0,
              }}
            >
              Set Default Password
            </button>
          </div>
        </div>

        {/* Privileges */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
          <p style={labelStyle}>Select Admin Privileges</p>
          {PRIVILEGES.map((priv) => (
            <label
              key={priv.key}
              style={{ display: "flex", padding: 0, alignItems: "flex-start", gap: "8px", cursor: "pointer" }}
            >
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
              <span style={{ fontFamily: "Satoshi", fontSize: "18px", fontWeight: 400, lineHeight: "140%", color: "#09090B" }}>
                {priv.label}
              </span>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", width: "100%" }}>
          <button
            onClick={handleClose}
            style={{
              height: "44px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #E4E4E7",
              background: "transparent",
              color: "#09090B",
              fontFamily: "Satoshi",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "140%",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            style={{
              width: "120px",
              height: "44px",
              padding: "8px 16px",
              borderRadius: "8px",
              background: "#0098DB",
              border: "none",
              color: "#FAFAFA",
              fontFamily: "Satoshi",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "140%",
              cursor: !canSubmit || submitting ? "not-allowed" : "pointer",
              opacity: !canSubmit || submitting ? 0.7 : 1,
              flexShrink: 0,
            }}
          >
            {submitting ? "Adding..." : "Add Admin"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
