"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Filter, MoreHorizontal, Search } from "lucide-react"
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
import { getVendorList } from "../services/vendors"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "../components/toast"

const PAGE_SIZE = 10

// Format ISO date string → "May 18, 2026"
const fmtDate = (iso) => {
  if (!iso) return ""
  try { return format(new Date(iso), "MMM d, yyyy") } catch { return iso }
}

export default function VendorsPage() {
  const router = useRouter()

  const [loading, setLoading]         = useState(true)
  const [vendors, setVendors]         = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [totalCount, setTotalCount]   = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch]           = useState("")
  const [fromDate, setFromDate]       = useState("")
  const [toDate, setToDate]           = useState("")

  const fetchVendors = async ({ page = 1, searchVal = "", from = "", to = "" }) => {
    const res = await getVendorList({
      page_number: page,
      page_size:   PAGE_SIZE,
      search:      searchVal,
      from_date:   from,
      to_date:     to,
    })
    setVendors(res.vendor_list ?? [])
    setTotalPages(res.pagination?.total_pages ?? 1)
    setTotalCount(res.pagination?.total ?? 0)
    return res
  }

  const showToast = (res) => {
    if (res?.res === "success") {
      toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
    } else if (res?.messg) {
      toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
    }
  }

  // Initial load — keep loader on failure
  useEffect(() => {
    fetchVendors({ page: 1 })
      .then((res) => { showToast(res); setLoading(false) })
      .catch(() => { /* keep PageLoader */ })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Re-fetch when page changes
  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchVendors({ page, searchVal: search, from: fromDate, to: toDate })
      .then(showToast)
      .catch(() => {})
  }

  // Search — reset to page 1, server-side
  const handleSearch = (val) => {
    setSearch(val)
    setCurrentPage(1)
    fetchVendors({ page: 1, searchVal: val, from: fromDate, to: toDate })
      .then(showToast)
      .catch(() => {})
  }

  // Date range change
  const handleDateChange = (range) => {
    if (!range?.from || !range?.to) return
    const from = format(range.from, "yyyy-MM-dd")
    const to   = format(range.to,   "yyyy-MM-dd")
    setFromDate(from)
    setToDate(to)
    setCurrentPage(1)
    fetchVendors({ page: 1, searchVal: search, from, to })
      .then(showToast)
      .catch(() => {})
  }

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <section>
          <h2 className="text-2xl font-bold text-customBlack mb-1">Vendors</h2>
          <p className="text-sm text-grey">Showing all vendors</p>
        </section>
        <section className="flex items-center gap-3">
          <DateRangePicker label="Select Date Range" showChevron onChange={handleDateChange} />
          <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
        </section>
      </header>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        {/* Toolbar */}
        <section className="flex items-center gap-4 p-4 border-b border-borderGrey">
          <span className="inline-flex items-center rounded-full border border-borderGrey bg-deepGrey px-3 py-1 text-xs font-medium text-customBlack whitespace-nowrap">
            Total Vendors: {totalCount.toLocaleString()}
          </span>
          <section className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name, BVN, email"
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </section>
          <Button variant="outline" className="h-10 gap-2 border-borderGrey">
            <Filter className="size-4" />
            Filters
          </Button>
        </section>

        {/* Table */}
        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Vendor Name</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">BVN</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Email Address</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Phone Number</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Date Joined</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Status</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {vendors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-grey text-sm">
                    No vendors found.
                  </TableCell>
                </TableRow>
              ) : (
                vendors.map((v, i) => (
                  <TableRow key={v.bvn + i}>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{v.vendor_name || ""}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{v.bvn || ""}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{v.email_address || ""}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{v.phone_number || ""}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtDate(v.date_joined)}</TableCell>
                    <TableCell className="px-6 py-6 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        v.status === "Active" ? "bg-lightGreen text-[#16A34A]" : "bg-[#FEF3C7] text-[#D97706]"
                      }`}>
                        {v.status || ""}
                      </span>
                    </TableCell>
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
                            onClick={() => router.push(`/admin/vendors/${v.bvn}`)}
                          >
                            View User Details
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
