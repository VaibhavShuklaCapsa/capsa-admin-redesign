"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FileText, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { SuccessToast, ErrorToast } from "../../components/toast"
import { addGuarantor } from "../../services/guarantors"

export default function AddGuarantorPage() {
  const router = useRouter()
  const [companyName, setCompanyName]         = useState("")
  const [rcNumber, setRcNumber]               = useState("")
  const [industry, setIndustry]               = useState("")
  const [financialReport, setFinancialReport] = useState(null)
  const [submitting, setSubmitting]           = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    const formData = new FormData()
    formData.append("name", companyName)
    formData.append("rc_number", rcNumber)
    formData.append("industry", industry)
    if (financialReport) {
      formData.append("financial_report", financialReport) // API field: financial_report
    }

    try {
      const res = await addGuarantor(formData)
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
        router.push("/admin/guarantors")
      } else {
        toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="space-y-8">
      <Image
        src="/icons/left-arrow.svg"
        width={24}
        height={24}
        alt="Go back"
        className="cursor-pointer"
        onClick={() => router.back()}
      />

      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Add Guarantor</h2>
        <p className="text-sm text-customBlack">All fields are required except indicated otherwise</p>
      </header>

      <form onSubmit={handleSubmit} className="bg-white border border-borderGrey rounded-2xl p-6 space-y-8">
        <section className="grid grid-cols-2 gap-8">
          <label className="space-y-2 text-base font-semibold text-customBlack">
            Company Name <span className="text-[#EF4444]">*</span>
            <Input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter Company Name"
              className="h-12 border-borderGrey text-base font-normal"
              required
            />
          </label>

          <label className="space-y-2 text-base font-semibold text-customBlack">
            RC Number <span className="text-[#EF4444]">*</span>
            <Input
              value={rcNumber}
              onChange={(e) => setRcNumber(e.target.value)}
              placeholder="Enter RC Number"
              className="h-12 border-borderGrey text-base font-normal"
              required
            />
          </label>

          <label className="space-y-2 text-base font-semibold text-customBlack">
            Industry <span className="text-[#EF4444]">*</span>
            <Input
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Enter Industry"
              className="h-12 border-borderGrey text-base font-normal"
              required
            />
          </label>
        </section>

        <label className="block space-y-2 text-base font-semibold text-customBlack">
          Upload Financial Report <span className="text-[#EF4444]">*</span>
          <div className="relative flex items-center gap-3 rounded-md border border-borderGrey bg-white px-4 h-12 text-base font-normal cursor-pointer">
            <FileText className="size-5" />
            <span className="font-semibold">Choose file</span>
            <span className="text-customBlack">{financialReport?.name ?? "No file chosen"}</span>
            <input
              type="file"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => setFinancialReport(e.target.files?.[0] ?? null)}
              required
            />
          </div>
        </label>

        <footer className="flex justify-end gap-4 pt-2">
          <Button
            type="button"
            variant="outline"
            className="h-12 px-6 text-base"
            onClick={() => router.push("/admin/guarantors")}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue hover:bg-blue/90 text-white h-12 px-6 text-base min-w-[140px]"
            disabled={submitting}
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : "Add Guarantor"}
          </Button>
        </footer>
      </form>
    </section>
  )
}
