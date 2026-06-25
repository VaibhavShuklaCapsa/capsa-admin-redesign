"use client"

import { useEffect, useState } from "react"
import { ChevronDown, MoreHorizontal, Search } from "lucide-react"
import { format } from "date-fns"
import DateRangePicker from "../components/ui/DateRangePicker"
import Pagination from "../components/Pagination/Pagination"
import PageLoader from "../components/ui/PageLoader"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { getAdminAssetList, reviewAdminAsset } from "../services/adminAssets"
import { toast } from "react-toastify"
import { ErrorToast, SuccessToast } from "../components/toast"

const PAGE_SIZE = 10

const TYPE_OPTIONS = [
  { label: "All Assets",                    value: "all"              },
  { label: "Assets Pending Approval",       value: "pending"          },
  { label: "Live Assets",                   value: "live"             },
  { label: "Open Assets for Repayment",     value: "open_repayment"   },
  { label: "Secondary Market Assets",       value: "secondary_market" },
  { label: "Closed Assets",                value: "closed"           },
  { label: "Overdue Assets",               value: "overdue"          },
]

const fmtDate = (iso) => {
  if (!iso || iso === "0000-00-00 00:00:00") return ""
  try { return format(new Date(iso), "MMM d, yyyy") } catch { return iso }
}

const fmtNum = (val) => {
  if (val === null || val === undefined || val === "") return ""
  return Number(val).toLocaleString("en-NG", { maximumFractionDigits: 2 })
}

const STATUS_STYLES = {
  Live:    "bg-[#EBF6FB] text-blue",
  Pending: "bg-[#FEF3C7] text-[#D97706]",
  Closed:  "bg-[#F4F4F5] text-[#71717A]",
  Overdue: "bg-[#FEE2E2] text-[#EF4444]",
}

