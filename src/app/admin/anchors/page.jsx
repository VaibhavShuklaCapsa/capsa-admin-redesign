"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ChevronDown, MoreHorizontal, Search } from "lucide-react"
import { useRouter } from "next/navigation"
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
import { getAnchorsData } from "../services/anchors"
import EditAnchorGradeDialog from "../components/EditAnchorGradeDialog"

const PAGE_SIZE = 10

const fmtDate = (val) => {
  if (!val || val.startsWith("0000")) return "—"
  try { return format(new Date(val), "MMM d, yyyy") } catch { return val }
}

function StatusBadge({ status }) {
  const styles = {
    Active:       "bg-lightGreen text-[#16A34A]",
    Pending:      "bg-[#FEF3C7] text-[#D97706]",
    Inactive:     "bg-[#FEE2E2] text-[#EF4444]",
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  )
}

function AnchorActionMenu({ row, onGradeUpdated }) {
  const router = useRouter()
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-48">
          <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
          <hr />
          <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => router.push(`/admin/anchors/${row.bvn}`)}>
            View User Details
          </DropdownMenuItem>
          <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => setGradeDialogOpen(true)}>
            Edit Anchor Grade
          </DropdownMenuItem>
          <hr />
          <DropdownMenuItem className="p-4 text-sm cursor-pointer text-[#D97706]" onClick={() => console.log("Block Account", row)}>
            Block Account
          </DropdownMenuItem>
          <DropdownMenuItem className="p-4 text-sm cursor-pointer text-[#EF4444]" onClick={() => console.log("Delete Account", row)}>
            Delete Account
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditAnchorGradeDialog
        open={gradeDialogOpen}
        onOpenChange={setGradeDialogOpen}
        panNumber={row.bvn}
        currentGrade={row.grade}
        onSuccess={onGradeUpdated}
      />
    </>
  )
}

const HEADERS = ["Anchor Name", "BVN", "RC Number", "Email Address", "Grade", "RF", "Rate (%)", "Date Joined", "Actions"]

export default function AnchorsPage() {
  const router = useRouter()
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(false)
  const [rows, setRows]             = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch]         = useState("")
  const [fromDate, setFromDate]     = useState("")
  const [toDate, setToDate]         = useState("")

  const fetchData = async ({ page = 1, searchVal = "", from = "", to = "" } = {}) => {
    try {
      const res = await getAnchorsData({ page_number: page, page_size: PAGE_SIZE, search: searchVal, from_date: from, to_date: to })
      setRows(res?.data?.anchor_list ?? [])
      setTotalPages(res?.data?.pagination?.total_pages ?? 1)
      setError(false)
    } catch {
      setError(true)
      setRows([])
    }
  }

  useEffect(() => {
    fetchData().finally(() => setLoading(false))
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
      <header className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <section>
            <h2 className="text-2xl font-bold text-customBlack mb-1">Anchors</h2>
            <p className="text-sm text-grey">Showing all anchors</p>
          </section>
          <Button
            onClick={() => router.push("/admin/anchors/add")}
            className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10 gap-2 shrink-0"
          >
            + Add Anchor
          </Button>
        </div>
        <div className="flex items-center justify-between gap-4">
          <DateRangePicker label="Select Date Range" onChange={handleDateChange} showChevron />
          <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
        </div>
      </header>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 p-4 border-b border-borderGrey">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by anchor name, BVN"
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                {HEADERS.map((h) => (
                  <TableHead key={h} className="px-6 py-6 font-bold text-grey whitespace-nowrap">{h}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {error ? (
                <TableRow>
                  <TableCell colSpan={HEADERS.length} className="text-center py-16 text-grey text-sm">
                    Unable to load anchors. Please try again.
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={HEADERS.length} className="text-center py-16 text-grey text-sm">
                    No anchors found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, i) => (
                  <TableRow key={row.bvn ?? i}>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.anchor_name || "—"}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn || "—"}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.rc_number || "—"}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.email || "—"}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.grade || "—"}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.rf_enabled ? "Enabled" : "Disabled"}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.rate ?? "—"}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtDate(row.date_joined)}</TableCell>
                    <TableCell className="px-6 py-6"><AnchorActionMenu row={row} onGradeUpdated={() => fetchData({ page: currentPage, searchVal: search, from: fromDate, to: toDate })} /></TableCell>
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
