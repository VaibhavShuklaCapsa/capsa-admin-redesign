"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Search } from "lucide-react"
import DateRangePicker from "../components/ui/DateRangePicker"
import Pagination from "../components/Pagination/Pagination"
import PageLoader from "../components/ui/PageLoader"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { getRevenueAmountSterlingData } from "../services/revenueAmountSterling"

const PAGE_SIZE = 10

const fmtDate = (iso) => {
  if (!iso) return ""
  try { return format(new Date(iso), "MMM d, yyyy") } catch { return iso }
}

const fmtNum = (val) => {
  if (val === null || val === undefined) return ""
  return Number(val).toLocaleString("en-NG", { maximumFractionDigits: 2 })
}

function StatusBadge({ status }) {
  const styles = {
    Open:    "bg-[#EBF6FB] text-blue",
    Overdue: "bg-[#FEE2E2] text-[#EF4444]",
    Settled: "bg-lightGreen text-[#16A34A]",
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  )
}

export default function RevenueAmountSterlingPage() {
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
      const res = await getRevenueAmountSterlingData({ page_number: page, page_size: PAGE_SIZE, search: searchVal, from_date: from, to_date: to })
      setRows(res?.data?.revenue_amount_list ?? [])
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
        <h2 className="text-2xl font-bold text-customBlack mb-1">Revenue Amount (Sterling)</h2>
        <p className="text-sm text-grey">Showing all revenue entries</p>
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
              placeholder="Search by invoice number"
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Date</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Invoice No</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Status</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Vendor</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Invoice Amount (₦)</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Capsa Fees (₦)</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Sterling Fees (₦)</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Total Fees (₦)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {error ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-16 text-grey text-sm">
                    Unable to load data. Please try again.
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-16 text-grey text-sm">
                    No sterling revenue entries found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, i) => (
                  <TableRow key={row.revenue_id ?? i}>
                    <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtDate(row.date)}</TableCell>
                    <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.invoice_no}</TableCell>
                    <TableCell className="px-4 py-5 whitespace-nowrap"><StatusBadge status={row.status} /></TableCell>
                    <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.vendor}</TableCell>
                    <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.investor}</TableCell>
                    <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.invoice_amount)}</TableCell>
                    <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.capsa_fees)}</TableCell>
                    <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.sterling_fees)}</TableCell>
                    <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.total_fees)}</TableCell>
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
    </section>
  )
}
