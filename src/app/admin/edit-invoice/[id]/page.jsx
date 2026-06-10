"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
import { getEditInvoiceDetails, getAnchorOptions, saveEditedInvoice } from "../../services/editInvoice"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "../../components/toast"

// Fallback full invoice data (used when API fails)
const MOCK_INVOICE = {
  anchor:              "International Breweries",
  invoiceNumber:       "INV0001",
  purchaseOrderNumber: "PO-0001",
  tenor:               "30",
  issueDate:           "May 30, 2025",
  dueDate:             "June 29, 2025",
  invoiceAmount:       "25,000,000",
  sellNowPrice:        "23,900,000",
  details:             "Goods and Services",
  invoiceDocument:     "example.png",
  priceBreakdown: {
    discountRate:        "4.40%",
    capsaProcessingFees: "₦212,500.00",
    vat:                 "₦15,937.50",
    netAmount:           "₦23,671,562.50",
  },
}

export default function EditInvoiceDetailsPage({ params }) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const [anchorOptions, setAnchorOptions] = useState([])
  const [invoiceData, setInvoiceData] = useState(null)

  // Form fields
  const [anchor, setAnchor]               = useState("")
  const [invoiceNumber, setInvoiceNumber] = useState("")
  const [poNumber, setPoNumber]           = useState("")
  const [tenor, setTenor]                 = useState("")
  const [issueDate, setIssueDate]         = useState("")
  const [dueDate, setDueDate]             = useState("")
  const [invoiceAmount, setInvoiceAmount] = useState("")
  const [sellNowPrice, setSellNowPrice]   = useState("")
  const [details, setDetails]             = useState("")
  const [fileName, setFileName]           = useState("")

  useEffect(() => {
    // Parse row data passed from the list page via query param
    let passedRow = null
    const rawData = searchParams.get("data")
    if (rawData) {
      try { passedRow = JSON.parse(decodeURIComponent(rawData)) } catch {}
    }

    // Run both fetches in parallel
    Promise.all([
      getEditInvoiceDetails({ id: params.id, ...(passedRow ?? {}), ...MOCK_INVOICE }),
      getAnchorOptions(),
    ]).then(([invoiceRes, anchorsRes]) => {
      // Resolve full invoice data — API response takes priority, fallback to mock
      const fullData = (invoiceRes?.anchor || invoiceRes?.invoiceNumber) ? invoiceRes : MOCK_INVOICE

      // Anchor options: normalise to array of { id, name }
      const normAnchors = anchorsRes.map((a) =>
        typeof a === "string" ? { id: a, name: a } : a
      )
      setAnchorOptions(normAnchors)

      // Auto-select anchor: match passed row's anchorName or fullData.anchor against options
      const anchorToMatch = passedRow?.anchorName ?? fullData.anchor ?? ""
      const matched = normAnchors.find(
        (a) => a.name.toLowerCase() === anchorToMatch.toLowerCase()
      )
      setAnchor(matched ? matched.name : anchorToMatch)

      // Populate remaining fields — passed row fills what's available, API fills the rest
      setInvoiceNumber(passedRow?.invoiceNo   ?? fullData.invoiceNumber       ?? "")
      setPoNumber(fullData.purchaseOrderNumber ?? "")
      setTenor(passedRow?.tenor               ?? fullData.tenor               ?? "")
      setIssueDate(fullData.issueDate         ?? "")
      setDueDate(passedRow?.dueDate           ?? fullData.dueDate             ?? "")
      setInvoiceAmount(passedRow?.amount?.replace(/,/g, "") ?? fullData.invoiceAmount ?? "")
      setSellNowPrice(fullData.sellNowPrice   ?? "")
      setDetails(fullData.details             ?? "")
      setFileName(fullData.invoiceDocument    ?? "")
      setInvoiceData(fullData)
      setLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await saveEditedInvoice({ id: params.id, anchor, invoiceNumber, poNumber, tenor, issueDate, dueDate, invoiceAmount, sellNowPrice, details })
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
      } else {
        toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <Image
        src="/icons/left-arrow.svg"
        width={24}
        height={24}
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
          {/* Anchor — populated from API, auto-selected */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-customBlack">Anchor <span className="text-[#EF4444]">*</span></label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button style={{ width: "100%" }} className="flex items-center justify-between border border-borderGrey rounded-lg px-4 h-11 text-sm bg-white focus:outline-none">
                  <span className={anchor ? "text-customBlack" : "text-grey"}>{anchor || "Select Anchor"}</span>
                  <ChevronDown className="size-4 text-grey shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}>
                {anchorOptions.map((opt) => (
                  <DropdownMenuItem key={opt.id} className="cursor-pointer" onClick={() => setAnchor(opt.name)}>
                    {opt.name}
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
                type="text"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="flex-1 outline-none text-sm text-customBlack bg-transparent"
              />
              <Calendar className="size-4 text-grey shrink-0" />
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-customBlack">Due Date <span className="text-[#EF4444]">*</span></label>
            <div className="flex items-center border border-borderGrey rounded-lg px-4 h-11 gap-2 bg-white">
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex-1 outline-none text-sm text-customBlack bg-transparent"
              />
              <Calendar className="size-4 text-grey shrink-0" />
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
                <input type="text" value={invoiceAmount} onChange={(e) => setInvoiceAmount(e.target.value)} className="flex-1 outline-none text-sm text-customBlack bg-transparent" />
              </div>
              <p className="text-xs text-grey">Invoice amount should not include VAT fee</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-customBlack">Sell Now Price</label>
              <div className="flex items-center border border-borderGrey rounded-lg px-4 h-11 gap-2 bg-white">
                <span className="text-grey text-sm">₦</span>
                <input type="text" value={sellNowPrice} onChange={(e) => setSellNowPrice(e.target.value)} className="flex-1 outline-none text-sm text-customBlack bg-transparent" />
              </div>
              <p className="text-xs text-grey">Investors can instantly buy invoice at your set price</p>
            </div>
          </div>

          <div className="w-96 bg-[#EBF6FB] rounded-xl p-5 space-y-3">
            <p className="text-sm font-semibold text-customBlack">Price Breakdown</p>
            <div className="flex justify-between text-sm">
              <span className="text-grey">Discount Rate</span>
              <span className="text-tableGrey">{invoiceData.priceBreakdown.discountRate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-grey">Capsa Processing Fees</span>
              <span className="text-tableGrey">{invoiceData.priceBreakdown.capsaProcessingFees}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-grey">V.A.T (7.5%)</span>
              <span className="text-tableGrey">{invoiceData.priceBreakdown.vat}</span>
            </div>
            <div className="flex justify-between text-sm pt-1">
              <span className="text-grey">Net Amount for Sell Now Option</span>
              <span className="text-xl font-bold text-customBlack">{invoiceData.priceBreakdown.netAmount}</span>
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
            <label className="text-sm font-medium text-customBlack">Invoice Document <span className="text-[#EF4444]">*</span></label>
            <div className="flex items-center border border-borderGrey rounded-lg px-4 h-11 gap-3 bg-white">
              <label className="cursor-pointer flex items-center gap-2 flex-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-grey shrink-0">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                <span className="text-sm text-grey">Choose file</span>
                <span className="text-sm text-tableGrey">{fileName}</span>
                <input type="file" className="hidden" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? fileName)} />
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
