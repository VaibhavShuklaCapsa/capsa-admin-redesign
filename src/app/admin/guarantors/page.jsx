"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Filter, MoreHorizontal, Plus, Search } from "lucide-react"
import { format } from "date-fns"
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
import { getGuarantorList } from "../services/guarantors"
import { toast } from "react-toastify"
import { ErrorToast } from "../components/toast"

const PAGE_SIZE = 10

const fmtDate = (iso) => {
  if (!iso) return ""
  try { return format(new Date(iso), "MMM d, yyyy") } catch { return iso }
}

export default function GuarantorsPage() {
  const router = useRouter()

  const [loading, setLoading]         = useState(true)
  const [guarantors, setGuarantors]   = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [totalCount, setTotalCount]   = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch]           = useState("")
  const [fromDate, setFromDate]       = useState("")
  const [toDate, setToDate]           = useState("")

  const fetchGuarantors = async ({ page = 1, searchVal = "", from = "", to = "" }) => {
    const res = await getGuarantorList({
      page_number: page,
      page_size:   PAGE_SIZE,
      search:      searchVal,
      from_date:   from,
      to_date:     to,
    })
    setGuarantors(res.data?.guarantor_list ?? [])
    setTotalPages(res.data?.pagination?.total_pages ?? 1)
    setTotalCount(res.data?.pagination?.total ?? 0)
    return res
  }

  const showErrorToast = (res) => {
    if (res?.res !== "success" && res?.messg) {
      toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
    }
  }

  useEffect(() => {
    fetchGuarantors({ page: 1 })
      .then((res) => { showErrorToast(res); setLoading(false) })
      .catch(() => { /* keep PageLoader */ })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchGuarantors({ page, searchVal: search, from: fromDate, to: toDate })
      .then(showErrorToast).catch(() => {})
  }

  const handleSearch = (val) => {
    setSearch(val)
    setCurrentPage(1)
    fetchGuarantors({ page: 1, searchVal: val, from: fromDate, to: toDate })
      .then(showErrorToast).catch(() => {})
  }

  const handleDateChange = (range) => {
    if (!range?.from || !range?.to) return
    const from = format(range.from, "yyyy-MM-dd")
    const to   = format(range.to,   "yyyy-MM-dd")
    setFromDate(from)
    setToDate(to)
    setCurrentPage(1)
    fetchGuarantors({ page: 1, searchVal: search, from, to })
      .then(showErrorToast).catch(() => {})
  }

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <section>
          <h2 className="text-2xl font-bold text-customBlack mb-1">Guarantors</h2>
          <p className="text-sm text-grey">Showing all guarantors</p>
        </section>
        <Button
          className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-11 gap-2"
          onClick={() => router.push("/admin/guarantors/add")}
        >
          <Plus className="size-5" />
          Add Guarantor
        </Button>
      </header>

      <section className="flex items-center justify-between gap-4">
        <DateRangePicker label="Select Date Range" onChange={handleDateChange} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
      </section>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <section className="flex items-center gap-4 p-4 border-b border-borderGrey">
          <span className="inline-flex items-center rounded-lg border border-borderGrey bg-white px-4 py-2 text-sm font-medium text-customBlack">
            Guarantors: <strong className="ml-1">{totalCount.toLocaleString()}</strong>
          </span>
          <section className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name, RC number"
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </section>
          <Button variant="outline" className="h-10 gap-2 border-borderGrey">
            <Filter className="size-4" />
            Filters
          </Button>
        </section>

        <div className="border-y overflow-hidden bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                <TableHead className="px-6 py-6 font-bold text-grey">Name</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey">RC Number</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey">Industry</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey">Date Added</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey">Status</TableHead>
                <TableHead className="px-4 py-6 text-right font-bold text-grey">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {guarantors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-grey text-sm">
                    No guarantors found.
                  </TableCell>
                </TableRow>
              ) : (
                guarantors.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="px-6 py-6 text-tableGrey">{row.name}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey">{row.rc_number}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey">{row.industry}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey">{fmtDate(row.date_added)}</TableCell>
                    <TableCell className="px-6 py-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        row.status === "Active" ? "bg-lightGreen text-[#16A34A]" : "bg-[#FEF3C7] text-[#D97706]"
                      }`}>
                        {row.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="cursor-pointer">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-56">
                          <DropdownMenuItem className="text-customBlack font-semibold p-4 cursor-default">Actions</DropdownMenuItem>
                          <hr />
                          <DropdownMenuItem
                            className="p-4 text-sm cursor-pointer"
                            onClick={() => router.push(`/admin/guarantors/${row.id}?rc=${encodeURIComponent(row.rc_number)}`)}
                          >
                            View User Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="p-4 text-sm cursor-pointer text-[#B7791F]" onClick={() => console.log("Block", row)}>
                            Block Account
                          </DropdownMenuItem>
                          <DropdownMenuItem className="p-4 text-sm cursor-pointer text-[#EF4444]" onClick={() => console.log("Delete", row)}>
                            Delete Account
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
