"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ArrowRight, Search } from "lucide-react"
import DateRangePicker from "../components/ui/DateRangePicker"
import Pagination from "../components/Pagination/Pagination"
import PageLoader from "../components/ui/PageLoader"
import { Input } from "../components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { getBlockedAmountData, unblockAmount } from "../services/blockedAmount"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "../components/toast"
import { Dialog, DialogContent } from "../components/ui/dialog"

const PAGE_SIZE = 10

const fmtDate = (iso) => {
  if (!iso) return ""
  try { return format(new Date(iso), "MMM d, yyyy") } catch { return iso }
}

const fmtNum = (val) => {
  if (val === null || val === undefined) return ""
  return Number(val).toLocaleString("en-NG", { maximumFractionDigits: 2 })
}

function UnblockFundsModal({ open, onClose, row, onSuccess }) {
  const [submitting, setSubmitting] = useState(false)

  const handleUnblock = async () => {
    setSubmitting(true)
    try {
      const res = await unblockAmount({ nadId: row?.nadId, account_number: row?.account_number, order_number: row?.order_number })
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
        onClose()
        onSuccess?.()
      } else {
        toast(<ErrorToast message={res?.messg || "Failed to unblock"} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent
        style={{
          width: "451px", maxWidth: "451px",
          padding: "24px",
          display: "flex", flexDirection: "column",
          alignItems: "flex-start",
          gap: "24px",
          borderRadius: "8px",
          border: "1px solid #E4E4E7",
          background: "#FFF",
          boxShadow: "0 4px 6px -4px rgba(16,24,40,0.10), 0 10px 15px -3px rgba(0,0,0,0.10)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
          <p style={{ fontFamily: "Satoshi", fontSize: "18px", fontWeight: 700, lineHeight: "140%", color: "#09090B", margin: 0 }}>
            Unblock Funds
          </p>
          <p style={{ fontFamily: "Satoshi", fontSize: "14px", fontWeight: 400, lineHeight: "140%", color: "#71717A", margin: 0 }}>
            You are choosing to unblock the selected amount. Do you wish to proceed?
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", width: "100%" }}>
          <button
            onClick={onClose}
            disabled={submitting}
            style={{ display: "flex", height: "44px", padding: "8px 16px", justifyContent: "center", alignItems: "center", gap: "8px", borderRadius: "8px", border: "1px solid #E4E4E7", background: "transparent", cursor: "pointer", fontFamily: "Satoshi", fontSize: "16px", fontWeight: 500, lineHeight: "140%", color: "#09090B" }}
          >
            Cancel
          </button>
          <button
            onClick={handleUnblock}
            disabled={submitting}
            style={{ display: "flex", height: "44px", padding: "8px 16px", justifyContent: "center", alignItems: "center", gap: "8px", borderRadius: "8px", border: "none", background: "#0098DB", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1, fontFamily: "Satoshi", fontSize: "16px", fontWeight: 500, lineHeight: "140%", color: "#FAFAFA" }}
          >
            {submitting ? "Unblocking..." : "Yes, Unblock"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function BlockedAmountPage() {
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [rows, setRows]               = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch]           = useState("")
  const [fromDate, setFromDate]       = useState("")
  const [toDate, setToDate]           = useState("")
  const [unblockRow, setUnblockRow]   = useState(null)

  const fetchData = async ({ page = 1, searchVal = "", from = "", to = "" }) => {
    try {
      const res = await getBlockedAmountData({ page_number: page, page_size: PAGE_SIZE, search: searchVal, from_date: from, to_date: to })
      setRows(res?.data?.blocked_list ?? [])
      setTotalPages(res?.data?.pagination?.total_pages ?? 1)
      setError(false)
    } catch {
      setError(true)
      setRows([])
    }
  }

  useEffect(() => {
    fetchData({ page: 1 }).finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (val) => {
    setSearch(val)
    setCurrentPage(1)
    fetchData({ page: 1, searchVal: val, from: fromDate, to: toDate })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchData({ page, searchVal: search, from: fromDate, to: toDate })
  }

  const handleDateChange = (range) => {
    if (!range?.from || !range?.to) return
    const from = format(range.from, "yyyy-MM-dd")
    const to   = format(range.to,   "yyyy-MM-dd")
    setFromDate(from); setToDate(to); setCurrentPage(1)
    fetchData({ page: 1, searchVal: search, from, to })
  }


  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Blocked Amount</h2>
        <p className="text-sm text-grey">Showing all blocked inflows</p>
      </header>

      <div className="flex items-center justify-between gap-4">
        <DateRangePicker label="Select Date Range" onChange={handleDateChange} />
      </div>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <div className="flex justify-end p-4 border-b border-borderGrey">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by order number"
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Account Name</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">BVN</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Account Number</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Order Number</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Date</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Blocked Amount (₦)</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-grey text-sm">
                    Unable to load data. Please try again.
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-grey text-sm">
                    No blocked amount entries found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, i) => (
                  <TableRow key={row.nadId ?? i}>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.account_name}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn || "—"}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.account_number}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.order_number}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtDate(row.date)}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtNum(row.blocked_amount)}</TableCell>
                    <TableCell className="px-6 py-6">
                      <button
                        onClick={() => setUnblockRow(row)}
                        className="flex items-center gap-1 text-sm font-medium text-blue hover:underline"
                      >
                        Unblock <ArrowRight className="size-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <footer className="p-4 border-t border-borderGrey">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </footer>
      </section>

      <UnblockFundsModal
        open={!!unblockRow}
        onClose={() => setUnblockRow(null)}
        row={unblockRow}
        onSuccess={() => fetchData({ page: currentPage, searchVal: search, from: fromDate, to: toDate })}
      />
    </section>
  )
}
