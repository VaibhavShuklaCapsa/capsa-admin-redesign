"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Search } from "lucide-react"
import DateRangePicker from "../components/ui/DateRangePicker"
import Pagination from "../components/Pagination/Pagination"
import PageLoader from "../components/ui/PageLoader"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { getVendorSweepInData } from "../services/vendorSweepIn"

const PAGE_SIZE = 10

const fmtDate = (val) => {
  if (!val || val.startsWith("0000")) return "—"
  try { return format(new Date(val), "MMM d, yyyy hh:mm a") } catch { return val }
}

const fmtNum = (val) => {
  if (val === null || val === undefined) return ""
  return Number(val).toLocaleString("en-NG", { maximumFractionDigits: 4 })
}

function SweepInStatusBadge({ status }) {
  const styles = {
    Settled:   "bg-lightGreen text-[#16A34A]",
    Unsettled: "bg-[#FEF3C7] text-[#D97706]",
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  )
}

export default function VendorSweepInListPage() {
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [rows, setRows]               = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch]           = useState("")
  const [fromDate, setFromDate]       = useState("")
  const [toDate, setToDate]           = useState("")

  const fetchData = async ({ page = 1, searchVal = "", from = "", to = "" }) => {
    try {
      const res = await getVendorSweepInData({ page_number: page, page_size: PAGE_SIZE, search: searchVal, from_date: from, to_date: to })
      setRows(res?.data?.sweep_list ?? [])
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
        <h2 className="text-2xl font-bold text-customBlack mb-1">Vendor Sweep-In List</h2>
        <p className="text-sm text-grey">Showing sweep entries</p>
      </header>

      <div className="flex items-center justify-between gap-4">
        <DateRangePicker label="Select Date Range" onChange={handleDateChange} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
      </div>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <div className="flex justify-end p-4 border-b border-borderGrey">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by product no, name"
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white">
          <table className="min-w-[1500px] w-full text-sm">
            <thead className="bg-white">
              <tr>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Product No</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Product Type</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Account Name</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">BVN</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Account Type</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Event</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Transaction Amount (₦)</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Transaction Date</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Sweep In Status</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Sweep In Date</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Narration</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-borderGrey">
              {error ? (
                <tr>
                  <td colSpan={11} className="text-center py-16 text-grey text-sm">
                    Unable to load data. Please try again.
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-16 text-grey text-sm">
                    No sweep-in entries found.
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={row.id ?? i}>
                    <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{row.product_no}</td>
                    <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{row.product_type}</td>
                    <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{row.account_name}</td>
                    <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{row.bvn}</td>
                    <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{row.account_type}</td>
                    <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{row.event}</td>
                    <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{fmtNum(row.transaction_amount)}</td>
                    <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{fmtDate(row.transaction_date)}</td>
                    <td className="px-5 py-6 whitespace-nowrap"><SweepInStatusBadge status={row.sweep_in_status} /></td>
                    <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{fmtDate(row.sweep_in_date)}</td>
                    <td className="px-5 py-6 text-tableGrey max-w-xs truncate">{row.narration}</td>
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
    </section>
  )
}
