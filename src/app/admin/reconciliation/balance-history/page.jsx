"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronDown, Search } from "lucide-react"
import DateRangePicker from "../../components/ui/DateRangePicker"
import Pagination from "../../components/Pagination/Pagination"
import PageLoader from "../../components/ui/PageLoader"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { viewBalanceHistory } from "../../services/reconciliation"

const PAGE_SIZE = 10

const fmtNum = (val) => {
  if (val === null || val === undefined) return ""
  return Number(val).toLocaleString("en-NG", { maximumFractionDigits: 2 })
}

const FILTER_OPTIONS = [
  { label: "All Accounts",                    value: "all"      },
  { label: "Accounts with non-zero balances", value: "non_zero" },
  { label: "Accounts with zero balances",     value: "zero"     },
]

export default function BalanceHistoryPage() {
  const router                            = useRouter()
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(false)
  const [rows, setRows]                   = useState([])
  const [totalPages, setTotalPages]       = useState(1)
  const [currentPage, setCurrentPage]     = useState(1)
  const [search, setSearch]               = useState("")
  const [fromDate, setFromDate]           = useState("")
  const [toDate, setToDate]               = useState("")
  const [balanceFilter, setBalanceFilter] = useState("all")

  const fetchData = async ({ page = 1, searchVal = "", from = "", to = "", filter = "all" }) => {
    try {
      const res = await viewBalanceHistory({ page_number: page, page_size: PAGE_SIZE, search: searchVal, from_date: from, to_date: to, balance_filter: filter })
      setRows(res?.data?.balance_list ?? [])
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
    fetchData({ page: 1, searchVal: val, from: fromDate, to: toDate, filter: balanceFilter })
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchData({ page, searchVal: search, from: fromDate, to: toDate, filter: balanceFilter })
  }

  const handleDateChange = (range) => {
    if (!range?.from || !range?.to) return
    const from = format(range.from, "yyyy-MM-dd")
    const to   = format(range.to,   "yyyy-MM-dd")
    setFromDate(from); setToDate(to); setCurrentPage(1)
    fetchData({ page: 1, searchVal: search, from, to, filter: balanceFilter })
  }

  const handleFilterChange = (opt) => {
    setBalanceFilter(opt.value)
    setCurrentPage(1)
    fetchData({ page: 1, searchVal: search, from: fromDate, to: toDate, filter: opt.value })
  }

  const activeFilterLabel = FILTER_OPTIONS.find((o) => o.value === balanceFilter)?.label ?? "All Accounts"

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
        <h2 className="text-2xl font-bold text-customBlack mb-1">Balance History</h2>
      </header>

      <section className="flex items-center justify-between gap-4">
        <DateRangePicker label="Select Date Range" onChange={handleDateChange} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
      </section>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">

        <div className="flex items-center justify-between gap-3 p-4 border-b border-borderGrey">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by account name, BVN, account number"
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 border-borderGrey min-w-[220px] justify-between">
                {activeFilterLabel}
                <ChevronDown className="size-4 text-grey" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[220px]">
              {FILTER_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt.value}
                  className="cursor-pointer"
                  onClick={() => handleFilterChange(opt)}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Account Name</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Account Number</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">BVN</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Closing Balance (₦)</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white">
              {error ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-16 text-grey text-sm">
                    Unable to load balance history. Please try again.
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-16 text-grey text-sm">
                    No balance history found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, i) => (
                  <TableRow key={row.account_number ?? i}>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.account_name || "—"}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.account_number}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn || "—"}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtNum(row.closing_balance)}</TableCell>
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
