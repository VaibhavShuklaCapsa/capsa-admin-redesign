"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Search } from "lucide-react"
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
import { getAdminAssetList } from "../services/adminAssets"
import { toast } from "react-toastify"
import { ErrorToast } from "../components/toast"

const PAGE_SIZE = 10

const TYPE_OPTIONS = [
  { label: "All Assets",                    value: "all"              },
  { label: "Assets Pending Approval",       value: "pending"          },
  { label: "Live Assets",                   value: "live"             },
  { label: "Open Assets for Repayment",     value: "open_repayment"   },
  { label: "Secondary Market Assets",       value: "secondary_market" },
  { label: "Closed Assets",                value: "closed"           },
  { label: "Overdue Assets",               value: "overdue"          },
]

const fmtDate = (iso) => {
  if (!iso || iso === "0000-00-00 00:00:00") return ""
  try { return format(new Date(iso), "MMM d, yyyy") } catch { return iso }
}

const fmtNum = (val) => {
  if (val === null || val === undefined || val === "") return ""
  return Number(val).toLocaleString("en-NG", { maximumFractionDigits: 2 })
}

const STATUS_STYLES = {
  Live:    "bg-[#EBF6FB] text-blue",
  Pending: "bg-[#FEF3C7] text-[#D97706]",
  Closed:  "bg-[#F4F4F5] text-[#71717A]",
  Overdue: "bg-[#FEE2E2] text-[#EF4444]",
}

function StatusBadge({ status }) {
  const cls = STATUS_STYLES[status] ?? "bg-[#F4F4F5] text-[#71717A]"
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${cls}`}>
      {status}
    </span>
  )
}

export default function AssetsPage() {
  const [loading, setLoading]         = useState(true)
  const [assets, setAssets]           = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch]           = useState("")
  const [typeFilter, setTypeFilter]   = useState(TYPE_OPTIONS[0])
  const [fromDate, setFromDate]       = useState("")
  const [toDate, setToDate]           = useState("")

  const fetchData = async ({ page = 1, searchVal = "", type = "all", from = "", to = "" }) => {
    const res = await getAdminAssetList({ page_number: page, page_size: PAGE_SIZE, type, search: searchVal, from_date: from, to_date: to })
    setAssets(res.data?.asset_list ?? [])
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

  const handlePageChange = (page) => { setCurrentPage(page); fetchData({ page, searchVal: search, type: typeFilter.value, from: fromDate, to: toDate }).then(showErrorToast).catch(() => {}) }
  const handleSearch = (val) => { setSearch(val); setCurrentPage(1); fetchData({ page: 1, searchVal: val, type: typeFilter.value, from: fromDate, to: toDate }).then(showErrorToast).catch(() => {}) }
  const handleTypeChange = (opt) => { setTypeFilter(opt); setCurrentPage(1); fetchData({ page: 1, searchVal: search, type: opt.value, from: fromDate, to: toDate }).then(showErrorToast).catch(() => {}) }
  const handleDateChange = (range) => {
    if (!range?.from || !range?.to) return
    const from = format(range.from, "yyyy-MM-dd")
    const to   = format(range.to,   "yyyy-MM-dd")
    setFromDate(from); setToDate(to); setCurrentPage(1)
    fetchData({ page: 1, searchVal: search, type: typeFilter.value, from, to }).then(showErrorToast).catch(() => {})
  }

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <section>
          <h2 className="text-2xl font-bold text-customBlack mb-1">Assets</h2>
          <p className="text-sm text-grey">Showing all assets</p>
        </section>
        <section className="flex items-center gap-3">
          <DateRangePicker label="Select Date Range" showChevron onChange={handleDateChange} />
          <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
        </section>
      </header>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <div className="flex items-center justify-end gap-3 p-4 border-b border-borderGrey">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Search by series details" className="pl-9 h-10 border-borderGrey bg-white" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 border-borderGrey min-w-[220px] justify-between">
                {typeFilter.label}<ChevronDown className="size-4 text-grey" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[220px]">
              {TYPE_OPTIONS.map((opt) => (
                <DropdownMenuItem key={opt.value} className="cursor-pointer" onClick={() => handleTypeChange(opt)}>{opt.label}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto bg-white">
          <table className="min-w-[1800px] w-full text-sm">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Series Details</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Seller</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Unit Value (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">No of Units</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Total Value (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Units Sold</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Issue Date</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Maturity Date</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Discounted On</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Status</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Seller Fee (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor Fee (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Total Fee (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Net Amount (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Prorated Charges (₦)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-borderGrey">
              {assets.length === 0 ? (
                <tr><td colSpan={16} className="text-center py-16 text-grey text-sm">No assets found.</td></tr>
              ) : (
                assets.map((row, i) => (
                  <tr key={`${row.asset_id}-${i}`}>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.series_details}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.seller_name}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.unit_value)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.no_of_units}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.total_value)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.no_of_units_sold}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtDate(row.issued_date)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtDate(row.maturity_date)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtDate(row.discounted_on)}</td>
                    <td className="px-4 py-5 whitespace-nowrap"><StatusBadge status={row.status} /></td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.investor_name}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.seller_fee)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.investor_fee)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.total_fee)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.net_amount)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.prorated_charges)}</td>
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
