"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
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
import { getTransactionLedgerAccountsData } from "../services/transactionLedgerAccounts"
import { toast } from "react-toastify"
import { ErrorToast } from "../components/toast"

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
    Successful: "bg-lightGreen text-[#16A34A]",
    Failed:     "bg-[#FEE2E2] text-[#EF4444]",
    Pending:    "bg-[#FEF3C7] text-[#D97706]",
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  )
}

export default function TransactionLedgerAccountsPage() {
  const [loading, setLoading]         = useState(true)
  const [rows, setRows]               = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch]           = useState("")
  const [fromDate, setFromDate]       = useState("")
  const [toDate, setToDate]           = useState("")

  const fetchData = async ({ page = 1, searchVal = "", from = "", to = "" }) => {
    const res = await getTransactionLedgerAccountsData({ page_number: page, page_size: PAGE_SIZE, search: searchVal, from_date: from, to_date: to })
    setRows(res.data?.ledger ?? [])
    setTotalPages(res.data?.pagination?.total_pages ?? 1)
    return res
  }

  const showErrorToast = (res) => {
    if (res?.res !== "success" && res?.messg) {
      toast(<ErrorToast message={res.messg} />, { style: { padding: 0 } })
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
    fetchData({ page, searchVal: search, from: fromDate, to: toDate })
      .then(showErrorToast).catch(() => {})
  }

  const handleSearch = (val) => {
    setSearch(val)
    setCurrentPage(1)
    fetchData({ page: 1, searchVal: val, from: fromDate, to: toDate })
      .then(showErrorToast).catch(() => {})
  }

  const handleDateChange = (range) => {
    if (!range?.from || !range?.to) return
    const from = format(range.from, "yyyy-MM-dd")
    const to   = format(range.to,   "yyyy-MM-dd")
    setFromDate(from); setToDate(to); setCurrentPage(1)
    fetchData({ page: 1, searchVal: search, from, to })
      .then(showErrorToast).catch(() => {})
  }

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Transaction Ledger (Accounts)</h2>
        <p className="text-sm text-grey">Showing all account ledger entries</p>
      </header>

      <div className="flex items-center justify-between gap-4">
        <DateRangePicker label="Select Date Range" onChange={handleDateChange} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
      </div>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <div className="flex items-center justify-end gap-3 p-4 border-b border-borderGrey">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name, account number"
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white">
          <table className="min-w-[1400px] w-full text-sm">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Name</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Account Number</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Date</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Opening Balance (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Deposit (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Withdrawal (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Closing Balance (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Status</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Narration</th>
                <th className="px-4 py-5 text-left font-bold text-grey">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-borderGrey">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-16 text-grey text-sm">No ledger entries found.</td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.name}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.account_number}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtDate(row.date)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.opening_balance)}</td>
                    <td className="px-4 py-5 whitespace-nowrap font-medium" style={{ color: row.deposit > 0 ? "#16A34A" : undefined }}>
                      {fmtNum(row.deposit)}
                    </td>
                    <td className="px-4 py-5 whitespace-nowrap font-medium" style={{ color: row.withdrawal > 0 ? "#EF4444" : undefined }}>
                      {fmtNum(row.withdrawal)}
                    </td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.closing_balance)}</td>
                    <td className="px-4 py-5 whitespace-nowrap"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-5 text-tableGrey max-w-xs truncate">{row.narration}</td>
                    <td className="px-4 py-5">
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
                            onClick={() => console.log("Reverse", row)}
                          >
                            Reverse Transaction
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
    </section>
  )
}
