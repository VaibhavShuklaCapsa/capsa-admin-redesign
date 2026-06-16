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
import { useRouter } from "next/navigation"
import {
  getPendingVendors,
  getPendingInvestors,
  getPendingGrowthPartners,
} from "../services/pendingAccounts"

const PAGE_SIZE = 10

const fmtDate = (val) => {
  if (!val || val.startsWith("0000")) return "—"
  try { return format(new Date(val), "MMM d, yyyy") } catch { return val }
}

const ACCOUNT_TYPES  = ["Vendors", "Investors", "Growth Partners"]
const STATUS_OPTIONS = ["All", "Pending", "Approved"]

const SERVICE_MAP = {
  "Vendors":         getPendingVendors,
  "Investors":       getPendingInvestors,
  "Growth Partners": getPendingGrowthPartners,
}

const LIST_KEY_MAP = {
  "Vendors":         "pending_list",
  "Investors":       "investor_list",
  "Growth Partners": "gp_list",
}

function StatusBadge({ status }) {
  const styles = {
    Pending:  "bg-[#FEF3C7] text-[#D97706]",
    Approved: "bg-lightGreen text-[#16A34A]",
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  )
}

// ── Action menus ──────────────────────────────────────────────────────────────

function VendorActionMenu({ row }) {
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer"><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
        <hr />
        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => router.push(`/admin/pending-accounts/vendors/${row.vendor_id}`)}>View Details</DropdownMenuItem>
        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => router.push(`/admin/pending-accounts/vendors/${row.vendor_id}?tab=kyc-documents`)}>View KYC Documents</DropdownMenuItem>
        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => router.push(`/admin/pending-accounts/vendors/${row.vendor_id}?tab=account-letter`)}>Bank Account Information</DropdownMenuItem>
        <DropdownMenuItem className="p-4 text-sm cursor-pointer text-[#EF4444]" onClick={() => console.log("Delete", row)}>Delete Account</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function InvestorActionMenu({ row }) {
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer"><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
        <hr />
        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => router.push(`/admin/pending-accounts/investors/${row.user_id}`)}>View Details</DropdownMenuItem>
        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => router.push(`/admin/pending-accounts/investors/${row.user_id}?tab=kyc-documents`)}>View KYC Documents</DropdownMenuItem>
        <DropdownMenuItem className="p-4 text-sm cursor-pointer text-[#EF4444]" onClick={() => console.log("Delete", row)}>Delete Account</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function GrowthPartnerActionMenu({ row }) {
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer"><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
        <hr />
        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => router.push(`/admin/pending-accounts/growth-partners/${row.id}`)}>View Details</DropdownMenuItem>
        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => router.push(`/admin/pending-accounts/growth-partners/${row.id}?tab=kyc-documents`)}>View KYC Documents</DropdownMenuItem>
        <DropdownMenuItem className="p-4 text-sm cursor-pointer text-[#EF4444]" onClick={() => console.log("Delete", row)}>Delete Account</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Table rows per type ───────────────────────────────────────────────────────

function VendorRows({ rows }) {
  return rows.map((row) => (
    <TableRow key={row.vendor_id}>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.vendor_name}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.email || "—"}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.anchor_name || "—"}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bank || "—"}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtDate(row.created_on)}</TableCell>
      <TableCell className="px-6 py-6 whitespace-nowrap"><StatusBadge status={row.status} /></TableCell>
      <TableCell className="px-6 py-6"><VendorActionMenu row={row} /></TableCell>
    </TableRow>
  ))
}

function InvestorRows({ rows }) {
  return rows.map((row, i) => (
    <TableRow key={row.user_id ?? i}>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.investor_name}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.email || "—"}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bank || "—"}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtDate(row.created_on)}</TableCell>
      <TableCell className="px-6 py-6 whitespace-nowrap"><StatusBadge status={row.status} /></TableCell>
      <TableCell className="px-6 py-6"><InvestorActionMenu row={row} /></TableCell>
    </TableRow>
  ))
}

function GrowthPartnerRows({ rows }) {
  return rows.map((row, i) => (
    <TableRow key={row.id ?? i}>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.name || "—"}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn || "—"}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.email || "—"}</TableCell>
      <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtDate(row.created_on)}</TableCell>
      <TableCell className="px-6 py-6 whitespace-nowrap"><StatusBadge status={row.status} /></TableCell>
      <TableCell className="px-6 py-6"><GrowthPartnerActionMenu row={row} /></TableCell>
    </TableRow>
  ))
}

const HEADERS = {
  "Vendors":         ["Vendor Name", "BVN", "Email Address", "Anchor Name", "Bank", "Created On", "Status", "Actions"],
  "Investors":       ["Investor Name", "BVN", "Email Address", "Bank", "Created On", "Status", "Actions"],
  "Growth Partners": ["Name", "BVN", "Email Address", "Created On", "Status", "Actions"],
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PendingAccountsPage() {
  const [accountType, setAccountType] = useState("Vendors")
  const [statusFilter, setStatusFilter] = useState("All")
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
      const fn      = SERVICE_MAP[type]
      const listKey = LIST_KEY_MAP[type]
      const res     = await fn({ page_number: page, page_size: PAGE_SIZE, search: searchVal, from_date: from, to_date: to })
      setRows(res?.data?.[listKey] ?? [])
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
    setStatusFilter("All")
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

  const filteredRows = statusFilter === "All"
    ? rows
    : rows.filter((r) => r.status === statusFilter)

  const colSpan = HEADERS[accountType]?.length ?? 6

  const searchPlaceholder = {
    "Vendors":         "Search by vendor name, BVN",
    "Investors":       "Search by investor name, BVN",
    "Growth Partners": "Search by name, BVN",
  }[accountType]

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Pending Accounts</h2>
        <p className="text-sm text-grey">Showing all accounts pending verification</p>
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
              placeholder={searchPlaceholder}
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 border-borderGrey min-w-[100px] justify-between">
                {statusFilter}
                <ChevronDown className="size-4 text-grey" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[100px]">
              {STATUS_OPTIONS.map((opt) => (
                <DropdownMenuItem key={opt} className="cursor-pointer" onClick={() => { setStatusFilter(opt); setCurrentPage(1) }}>
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

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
              ) : filteredRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colSpan} className="text-center py-16 text-grey text-sm">
                    No pending accounts found.
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {accountType === "Vendors"          && <VendorRows        rows={filteredRows} />}
                  {accountType === "Investors"        && <InvestorRows      rows={filteredRows} />}
                  {accountType === "Growth Partners"  && <GrowthPartnerRows rows={filteredRows} />}
                </>
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