function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] ?? "bg-[#F4F4F5] text-[#71717A]"
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${cls}`}>
      {status}
    </span>
  )
}

function ReviewField({ label, value, isNaira = false }) {
  const hasValue = value !== null && value !== undefined && value !== ""
  return (
    <div className="flex flex-col gap-2 w-full">
      <span style={{ fontFamily: "Satoshi", fontSize: "18px", fontWeight: 500, lineHeight: "140%", color: "#09090B" }}>{label}</span>
      <div style={{ border: "1px solid #E4E4E7", borderRadius: "8px", padding: "14px 16px", background: "#fff" }}>
        {isNaira ? (
          <span style={{ fontFamily: "Satoshi", fontSize: "18px", fontWeight: 400, lineHeight: "140%", color: hasValue ? "#09090B" : "#71717A" }}>
            {hasValue ? <>&#8358;&nbsp;&nbsp;{value}</> : "—"}
          </span>
        ) : (
          <span style={{ fontFamily: "Satoshi", fontSize: "18px", fontWeight: 400, lineHeight: "140%", color: hasValue ? "#09090B" : "#71717A" }}>
            {hasValue ? value : "—"}
          </span>
        )}
      </div>
    </div>
  )
}

export default function AssetsPage() {
  const [loading, setLoading]         = useState(true)
  const [assets, setAssets]           = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch]           = useState("")
  const [typeFilter, setTypeFilter]   = useState(TYPE_OPTIONS[0])
  const [fromDate, setFromDate]       = useState("")
  const [toDate, setToDate]           = useState("")
  const [reviewOpen, setReviewOpen]       = useState(false)
  const [reviewRow, setReviewRow]         = useState(null)
  const [reviewAction, setReviewAction]   = useState(null) // 'approve' | 'reject' | null

  const fetchData = async ({ page = 1, searchVal = "", type = "all", from = "", to = "" }) => {
    const res = await getAdminAssetList({ page_number: page, page_size: PAGE_SIZE, type, search: searchVal, from_date: from, to_date: to })
    setAssets(res.data?.asset_list ?? [])
    setTotalPages(res.data?.pagination?.total_pages ?? 1)
    return res
  }

  const showErrorToast = (res) => {
    if (res?.res !== "success" && res?.messg) {
      toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
    }
  }

  useEffect(() => {
    fetchData({ page: 1 })
      .then((res) => { showErrorToast(res); setLoading(false) })
      .catch(() => { /* keep PageLoader */ })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePageChange = (page) => { setCurrentPage(page); fetchData({ page, searchVal: search, type: typeFilter.value, from: fromDate, to: toDate }).then(showErrorToast).catch(() => {}) }
  const handleSearch = (val) => { setSearch(val); setCurrentPage(1); fetchData({ page: 1, searchVal: val, type: typeFilter.value, from: fromDate, to: toDate }).then(showErrorToast).catch(() => {}) }
  const handleTypeChange = (opt) => { setTypeFilter(opt); setCurrentPage(1); fetchData({ page: 1, searchVal: search, type: opt.value, from: fromDate, to: toDate }).then(showErrorToast).catch(() => {}) }

  const handleAssetReview = async (action) => {
    if (reviewAction) return
    setReviewAction(action)
    try {
      const res = await reviewAdminAsset({ asset_id: reviewRow?.asset_id, action })
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg || (action === "approve" ? "Asset approved." : "Asset rejected.")} />, { style: { padding: 0 } })
        setReviewOpen(false)
        fetchData({ page: currentPage, searchVal: search, type: typeFilter.value, from: fromDate, to: toDate }).then(showErrorToast).catch(() => {})
      } else {
        toast(<ErrorToast message={res?.messg || "Something went wrong."} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong." />, { style: { padding: 0 } })
    } finally {
      setReviewAction(null)
    }
  }
  const handleDateChange = (range) => {
    if (!range?.from || !range?.to) return
    const from = format(range.from, "yyyy-MM-dd")
    const to   = format(range.to,   "yyyy-MM-dd")
    setFromDate(from); setToDate(to); setCurrentPage(1)
    fetchData({ page: 1, searchVal: search, type: typeFilter.value, from, to }).then(showErrorToast).catch(() => {})
  }

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <section>
          <h2 className="text-2xl font-bold text-customBlack mb-1">Assets</h2>
          <p className="text-sm text-grey">Showing all assets</p>
        </section>
        <section className="flex items-center gap-3">
          <DateRangePicker label="Select Date Range" showChevron onChange={handleDateChange} />
          <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
        </section>
      </header>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <div className="flex items-center justify-end gap-3 p-4 border-b border-borderGrey">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Search by series details" className="pl-9 h-10 border-borderGrey bg-white" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 border-borderGrey min-w-[220px] justify-between">
                {typeFilter.label}<ChevronDown className="size-4 text-grey" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[220px]">
              {TYPE_OPTIONS.map((opt) => (
                <DropdownMenuItem key={opt.value} className="cursor-pointer" onClick={() => handleTypeChange(opt)}>{opt.label}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto bg-white">
          <table className="min-w-[1800px] w-full text-sm">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Series Details</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Seller</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Unit Value (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">No of Units</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Total Value (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Units Sold</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Issue Date</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Maturity Date</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Discounted On</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Status</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Seller Fee (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor Fee (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Total Fee (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Net Amount (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Prorated Charges (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-borderGrey">
              {assets.length === 0 ? (
                <tr><td colSpan={17} className="text-center py-16 text-grey text-sm">No assets found.</td></tr>
              ) : (
                assets.map((row, i) => (
                  <tr key={`${row.asset_id}-${i}`}>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.series_details}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.seller_name}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.unit_value)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.no_of_units}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.total_value)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.no_of_units_sold}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtDate(row.issued_date)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtDate(row.maturity_date)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtDate(row.discounted_on)}</td>
                    <td className="px-4 py-5 whitespace-nowrap"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.investor_name}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.seller_fee)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.investor_fee)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.total_fee)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.net_amount)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.prorated_charges)}</td>
                    <td className="px-4 py-5 whitespace-nowrap">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="cursor-pointer">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-48">
                          <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
                          <hr />
                          <DropdownMenuItem className="p-4 text-sm cursor-pointer" onSelect={() => { setReviewRow(row); setReviewOpen(true) }}>
                            Review Asset
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <footer className="p-4 border-t border-borderGrey">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </footer>
      </section>
      {/* Review Asset Dialog */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent
          style={{ width: "652px", maxWidth: "652px", padding: "24px", gap: "24px", borderRadius: "8px", border: "1px solid #E4E4E7", background: "#fff", boxShadow: "0 4px 6px -4px rgba(16,24,40,0.10), 0 10px 15px -3px rgba(0,0,0,0.10)" }}
          className="flex flex-col items-start"
        >
          <DialogHeader className="flex flex-row items-center justify-between w-full p-0 space-y-0 border-b border-[#E4E4E7] pb-4">
            <DialogTitle style={{ fontFamily: "Satoshi", fontSize: "18px", fontWeight: 700, lineHeight: "140%", color: "#09090B" }}>
              Review Asset
            </DialogTitle>
          </DialogHeader>

          {/* Two info boxes */}
          <div className="flex gap-4 w-full">
            <div style={{ width: "290px", padding: "12px", borderRadius: "8px", border: "1px solid #E9EAEB", background: "#FAFAFA", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontFamily: "Satoshi", fontSize: "12px", fontWeight: 500, lineHeight: "140%", color: "#71717A" }}>Investor</span>
              <span style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "16px", fontWeight: 700, lineHeight: "110%", letterSpacing: "-0.32px", color: "#0098DB" }}>{reviewRow?.investor_name ?? "—"}</span>
            </div>
            <div style={{ width: "290px", padding: "12px", borderRadius: "8px", border: "1px solid #E9EAEB", background: "#FAFAFA", display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontFamily: "Satoshi", fontSize: "12px", fontWeight: 500, lineHeight: "140%", color: "#71717A" }}>Series Details</span>
              <span style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: "16px", fontWeight: 700, lineHeight: "110%", letterSpacing: "-0.32px", color: "#0098DB" }}>{reviewRow?.series_details ?? "—"}</span>
            </div>
          </div>

          {/* Fields */}
          <div className="flex flex-col gap-4 w-full">
            <ReviewField label="Issue Date" value={fmtDate(reviewRow?.issued_date)} />
            <ReviewField label="Tenor (Days)" value={reviewRow?.tenor ?? ""} />
            <ReviewField label="Maturity Date" value={fmtDate(reviewRow?.maturity_date)} />
            <ReviewField label="Total Value" value={fmtNum(reviewRow?.total_value)} isNaira />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 w-full pt-2">
            <button
              onClick={() => handleAssetReview("reject")}
              disabled={!!reviewAction}
              style={{ width: "120px", height: "44px", padding: "8px 16px", borderRadius: "8px", background: "#DC2626", border: "none", cursor: reviewAction ? "not-allowed" : "pointer", opacity: reviewAction ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <span style={{ fontFamily: "Satoshi", fontSize: "16px", fontWeight: 500, lineHeight: "140%", color: "#FAFAFA" }}>
                {reviewAction === "reject" ? "Rejecting..." : "Reject"}
              </span>
            </button>
            <button
              onClick={() => handleAssetReview("approve")}
              disabled={!!reviewAction}
              style={{ width: "120px", height: "44px", padding: "8px 16px", borderRadius: "8px", background: "#0098DB", border: "none", cursor: reviewAction ? "not-allowed" : "pointer", opacity: reviewAction ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <span style={{ fontFamily: "Satoshi", fontSize: "16px", fontWeight: 500, lineHeight: "140%", color: "#FAFAFA" }}>
                {reviewAction === "approve" ? "Approving..." : "Approve"}
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
