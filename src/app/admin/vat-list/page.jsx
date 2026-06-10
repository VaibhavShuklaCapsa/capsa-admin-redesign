"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import DateRangePicker from "../components/ui/DateRangePicker"
import Pagination from "../components/Pagination/Pagination"
import PageLoader from "../components/ui/PageLoader"
import { Button } from "../components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { getVatListData } from "../services/vatList"
import { toast } from "react-toastify"
import { ErrorToast } from "../components/toast"

const PAGE_SIZE = 10

const fmtNumber = (val) => {
  if (val === null || val === undefined) return ""
  return Number(val).toLocaleString("en-NG", { maximumFractionDigits: 2 })
}

const fmtDate = (dateStr) => {
  if (!dateStr) return ""
  try {
    return format(new Date(dateStr), "MMM dd, yyyy")
  } catch {
    return dateStr
  }
}

export default function VatListPage() {
  const [loading, setLoading]         = useState(true)
  const [rows, setRows]               = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [fromDate, setFromDate]       = useState("")
  const [toDate, setToDate]           = useState("")

  const fetchData = async ({ page = 1, from = "", to = "" }) => {
    const res = await getVatListData({
      page_number: page,
      page_size:   PAGE_SIZE,
      search:      "",
      from_date:   from,
      to_date:     to,
    })
    setRows(res.data?.vat_list ?? [])
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
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchData({ page, from: fromDate, to: toDate })
      .then(showErrorToast).catch(() => {})
  }

  const handleDateChange = (range) => {
    if (!range?.from || !range?.to) return
    const from = format(range.from, "yyyy-MM-dd")
    const to   = format(range.to,   "yyyy-MM-dd")
    setFromDate(from)
    setToDate(to)
    setCurrentPage(1)
    fetchData({ page: 1, from, to })
      .then(showErrorToast).catch(() => {})
  }

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">VAT List</h2>
        <p className="text-sm text-grey">Showing all VAT entries</p>
      </header>

      <section className="flex items-center justify-between gap-4">
        <DateRangePicker label="Select Date Range" onChange={handleDateChange} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">
          Download
        </Button>
      </section>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <div className="overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                <TableHead className="px-6 py-6 font-bold text-grey">Beneficiary Name</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey">Beneficiary TIN</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey">Item</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey">Item Cost (₦)</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey">VAT Amount (₦)</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey">Transaction Date</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey">Item Description</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white">
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-grey text-sm">
                    No VAT entries found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, i) => (
                  <TableRow key={`${row.item}-${i}`}>
                    <TableCell className="px-6 py-6 text-tableGrey max-w-[18vw] truncate">
                      {row.beneficiary_name}
                    </TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey">
                      {row.beneficiary_tin || "—"}
                    </TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey">
                      {row.item}
                    </TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey">
                      {fmtNumber(row.item_cost)}
                    </TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey">
                      {fmtNumber(row.vat_amount)}
                    </TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey">
                      {fmtDate(row.transaction_date)}
                    </TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey max-w-[18vw] truncate">
                      {row.item_description}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <footer className="p-4 border-t border-borderGrey">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </footer>
      </section>
    </section>
  )
}
