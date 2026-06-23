"use client"

import { useEffect, useState } from "react"
import { ChevronDown, MoreHorizontal, Search, Loader2, Calendar } from "lucide-react"
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
import { getAdminInvoicesList, deleteAdminInvoice, cancelAcceptedBid, editInvoiceDueDate } from "../services/adminInvoices"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "../components/toast"

const PAGE_SIZE = 10

// Dropdown label → API type value
const TYPE_OPTIONS = [
  { label: "All Invoices",                   value: "all"             },
  { label: "Invoices Uploaded",              value: "uploaded"        },
  { label: "Invoices Pending Approval",      value: "pending"         },
  { label: "Live Invoices",                  value: "live"            },
  { label: "Bid Accepted Invoices",          value: "bid_accepted"    },
  { label: "Open Invoices for Repayment",    value: "open_repayment"  },
  { label: "Secondary Market Invoices",      value: "secondary_market"},
  { label: "Closed Invoices",               value: "closed"          },
  { label: "Overdue Invoices",              value: "overdue"         },
  { label: "Expired Invoices without Bidding", value: "expired_no_bid" },
]

const fmtDate = (iso) => {
  if (!iso || iso === "0000-00-00 00:00:00") return ""
  try { return format(new Date(iso), "MMM d, yyyy") } catch { return iso }
}

const fmtNum = (val) => {
  if (val === null || val === undefined || val === "") return ""
  return Number(val).toLocaleString("en-NG", { maximumFractionDigits: 2 })
}

