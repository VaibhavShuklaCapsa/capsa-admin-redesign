"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Search } from "lucide-react"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { getEditInvoiceList, deleteInvoice } from "../services/editInvoice"

const PAGE_SIZE = 10

const fmtDate = (val) => {
  if (!val || val.startsWith("0000")) return "—"
  try { return format(new Date(val), "MMM d, yyyy") } catch { return val }
}

const fmtNum = (val) => {
  if (val === null || val === undefined) return ""
  return Number(val).toLocaleString("en-NG", { maximumFractionDigits: 2 })
}

export default function EditInvoicePage() {
  const router                        = useRouter()
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
      const res = await getEditInvoiceList({ page_number: page, page_size: PAGE_SIZE, search: searchVal, from_date: from, to_date: to })
      setRows(res?.data?.invoice_list ?? [])
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

  const handleDelete = async (row) => {
    try {
      const res = await deleteInvoice(row.deal_id)
      if (res?.res === "success") {
        fetchData({ page: currentPage, searchVal: search, from: fromDate, to: toDate })
      }
    } catch {}
  }

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Edit Invoice</h2>
        <p className="text-sm text-grey">Showing live invoices that can be edited</p>
      </header>

      <div className="flex items-center justify-between gap-4">
        <DateRangePicker label="Select Date Range" onChange={handleDateChange} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
      </div>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <div className="flex items-center justify-end gap-3 p-4 border-b border-borderGrey">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by invoice number, vendor"
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Invoice No</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Vendor Name</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Anchor Name</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Amount (₦)</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Tenor (Days)</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Due Date</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {error ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-grey text-sm">
                    Unable to load invoices. Please try again.
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-grey text-sm">
                    No invoices found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.deal_id}>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.invoice_no}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.vendor_name}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.anchor_name}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtNum(row.amount)}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.tenor}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtDate(row.due_date)}</TableCell>
                    <TableCell className="px-6 py-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="cursor-pointer">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-48">
                          <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
                          <hr />
                          <DropdownMenuItem
                            className="p-4 text-sm cursor-pointer"
                            onClick={() => router.push(`/admin/edit-invoice/${row.deal_id}?data=${encodeURIComponent(JSON.stringify(row))}`)}
                          >
                            Edit Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="p-4 text-sm cursor-pointer text-[#EF4444]"
                            onClick={() => handleDelete(row)}
                          >
                            Delete Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
    </section>
  )
}
