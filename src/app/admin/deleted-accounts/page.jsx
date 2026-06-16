"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ChevronDown, MoreHorizontal, Search } from "lucide-react"
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
import {
  getDeletedVendors,
  getDeletedInvestors,
  getDeletedAnchors,
  getDeletedGrowthPartners,
} from "../services/deletedAccounts"

const PAGE_SIZE = 10

const fmtDate = (val) => {
  if (!val || val.startsWith("0000")) return "—"
  try { return format(new Date(val), "MMM d, yyyy") } catch { return val }
}

const ACCOUNT_TYPES = ["Vendors", "Investors", "Anchors", "Growth Partners"]

const SERVICE_MAP = {
  "Vendors":         getDeletedVendors,
  "Investors":       getDeletedInvestors,
  "Anchors":         getDeletedAnchors,
  "Growth Partners": getDeletedGrowthPartners,
}

// ── Table bodies per type ────────────────────────────────────────────────────

function VendorRows({ rows }) {
  return rows.map((row) => (
    <TableRow key={row.user_id}>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.vendor_name}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.email || "—"}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.anchor_name}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtDate(row.deleted_on)}</TableCell>
    </TableRow>
  ))
}

function InvestorRows({ rows }) {
  return rows.map((row, i) => (
    <TableRow key={row.user_id ?? i}>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.investor_name}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.email || "—"}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.type}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtDate(row.deleted_on)}</TableCell>
    </TableRow>
  ))
}

function AnchorRows({ rows }) {
  return rows.map((row, i) => (
    <TableRow key={row.relationship_id ?? i}>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.anchor_name}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.rc_number}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.email || "—"}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.grade || "—"}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtDate(row.deleted_on)}</TableCell>
    </TableRow>
  ))
}

function GrowthPartnerRows({ rows }) {
  return rows.map((row, i) => (
    <TableRow key={row.id ?? i}>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.name || "—"}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.email || "—"}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtDate(row.deleted_on)}</TableCell>
    </TableRow>
  ))
}

const HEADERS = {
  "Vendors":         ["Vendor Name", "BVN", "Email Address", "Anchor Name", "Deleted On"],
  "Investors":       ["Investor Name", "BVN", "Email Address", "Type", "Deleted On"],
  "Anchors":         ["Anchor Name", "BVN", "RC Number", "Email Address", "Grade", "Deleted On"],
  "Growth Partners": ["Partner Name", "BVN", "Email Address", "Deleted On"],
}

function TableRows({ accountType, rows }) {
  if (accountType === "Vendors")         return <VendorRows        rows={rows} />
  if (accountType === "Investors")       return <InvestorRows      rows={rows} />
  if (accountType === "Anchors")         return <AnchorRows        rows={rows} />
  if (accountType === "Growth Partners") return <GrowthPartnerRows rows={rows} />
  return null
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DeletedAccountsPage() {
  const [accountType, setAccountType] = useState("Vendors")
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(false)
  const [rows, setRows]               = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch]           = useState("")
  const [fromDate, setFromDate]       = useState("")
  const [toDate, setToDate]           = useState("")

  const fetchData = async ({ type = accountType, page = 1, searchVal = "", from = "", to = "" }) => {
    try {
      const fn  = SERVICE_MAP[type]
      const res = await fn({ page_number: page, page_size: PAGE_SIZE, search: searchVal, from_date: from, to_date: to })
      setRows(res?.data?.deleted_list ?? [])
      setTotalPages(res?.data?.pagination?.total_pages ?? 1)
      setError(false)
    } catch {
      setError(true)
      setRows([])
    }
  }

  useEffect(() => {
    fetchData({ type: "Vendors", page: 1 }).finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTypeChange = (type) => {
    setAccountType(type)
    setSearch("")
    setCurrentPage(1)
    fetchData({ type, page: 1, searchVal: "", from: fromDate, to: toDate })
  }

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

  const colSpan = HEADERS[accountType]?.length ?? 5

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Deleted Accounts</h2>
        <p className="text-sm text-grey">Showing deleted accounts</p>
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
              placeholder={`Search by name, BVN, email`}
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 border-borderGrey min-w-[160px] justify-between">
                {accountType}
                <ChevronDown className="size-4 text-grey" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              {ACCOUNT_TYPES.map((opt) => (
                <DropdownMenuItem key={opt} className="cursor-pointer" onClick={() => handleTypeChange(opt)}>
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                {HEADERS[accountType].map((h) => (
                  <TableHead key={h} className="px-6 py-6 font-bold text-grey whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {error ? (
                <TableRow>
                  <TableCell colSpan={colSpan} className="text-center py-16 text-grey text-sm">
                    Unable to load data. Please try again.
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colSpan} className="text-center py-16 text-grey text-sm">
                    No deleted accounts found.
                  </TableCell>
                </TableRow>
              ) : (
                <TableRows accountType={accountType} rows={rows} />
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
