"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Search } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"
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
import {
  getRevenueAmountInvoices,
  getRevenueAmountRevenues,
  getRevenueAmountAssets,
} from "../services/revenueAmount"

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

function TabLoader() {
  return (
    <div className="flex justify-center items-center py-16">
      <img src="/images/loader.gif" width={80} height={80} alt="Loading" className="object-contain" />
    </div>
  )
}

// ── Invoices Tab ──────────────────────────────────────────────────────────────

function InvoicesTab({ sharedFromDate, sharedToDate }) {
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [rows, setRows]               = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch]           = useState("")

  const fetchData = async ({ page = 1, searchVal = "", from = sharedFromDate, to = sharedToDate }) => {
    try {
      const res = await getRevenueAmountInvoices({ page_number: page, page_size: PAGE_SIZE, search: searchVal, from_date: from, to_date: to })
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

  useEffect(() => {
    if (loading) return
    setCurrentPage(1)
    fetchData({ page: 1, searchVal: search, from: sharedFromDate, to: sharedToDate })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedFromDate, sharedToDate])

  const handleSearch = (val) => {
    setSearch(val)
    setCurrentPage(1)
    fetchData({ page: 1, searchVal: val })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchData({ page, searchVal: search })
  }

  if (loading) return <TabLoader />

  return (
    <>
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
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Vendor Fees (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor Fees (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Total Fees (₦)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {error ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-16 text-grey text-sm">
                  Unable to load invoice data. Please try again.
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-16 text-grey text-sm">
                  No invoice revenue entries found.
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
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.vendor_fees)}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.investor_fees)}</TableCell>
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
    </>
  )
}

// ── Revenues Tab ──────────────────────────────────────────────────────────────

function RevenuesTab({ sharedFromDate, sharedToDate }) {
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [rows, setRows]               = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch]           = useState("")

  const fetchData = async ({ page = 1, searchVal = "", from = sharedFromDate, to = sharedToDate }) => {
    try {
      const res = await getRevenueAmountRevenues({ page_number: page, page_size: PAGE_SIZE, search: searchVal, from_date: from, to_date: to })
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

  useEffect(() => {
    if (loading) return
    setCurrentPage(1)
    fetchData({ page: 1, searchVal: search, from: sharedFromDate, to: sharedToDate })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedFromDate, sharedToDate])

  const handleSearch = (val) => {
    setSearch(val)
    setCurrentPage(1)
    fetchData({ page: 1, searchVal: val })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchData({ page, searchVal: search })
  }

  if (loading) return <TabLoader />

  return (
    <>
      <div className="flex justify-end p-4 border-b border-borderGrey">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by revenue number"
            className="pl-9 h-10 border-borderGrey bg-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="bg-white">
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Date</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Revenue No</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Status</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Vendor</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Revenue Amount (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Vendor Fees (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor Fees (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Total Fees (₦)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {error ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-16 text-grey text-sm">
                  Unable to load revenue data. Please try again.
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-16 text-grey text-sm">
                  No revenue entries found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => (
                <TableRow key={row.revenue_id ?? i}>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtDate(row.date)}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.revenue_no}</TableCell>
                  <TableCell className="px-4 py-5 whitespace-nowrap"><StatusBadge status={row.status} /></TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.vendor}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.investor}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.revenue_amount)}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.vendor_fees)}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.investor_fees)}</TableCell>
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
    </>
  )
}

// ── Assets Tab ────────────────────────────────────────────────────────────────

function AssetsTab({ sharedFromDate, sharedToDate }) {
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [rows, setRows]               = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch]           = useState("")

  const fetchData = async ({ page = 1, searchVal = "", from = sharedFromDate, to = sharedToDate }) => {
    try {
      const res = await getRevenueAmountAssets({ page_number: page, page_size: PAGE_SIZE, search: searchVal, from_date: from, to_date: to })
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

  useEffect(() => {
    if (loading) return
    setCurrentPage(1)
    fetchData({ page: 1, searchVal: search, from: sharedFromDate, to: sharedToDate })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sharedFromDate, sharedToDate])

  const handleSearch = (val) => {
    setSearch(val)
    setCurrentPage(1)
    fetchData({ page: 1, searchVal: val })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchData({ page, searchVal: search })
  }

  if (loading) return <TabLoader />

  return (
    <>
      <div className="flex justify-end p-4 border-b border-borderGrey">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by series details"
            className="pl-9 h-10 border-borderGrey bg-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="bg-white">
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Date</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Series Details</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Status</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Vendor</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Total Value (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Seller Fees (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor Fees (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Total Fees (₦)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {error ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-16 text-grey text-sm">
                  Unable to load asset data. Please try again.
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-16 text-grey text-sm">
                  No asset revenue entries found.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, i) => (
                <TableRow key={row.purchase_id ?? i}>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtDate(row.date)}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.series_details}</TableCell>
                  <TableCell className="px-4 py-5 whitespace-nowrap"><StatusBadge status={row.status} /></TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.vendor}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.investor}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.total_value)}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.seller_fees)}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.investor_fees)}</TableCell>
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
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RevenueAmountPage() {
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate]     = useState("")

  const handleDateChange = (range) => {
    if (!range?.from || !range?.to) return
    setFromDate(format(range.from, "yyyy-MM-dd"))
    setToDate(format(range.to,   "yyyy-MM-dd"))
  }

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Revenue Amount</h2>
        <p className="text-sm text-grey">Showing all revenue entries</p>
      </header>

      <Tabs defaultValue="invoices">
        <TabsList className="bg-deepGrey h-auto p-1 rounded-xl w-fit justify-start mb-4">
          <TabsTrigger value="invoices"  className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Invoices</TabsTrigger>
          <TabsTrigger value="revenues"  className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Revenues</TabsTrigger>
          <TabsTrigger value="assets"    className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Assets</TabsTrigger>
        </TabsList>

        <div className="flex items-center justify-between gap-4 mb-4">
          <DateRangePicker label="Select Date Range" onChange={handleDateChange} />
          <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
        </div>

        <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
          <TabsContent value="invoices" className="mt-0">
            <InvoicesTab sharedFromDate={fromDate} sharedToDate={toDate} />
          </TabsContent>

          <TabsContent value="revenues" className="mt-0">
            <RevenuesTab sharedFromDate={fromDate} sharedToDate={toDate} />
          </TabsContent>

          <TabsContent value="assets" className="mt-0">
            <AssetsTab sharedFromDate={fromDate} sharedToDate={toDate} />
          </TabsContent>
        </section>
      </Tabs>
    </section>
  )
}
