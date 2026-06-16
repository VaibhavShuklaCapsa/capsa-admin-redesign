"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ChevronDown, Calendar } from "lucide-react"
import PageLoader from "../../components/ui/PageLoader"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { getEditInvoiceAnchorsList, getEditInvoiceDetails, updateEditInvoice } from "../../services/editInvoice"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "../../components/toast"

const fmtDateInput = (val) => {
  if (!val) return ""
  try { return new Date(val).toISOString().split("T")[0] } catch { return val }
}

const fmtCurrency = (val) => {
  if (val === null || val === undefined) return ""
  return Number(val).toLocaleString("en-NG", { maximumFractionDigits: 2 })
}

export default function EditInvoiceDetailsPage({ params }) {
  const router = useRouter()

  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [anchors, setAnchors]   = useState([])
  const [invoiceData, setInvoiceData] = useState(null)

  // Form fields
  const [selectedAnchor, setSelectedAnchor] = useState(null)   // { bvn, name }
  const [invoiceNumber, setInvoiceNumber]   = useState("")
  const [poNumber, setPoNumber]             = useState("")
  const [tenor, setTenor]                   = useState("")
  const [issueDate, setIssueDate]           = useState("")
  const [dueDate, setDueDate]               = useState("")
  const [invoiceAmount, setInvoiceAmount]   = useState("")
  const [sellNowPrice, setSellNowPrice]     = useState("")
  const [discountRate, setDiscountRate]     = useState("")
  const [details, setDetails]               = useState("")
  const [fileName, setFileName]             = useState("")
  const [newFile, setNewFile]               = useState(null)

  useEffect(() => {
    Promise.all([
      getEditInvoiceAnchorsList(),
      getEditInvoiceDetails(params.id),
    ]).then(([anchorsRes, detailRes]) => {
      const anchorList = anchorsRes?.data?.anchors ?? []
      setAnchors(anchorList)

      const d = detailRes?.data
      if (d) {
        setInvoiceData(d)
        const bi = d.basic_information ?? {}
        const ai = d.amount_information ?? {}
        const adi = d.additional_information ?? {}

        // Auto-select anchor by pan or name
        const match = anchorList.find(
          (a) => a.bvn === bi.anchor_pan || a.name === bi.anchor_name
        )
        setSelectedAnchor(match ?? { bvn: bi.anchor_pan, name: bi.anchor_name })

        setInvoiceNumber(bi.invoice_number ?? "")
        setPoNumber(bi.purchase_order_number ?? "")
        setTenor(String(bi.tenor ?? ""))
        setIssueDate(fmtDateInput(bi.issue_date))
        setDueDate(fmtDateInput(bi.due_date))
        setInvoiceAmount(String(ai.invoice_amount ?? ""))
        setSellNowPrice(String(ai.sell_now_price ?? ""))
        setDiscountRate(String(ai.discount_rate ?? ""))
        setDetails(adi.details ?? "")
        setFileName(adi.invoice_document_url ?? "")
      }
    }).catch(() => {
      toast(<ErrorToast message="Failed to load invoice details." />, { style: { padding: 0 } })
    }).finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = {
        deal_id:               params.id,
        invoice_number:        invoiceNumber,
        vendor_pan:            invoiceData?.vendor_pan ?? "",
        purchase_order_number: poNumber,
        issue_date:            issueDate,
        due_date:              dueDate,
        invoice_amount:        Number(invoiceAmount),
        sell_now_price:        Number(sellNowPrice),
        discount_rate:         Number(discountRate),
        details,
        ...(selectedAnchor?.bvn && selectedAnchor.bvn !== invoiceData?.basic_information?.anchor_pan
          ? { anchor_bvn: selectedAnchor.bvn }
          : {}),
        ...(newFile ? { invoice_document_url: newFile.name } : {}),
      }

      const res = await updateEditInvoice(payload)
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg ?? "Invoice updated successfully."} />, { style: { padding: 0 } })
        router.push("/admin/edit-invoice")
        router.refresh()
      } else {
        toast(<ErrorToast message={res?.messg ?? "Failed to update invoice."} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader />

  const ai = invoiceData?.amount_information ?? {}

  return (
    <section className="space-y-6">
      <Image
        src="/icons/left-arrow.svg"
        width={24} height={24}
        alt="Go back"
        className="cursor-pointer"
        onClick={() => router.back()}
      />

      <header>
        <h2 className="text-2xl font-bold text-customBlack">Edit Invoice Details</h2>
      </header>

      {/* Basic Information */}
      <div className="bg-white border border-borderGrey rounded-xl p-6 space-y-6">
        <h3 className="text-base font-semibold text-customBlack">Basic Information</h3>

        <div className="grid grid-cols-3 gap-4">
          {/* Anchor dropdown */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-customBlack">Anchor <span className="text-[#EF4444]">*</span></label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button style={{ width: "100%" }} className="flex items-center justify-between border border-borderGrey rounded-lg px-4 h-11 text-sm bg-white focus:outline-none">
                  <span className={selectedAnchor?.name ? "text-customBlack" : "text-grey"}>
                    {selectedAnchor?.name || "Select Anchor"}
                  </span>
                  <ChevronDown className="size-4 text-grey shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }} className="max-h-60 overflow-y-auto">
                {anchors.map((a) => (
                  <DropdownMenuItem key={a.bvn} className="cursor-pointer" onClick={() => setSelectedAnchor(a)}>
                    {a.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Invoice Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-customBlack">Invoice Number <span className="text-[#EF4444]">*</span></label>
            <Input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className="h-11 border-borderGrey" />
          </div>

          {/* Purchase Order Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-customBlack">Purchase Order Number <span className="text-[#EF4444]">*</span></label>
            <Input value={poNumber} onChange={(e) => setPoNumber(e.target.value)} className="h-11 border-borderGrey" />
          </div>

          {/* Tenor */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-customBlack">Tenor (Days) <span className="text-[#EF4444]">*</span></label>
            <Input value={tenor} onChange={(e) => setTenor(e.target.value)} className="h-11 border-borderGrey" />
          </div>

          {/* Issue Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-customBlack">Issue Date <span className="text-[#EF4444]">*</span></label>
            <div className="flex items-center border border-borderGrey rounded-lg px-4 h-11 gap-2 bg-white">
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="flex-1 outline-none text-sm text-customBlack bg-transparent"
              />
              <Calendar className="size-4 text-grey shrink-0 pointer-events-none" />
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-customBlack">Due Date <span className="text-[#EF4444]">*</span></label>
            <div className="flex items-center border border-borderGrey rounded-lg px-4 h-11 gap-2 bg-white">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex-1 outline-none text-sm text-customBlack bg-transparent"
              />
              <Calendar className="size-4 text-grey shrink-0 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Amount Information */}
      <div className="bg-white border border-borderGrey rounded-xl p-6">
        <h3 className="text-base font-semibold text-customBlack mb-6">Amount Information</h3>
        <div className="flex gap-6">
          <div className="flex-1 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-customBlack">Invoice Amount <span className="text-[#EF4444]">*</span></label>
              <div className="flex items-center border border-borderGrey rounded-lg px-4 h-11 gap-2 bg-white">
                <span className="text-grey text-sm">₦</span>
                <input type="number" value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value)} className="flex-1 outline-none text-sm text-customBlack bg-transparent" />
              </div>
              <p className="text-xs text-grey">Invoice amount should not include VAT fee</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-customBlack">Sell Now Price</label>
              <div className="flex items-center border border-borderGrey rounded-lg px-4 h-11 gap-2 bg-white">
                <span className="text-grey text-sm">₦</span>
                <input type="number" value={sellNowPrice} onChange={(e) => setSellNowPrice(e.target.value)} className="flex-1 outline-none text-sm text-customBlack bg-transparent" />
              </div>
              <p className="text-xs text-grey">Investors can instantly buy invoice at your set price</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-customBlack">Discount Rate (%)</label>
              <Input type="number" value={discountRate} onChange={(e) => setDiscountRate(e.target.value)} className="h-11 border-borderGrey" />
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="w-96 bg-[#EBF6FB] rounded-xl p-5 space-y-3">
            <p className="text-sm font-semibold text-customBlack">Price Breakdown</p>
            <div className="flex justify-between text-sm">
              <span className="text-grey">Discount Rate</span>
              <span className="text-tableGrey">{ai.discount_rate ?? "—"}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-grey">Capsa Processing Fees</span>
              <span className="text-tableGrey">₦{fmtCurrency(ai.capsa_processing_fees)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-grey">V.A.T ({ai.vat_rate_percent ?? 7.5}%)</span>
              <span className="text-tableGrey">₦{fmtCurrency(ai.vat)}</span>
            </div>
            <div className="flex justify-between text-sm pt-1">
              <span className="text-grey">Net Amount for Sell Now Option</span>
              <span className="text-xl font-bold text-customBlack">₦{fmtCurrency(ai.net_amount_sell_now)}</span>
            </div>
            <p className="text-xs text-grey pt-1">This is the amount you will receive after platform fee and VAT has been deducted</p>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="bg-white border border-borderGrey rounded-xl p-6 space-y-5">
        <h3 className="text-base font-semibold text-customBlack">Additional Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-customBlack">Details <span className="text-[#EF4444]">*</span></label>
            <Input value={details} onChange={(e) => setDetails(e.target.value)} className="h-11 border-borderGrey" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-customBlack">Invoice Document</label>
            <div className="flex items-center border border-borderGrey rounded-lg px-4 h-11 gap-3 bg-white">
              <label className="cursor-pointer flex items-center gap-2 flex-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-grey shrink-0">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span className="text-sm text-grey">Choose file</span>
                <span className="text-sm text-tableGrey truncate">{newFile ? newFile.name : fileName}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) { setNewFile(f); setFileName(f.name) }
                  }}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pb-4">
        <Button className="bg-blue hover:bg-blue/90 text-white h-11 px-8" disabled={saving} onClick={handleSave}>
          {saving ? "Saving..." : "Save Invoice"}
        </Button>
      </div>
    </section>
  )
}