// Status badge colours
const STATUS_STYLES = {
  Live:    "bg-[#EBF6FB] text-blue",
  Open:    "bg-lightGreen text-[#16A34A]",
  Closed:  "bg-[#F4F4F5] text-[#71717A]",
  Pending: "bg-[#FEF3C7] text-[#D97706]",
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

// Actions per filter type
const TYPE_ACTIONS = {
  uploaded:       [{ label: "Delete Invoice",       className: "text-[#EF4444]", action: "delete"  }],
  pending:        [{ label: "Delete Invoice",       className: "text-[#EF4444]", action: "delete"  }],
  bid_accepted:   [{ label: "Cancel Accepted Bid",  className: "text-[#EF4444]", action: "cancel"  }],
  open_repayment: [{ label: "Edit Due Date",        className: "",               action: "edit_due" }],
}

function ActionMenu({ row, typeValue, onRefresh, onEditDueDate }) {
  const actions = TYPE_ACTIONS[typeValue] ?? []
  if (actions.length === 0) return null

  const handleAction = async (action) => {
    if (action === "delete") {
      try {
        const res = await deleteAdminInvoice(row.deal_id)
        if (res?.res === "success") {
          toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
          onRefresh?.()
        } else {
          toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
        }
      } catch {
        toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
      }
    } else if (action === "cancel") {
      try {
        const res = await cancelAcceptedBid(row.deal_id, row.invoice_no)
        if (res?.res === "success") {
          toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
          onRefresh?.()
        } else {
          toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
        }
      } catch {
        toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
      }
    } else if (action === "edit_due") {
      onEditDueDate?.(row)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
        <hr />
        {actions.map((a) => (
          <DropdownMenuItem
            key={a.action}
            className={`p-4 text-sm cursor-pointer ${a.className}`}
            onClick={() => handleAction(a.action)}
          >
            {a.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default function InvoicesPage() {
  const [loading, setLoading]         = useState(true)
  const [invoices, setInvoices]       = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch]           = useState("")
  const [typeFilter, setTypeFilter]   = useState(TYPE_OPTIONS[0])
  const [fromDate, setFromDate]       = useState("")
  const [toDate, setToDate]           = useState("")
  const [editDueDateOpen, setEditDueDateOpen]   = useState(false)
  const [editDueDateRow, setEditDueDateRow]     = useState(null)
  const [newDueDate, setNewDueDate]             = useState("")
  const [editDueDateSubmitting, setEditDueDateSubmitting] = useState(false)

  const fetchData = async ({ page = 1, searchVal = "", type = "all", from = "", to = "" }) => {
    const res = await getAdminInvoicesList({
      page_number: page,
      page_size:   PAGE_SIZE,
      type,
      search:      searchVal,
      from_date:   from,
      to_date:     to,
    })
    setInvoices(res.data?.invoice_list ?? [])
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
    fetchData({ page, searchVal: search, type: typeFilter.value, from: fromDate, to: toDate })
      .then(showErrorToast).catch(() => {})
  }

  const handleSearch = (val) => {
    setSearch(val)
    setCurrentPage(1)
    fetchData({ page: 1, searchVal: val, type: typeFilter.value, from: fromDate, to: toDate })
      .then(showErrorToast).catch(() => {})
  }

  const handleTypeChange = (opt) => {
    setTypeFilter(opt)
    setCurrentPage(1)
    fetchData({ page: 1, searchVal: search, type: opt.value, from: fromDate, to: toDate })
      .then(showErrorToast).catch(() => {})
  }

  const handleDateChange = (range) => {
    if (!range?.from || !range?.to) return
    const from = format(range.from, "yyyy-MM-dd")
    const to   = format(range.to,   "yyyy-MM-dd")
    setFromDate(from)
    setToDate(to)
    setCurrentPage(1)
    fetchData({ page: 1, searchVal: search, type: typeFilter.value, from, to })
      .then(showErrorToast).catch(() => {})
  }

  const handleOpenEditDueDate = (row) => {
    setEditDueDateRow(row)
    // Pre-fill with existing due date formatted as yyyy-MM-dd for the input
    const existing = row.due_date ? row.due_date.substring(0, 10) : ""
    setNewDueDate(existing)
    setEditDueDateOpen(true)
  }

  const handleEditDueDateSubmit = async () => {
    if (!newDueDate || !editDueDateRow) return
    setEditDueDateSubmitting(true)
    try {
      const res = await editInvoiceDueDate(editDueDateRow.invoice_no, newDueDate)
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
        setEditDueDateOpen(false)
        fetchData({ page: currentPage, searchVal: search, type: typeFilter.value, from: fromDate, to: toDate })
          .then(showErrorToast).catch(() => {})
      } else {
        toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setEditDueDateSubmitting(false)
    }
  }

  if (loading) return <PageLoader />

  // Expand: one row per bid; if no bids → one row with empty bid columns
  const rows = invoices.flatMap((inv) => {
    if (!inv.bids || inv.bids.length === 0) return [{ ...inv, bid: null }]
    return inv.bids.map((bid) => ({ ...inv, bid }))
  })

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <section>
          <h2 className="text-2xl font-bold text-customBlack mb-1">Invoices</h2>
          <p className="text-sm text-grey">Showing all invoices</p>
        </section>
        <section className="flex items-center gap-3">
          <DateRangePicker label="Select Date Range" showChevron onChange={handleDateChange} />
          <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
        </section>
      </header>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-end gap-3 p-4 border-b border-borderGrey">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by invoice number"
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 border-borderGrey min-w-[220px] justify-between">
                {typeFilter.label}
                <ChevronDown className="size-4 text-grey" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[220px]">
              {TYPE_OPTIONS.map((opt) => (
                <DropdownMenuItem key={opt.value} className="cursor-pointer" onClick={() => handleTypeChange(opt)}>
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white">
          <table className="min-w-[2000px] w-full text-sm">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Invoice No</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Vendor</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Anchor</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Invoice Amount (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Factored Amount (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Invoice Date</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Due Date</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Tenor (Days)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Discounted On</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Presented</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Status</th>
                {/* Bid columns */}
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Bid Type</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Bid Amount (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Monthly Rate (%)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Vendor Fees (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor Fees (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Total Fees (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Net Amount (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Prorated Charges (₦)</th>
                <th className="px-4 py-5 text-left font-bold text-grey">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-borderGrey">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={21} className="text-center py-16 text-grey text-sm">No invoices found.</td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr key={`${row.deal_id}-${i}`}>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.invoice_no}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.vendor_name}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.anchor_name}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.invoice_amount)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.factored_amount)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtDate(row.invoice_date)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtDate(row.due_date)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.tenor_days}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtDate(row.discounted_on)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.presented}</td>
                    <td className="px-4 py-5 whitespace-nowrap"><StatusBadge status={row.status} /></td>
                    {/* Bid columns */}
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.bid?.investor_name ?? ""}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.bid?.bid_type ?? ""}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.bid?.bid_amount)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.bid?.monthly_rate ?? ""}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.bid?.vendor_fees)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.bid?.investor_fees)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.bid?.total_fees)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.bid?.net_amount)}</td>
                    <td className="px-4 py-5 text-tableGrey whitespace-nowrap">{fmtNum(row.bid?.prorated_charges)}</td>
                    <td className="px-4 py-5">
                      <ActionMenu
                        row={row}
                        typeValue={typeFilter.value}
                        onRefresh={() => fetchData({ page: currentPage, searchVal: search, type: typeFilter.value, from: fromDate, to: toDate }).then(showErrorToast).catch(() => {})}
                        onEditDueDate={handleOpenEditDueDate}
                      />
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

      {/* Edit Due Date Dialog */}
      <Dialog open={editDueDateOpen} onOpenChange={setEditDueDateOpen}>
        <DialogContent
          className="p-6 gap-6 rounded-lg border border-[#E4E4E7] bg-white shadow-lg"
          style={{ width: "652px", maxWidth: "652px" }}
        >
          <DialogHeader className="flex flex-row items-center justify-between p-0 space-y-0">
            <DialogTitle style={{ fontSize: "18px", fontWeight: 700, lineHeight: "140%", color: "#09090B" }}>
              Edit Due Date
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <p style={{ fontSize: "18px", fontWeight: 500, lineHeight: "140%", color: "#09090B" }}>
              Select Due Date
            </p>
            <div className="relative flex items-center border border-[#E4E4E7] rounded-lg px-4 h-14 bg-white">
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="flex-1 outline-none bg-transparent"
                style={{ fontSize: "18px", fontWeight: 400, lineHeight: "140%", color: "#09090B" }}
              />
              <Calendar className="size-5 text-grey shrink-0 pointer-events-none" />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleEditDueDateSubmit}
              disabled={editDueDateSubmitting || !newDueDate}
              className="flex items-center justify-center gap-2 rounded-lg disabled:opacity-60"
              style={{
                height: "44px",
                padding: "8px 16px",
                background: "#0098DB",
                color: "#FAFAFA",
                fontSize: "16px",
                fontWeight: 500,
                lineHeight: "140%",
                minWidth: "100px",
              }}
            >
              {editDueDateSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Update"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
