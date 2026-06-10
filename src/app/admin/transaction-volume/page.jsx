"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"
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
import { getTransactionVolumeList } from "../services/transactionVolume"
import { toast } from "react-toastify"
import { ErrorToast } from "../components/toast"

const PAGE_SIZE = 10

const fmtNumber = (val) => {
  if (val === null || val === undefined) return ""
  return Number(val).toLocaleString("en-NG", { maximumFractionDigits: 2 })
}

export default function TransactionVolumePage() {
  const [loading, setLoading]         = useState(true)
  const [rows, setRows]               = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [fromDate, setFromDate]       = useState("")
  const [toDate, setToDate]           = useState("")

  const fetchData = async ({ page = 1, from = "", to = "" }) => {
    const res = await getTransactionVolumeList({
      page_number: page,
      page_size:   PAGE_SIZE,
      search:      "",
      from_date:   from,
      to_date:     to,
    })
    setRows(res.data?.volume_list ?? [])
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
        <h2 className="text-2xl font-bold text-customBlack mb-1">Transaction Volume</h2>
        <p className="text-sm text-grey">Showing transaction volume per month</p>
      </header>

      <section className="flex items-center justify-between gap-4">
        <DateRangePicker label="Select Date Range" onChange={handleDateChange} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
      </section>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <div className="overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                <TableHead className="px-6 py-6 font-bold text-grey">Transaction Month</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey">Total Deposit (₦)</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey">Total Withdrawal (₦)</TableHead>
                <TableHead className="px-4 py-6 text-right font-bold text-grey">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white">
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-16 text-grey text-sm">
                    No transaction volume data found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, i) => (
                  <TableRow key={`${row.year}-${row.month}-${i}`}>
                    <TableCell className="px-6 py-6 text-tableGrey">{row.transaction_month}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey">{fmtNumber(row.total_deposit)}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey">{fmtNumber(row.total_withdrawal)}</TableCell>
                    <TableCell className="px-4 py-6 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="cursor-pointer"
                        onClick={() => console.log("Action", row)}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
