"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "../../components/toast"
import { addAnchorBusinessInfo, addAnchorDocuments } from "../../services/anchorAdd"

const labelStyle = { fontSize: "14px", fontWeight: 500, lineHeight: "140%", color: "#09090B" }
const inputStyle = {
  width: "100%", height: "48px", padding: "0 14px",
  border: "1px solid #E4E4E7", borderRadius: "8px",
  fontSize: "14px", color: "#09090B", background: "#fff", outline: "none",
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label style={labelStyle}>
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      {children}
    </div>
  )
}

function TextInput({ placeholder, value, onChange, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
      className="placeholder:text-[#A1A1AA] focus:border-[#0098DB]"
    />
  )
}

function SelectInput({ placeholder, value, onChange, options = [] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...inputStyle, appearance: "none", cursor: "pointer", color: value ? "#09090B" : "#A1A1AA" }}
        className="focus:border-[#0098DB]"
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 6L8 10L12 6" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}

function FileUpload({ label, required, value, onChange }) {
  const ref = useRef(null)
  return (
    <Field label={label} required={required}>
      <div
        onClick={() => ref.current?.click()}
        className="flex items-center gap-3 px-4 cursor-pointer"
        style={{ height: "52px", border: "1px solid #E4E4E7", borderRadius: "8px", background: "#fff" }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
          <path d="M13.5 7.5H14.5C15.6046 7.5 16.5 8.39543 16.5 9.5V15.5C16.5 16.6046 15.6046 17.5 14.5 17.5H5.5C4.39543 17.5 3.5 16.6046 3.5 15.5V9.5C3.5 8.39543 4.39543 7.5 5.5 7.5H6.5" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M10 2.5V12.5M10 2.5L7.5 5M10 2.5L12.5 5" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: "14px", color: value ? "#09090B" : "#A1A1AA" }}>
          {value ? value.name : "Choose file   No file chosen"}
        </span>
        <input ref={ref} type="file" className="hidden" onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
      </div>
    </Field>
  )
}

const COMPANY_TYPE_OPTIONS = [
  { value: "private_limited",  label: "Private Limited" },
  { value: "public_limited",   label: "Public Limited" },
  { value: "sole_proprietor",  label: "Sole Proprietor" },
  { value: "partnership",      label: "Partnership" },
]

const COVERAGE_OPTIONS = [
  { value: "local",        label: "Local" },
  { value: "national",     label: "National" },
  { value: "international", label: "International" },
]

// Step 1 required keys that map to API fields
const STEP1_REQUIRED = [
  "bvn", "rcNumber", "companyName", "industry", "email", "contact",
  "address", "city", "state", "founded", "keyPerson",
]

export default function AddAnchorPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  const [form, setForm] = useState({
    bvn: "", rcNumber: "", companyName: "", industry: "",
    sector: "", natureOfBusiness: "", product: "",
    registeredAddress: "", city: "", state: "",
    operationalAddress: "", email: "", contact: "",
    companyType: "", coverage: "", shareholdingStructure: "",
    founded: "", taxId: "", additionalInfo: "",
    keyPerson: "", keyContactDept: "",
    keyPersonEmail: "", keyPersonPhone: "",
  })

  const [financialReport, setFinancialReport] = useState(null)
  const [balanceSheet, setBalanceSheet]       = useState(null)
  const [profitLoss, setProfitLoss]           = useState(null)
  const [submitting, setSubmitting]           = useState(false)

  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }))

  const step1Valid = STEP1_REQUIRED.every((k) => form[k]?.trim?.())
  const step2Valid = financialReport && balanceSheet && profitLoss

  const handleSubmit = async () => {
    if (!step2Valid || submitting) return
    setSubmitting(true)
    try {
      // API 1 — business info (JSON)
      const infoPayload = {
        bvn:              form.bvn,
        rc_number:        form.rcNumber,
        company_name:     form.companyName,
        industry:         form.industry,
        email:            form.email,
        contact:          form.contact,
        country_code:     "234",
        address:          form.registeredAddress || form.address,
        city:             form.city,
        state:            form.state,
        founded:          form.founded,
        key_person:       form.keyPerson,
        key_person_email: form.keyPersonEmail || undefined,
        key_person_phone: form.keyPersonPhone || undefined,
        tin:              form.taxId || undefined,
        business_type:    form.companyType || undefined,
      }

      const res1 = await addAnchorBusinessInfo(infoPayload)
      if (res1?.res !== "success") {
        toast(<ErrorToast message={res1?.messg ?? "Failed to save business information."} />, { style: { padding: 0 } })
        return
      }

      // API 2 — documents (multipart)
      const res2 = await addAnchorDocuments({
        bvn: form.bvn,
        financialReport,
        balanceSheet,
        profitLoss,
      })

      if (res2?.res === "success") {
        toast(<SuccessToast message={res2?.messg ?? "Anchor added successfully."} />, { style: { padding: 0 } })
        router.push("/admin/anchors")
        router.refresh()
      } else {
        toast(<ErrorToast message={res2?.messg ?? "Failed to upload documents."} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="space-y-6 max-w-5xl">
      <Image
        src="/icons/left-arrow.svg"
        width={24} height={24}
        alt="Go back"
        className="cursor-pointer"
        onClick={() => (step === 2 ? setStep(1) : router.back())}
      />

      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Add Anchor</h2>
        <p className="text-sm text-grey">All fields are required except indicated otherwise</p>
      </header>

      {/* ── Step 1: Business Information ── */}
      {step === 1 && (
        <div className="bg-white border border-borderGrey rounded-2xl p-8 space-y-6">
          <h3 className="text-base font-semibold text-customBlack">Business Information</h3>

          <div className="grid grid-cols-2 gap-6">
            <Field label="Company Name" required>
              <TextInput placeholder="Enter Company Name" value={form.companyName} onChange={set("companyName")} />
            </Field>
            <Field label="RC Number" required>
              <TextInput placeholder="Enter RC Number" value={form.rcNumber} onChange={set("rcNumber")} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Field label="BVN" required>
              <TextInput placeholder="Enter BVN" value={form.bvn} onChange={set("bvn")} />
            </Field>
            <Field label="Industry" required>
              <TextInput placeholder="Enter Industry" value={form.industry} onChange={set("industry")} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Field label="Sector">
              <TextInput placeholder="Enter Sector" value={form.sector} onChange={set("sector")} />
            </Field>
            <Field label="Nature of Business">
              <TextInput placeholder="Enter Nature of Business" value={form.natureOfBusiness} onChange={set("natureOfBusiness")} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Field label="Product">
              <TextInput placeholder="Enter Product" value={form.product} onChange={set("product")} />
            </Field>
            <Field label="Type of Company">
              <SelectInput placeholder="Select Company Type" value={form.companyType} onChange={set("companyType")} options={COMPANY_TYPE_OPTIONS} />
            </Field>
          </div>

          <Field label="Registered Address" required>
            <TextInput placeholder="Enter Company Address" value={form.registeredAddress} onChange={set("registeredAddress")} />
          </Field>

          <div className="grid grid-cols-2 gap-6">
            <Field label="City" required>
              <TextInput placeholder="Enter City" value={form.city} onChange={set("city")} />
            </Field>
            <Field label="State" required>
              <TextInput placeholder="Enter State" value={form.state} onChange={set("state")} />
            </Field>
          </div>

          <Field label="Business (Operational) Address">
            <TextInput placeholder="Enter Company Address" value={form.operationalAddress} onChange={set("operationalAddress")} />
          </Field>

          <div className="grid grid-cols-2 gap-6">
            <Field label="Email Address" required>
              <TextInput placeholder="Enter Email Address" value={form.email} onChange={set("email")} type="email" />
            </Field>
            <Field label="Contact Number" required>
              <TextInput placeholder="Enter Mobile Number" value={form.contact} onChange={set("contact")} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Field label="Coverage">
              <SelectInput placeholder="Select Coverage" value={form.coverage} onChange={set("coverage")} options={COVERAGE_OPTIONS} />
            </Field>
            <Field label="Date Founded" required>
              <input
                type="date"
                value={form.founded}
                onChange={(e) => set("founded")(e.target.value)}
                style={{ ...inputStyle, color: form.founded ? "#09090B" : "#A1A1AA" }}
                className="focus:border-[#0098DB]"
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Field label="Shareholding Structure">
              <TextInput placeholder="Enter major shareholders" value={form.shareholdingStructure} onChange={set("shareholdingStructure")} />
            </Field>
            <Field label="Tax ID Number">
              <TextInput placeholder="Enter Tax ID Number" value={form.taxId} onChange={set("taxId")} />
            </Field>
          </div>

          <Field label="Additional Information">
            <TextInput placeholder="Enter Additional Information" value={form.additionalInfo} onChange={set("additionalInfo")} />
          </Field>

          <div className="grid grid-cols-2 gap-6">
            <Field label="Key Contact Person" required>
              <TextInput placeholder="Enter Key Person" value={form.keyPerson} onChange={set("keyPerson")} />
            </Field>
            <Field label="Key Contact's Department">
              <TextInput placeholder="Enter Department" value={form.keyContactDept} onChange={set("keyContactDept")} />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Field label="Key Contact Email Address">
              <TextInput placeholder="Enter Email Address" value={form.keyPersonEmail} onChange={set("keyPersonEmail")} type="email" />
            </Field>
            <Field label="Key Contact Mobile Number">
              <TextInput placeholder="Enter Mobile Number" value={form.keyPersonPhone} onChange={set("keyPersonPhone")} />
            </Field>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => router.back()}
              style={{
                height: "44px", padding: "8px 24px", borderRadius: "8px",
                border: "1px solid #E4E4E7", background: "transparent",
                color: "#09090B", fontSize: "15px", fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => step1Valid && setStep(2)}
              disabled={!step1Valid}
              style={{
                height: "44px", padding: "8px 32px", borderRadius: "8px",
                background: "#0098DB", color: "#fff",
                fontSize: "15px", fontWeight: 500,
                opacity: step1Valid ? 1 : 0.5,
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Upload Business Document ── */}
      {step === 2 && (
        <div className="bg-white border border-borderGrey rounded-2xl p-8 space-y-6">
          <h3 className="text-base font-semibold text-customBlack">Upload Business Document</h3>

          <FileUpload label="Upload Financial Report" required value={financialReport} onChange={setFinancialReport} />
          <FileUpload label="Upload Balance Sheet" required value={balanceSheet} onChange={setBalanceSheet} />
          <FileUpload label="Upload Profit and Loss Statement" required value={profitLoss} onChange={setProfitLoss} />

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setStep(1)}
              disabled={submitting}
              style={{
                height: "44px", padding: "8px 24px", borderRadius: "8px",
                border: "1px solid #E4E4E7", background: "transparent",
                color: "#09090B", fontSize: "15px", fontWeight: 500,
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!step2Valid || submitting}
              style={{
                height: "44px", padding: "8px 32px", borderRadius: "8px",
                background: "#0098DB", color: "#fff",
                fontSize: "15px", fontWeight: 500,
                opacity: step2Valid && !submitting ? 1 : 0.5,
              }}
            >
              {submitting ? "Submitting..." : "Generate Anchor Scorecard"}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
