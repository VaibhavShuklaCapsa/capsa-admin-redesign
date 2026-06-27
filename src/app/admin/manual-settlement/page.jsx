"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ArrowRight, Filter, Search, X } from "lucide-react"
import DateRangePicker from "../components/ui/DateRangePicker"
import Pagination from "../components/Pagination/Pagination"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import {
  getManualSettlementInvoices,
  getManualSettlementRFInvoices,
  getManualSettlementRevenues,
  getManualSettlementAssets,
  applySettlementAsset,
  applySettlementInvoice,
  applySettlementRFInvoice,
  applySettlementRevenue,
} from "../services/manualSettlement"
import { toast } from "react-toastify"
import { ErrorToast, SuccessToast } from "../components/toast"

const PAGE_SIZE = 10

const fmtDate = (iso) => {
  if (!iso) return ""
  try { return format(new Date(iso), "MMM d, yyyy") } catch { return iso }
}

const fmtNum = (val) => {
  if (val === null || val === undefined) return ""
  return Number(val).toLocaleString("en-NG", { maximumFractionDigits: 2 })
}

const renderCell = (col, row) => {
  const val = row[col.title]
  if (col.fmt === "num")  return fmtNum(val)
  if (col.fmt === "date") return fmtDate(val)
  return val ?? ""
}

// ─── Table headers ────────────────────────────────────────────────────────────

const INVOICE_HEADER = [
  { key: "Invoice No",         title: "invoice_no"                    },
  { key: "Vendor Name",        title: "vendor_name"                   },
  { key: "Anchor Name",        title: "anchor_name"                   },
  { key: "Invoice Amount (₦)", title: "invoice_amount", fmt: "num"   },
  { key: "Issue Date",         title: "issue_date",     fmt: "date"  },
  { key: "Due Date",           title: "due_date",       fmt: "date"  },
]

const REVENUE_HEADER = [
  { key: "Revenue No",       title: "revenue_no"                      },
  { key: "Vendor Name",      title: "vendor_name"                     },
  { key: "Total Value (₦)",  title: "total_value",    fmt: "num"     },
  { key: "Investor",         title: "investor"                        },
  { key: "Installment Date", title: "installment_date", fmt: "date"  },
  { key: "Maturity Date",    title: "maturity_date",    fmt: "date"  },
]

const ASSET_HEADER = [
  { key: "Series Details", title: "series_details"                  },
  { key: "Seller",         title: "seller"                          },
  { key: "Investor",       title: "investor"                        },
  { key: "Unit Value (₦)", title: "unit_value",  fmt: "num"        },
  { key: "Units Sold",     title: "units_sold"                      },
  { key: "Start Date",     title: "start_date",  fmt: "date"       },
]

// ─── Settle dialog config per tab ─────────────────────────────────────────────
// Defines the 3 fields shown in the confirmation card

const INVOICE_SETTLE_CONFIG = [
  { label: "Invoice No", field: "invoice_no"    },
  { label: "Vendor",     field: "vendor_name"   },
  { label: "Amount",     field: "invoice_amount", fmt: "num" },
]

const REVENUE_SETTLE_CONFIG = [
  { label: "Revenue No", field: "revenue_no"  },
  { label: "Vendor",     field: "vendor_name" },
  { label: "Amount",     field: "total_value", fmt: "num" },
]

const ASSET_SETTLE_CONFIG = [
  { label: "Series Details", field: "series_details" },
  { label: "Seller",         field: "seller"         },
  { label: "Amount",         field: "unit_value", fmt: "num" },
]

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  {
    value:             "invoices",
    label:             "Invoices",
    sectionTitle:      "Invoice List",
    searchPlaceholder: "Search by invoice number, vendor",
    tableHeader:       INVOICE_HEADER,
    dataKey:           "settlement_list",
    settleConfig:      INVOICE_SETTLE_CONFIG,
    fetchFn:           getManualSettlementInvoices,
    settleFn:          (row) => applySettlementInvoice({ pan: row.vendor_pan, invoice: row.invoice_no }),
  },
  {
    value:             "rf-invoices",
    label:             "RF Invoices",
    sectionTitle:      "RF Invoice List",
    searchPlaceholder: "Search by invoice number, vendor",
    tableHeader:       INVOICE_HEADER,
    dataKey:           "settlement_list",
    settleConfig:      INVOICE_SETTLE_CONFIG,
    fetchFn:           getManualSettlementRFInvoices,
    settleFn:          (row) => applySettlementRFInvoice({ pan: row.vendor_pan, invoice: row.invoice_no }),
  },
  {
    value:             "revenues",
    label:             "Revenues",
    sectionTitle:      "Revenue List",
    searchPlaceholder: "Search by revenue number, vendor name",
    tableHeader:       REVENUE_HEADER,
    dataKey:           "settlement_list",
    settleConfig:      REVENUE_SETTLE_CONFIG,
    fetchFn:           getManualSettlementRevenues,
    settleFn:          (row) => applySettlementRevenue({ deal_id: row.deal_id }),
  },
  {
    value:             "assets",
    label:             "Assets",
    sectionTitle:      "Asset List",
    searchPlaceholder: "Search by series details, seller",
    tableHeader:       ASSET_HEADER,
    dataKey:           "settlement_list",
    settleConfig:      ASSET_SETTLE_CONFIG,
    fetchFn:           getManualSettlementAssets,
    settleFn:          (row) => applySettlementAsset({ deal_id: row.deal_id }),
  },
]

// ─── Settlement Confirm Modal ─────────────────────────────────────────────────

function SettlementConfirmModal({ open, onClose, row, settleConfig, onConfirm, onSuccess }) {
  const [submitting, setSubmitting] = useState(false)
  if (!row) return null

  const getVal = (cfg) => {
    const val = row[cfg.field]
    if (cfg.fmt === "num") return `₦${fmtNum(val)}`
    return val ?? "—"
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent
        style={{
          width: "451px",
          maxWidth: "451px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "24px",
          borderRadius: "8px",
          border: "1px solid #E4E4E7",
          background: "#FFF",
          boxShadow: "0 4px 6px -4px rgba(16, 24, 40, 0.10), 0 10px 15px -3px rgba(0, 0, 0, 0.10)",
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: "#09090B", fontFamily: "Satoshi", fontSize: "18px", fontWeight: 700, lineHeight: "140%" }}>
            Settlement Confirmation
          </DialogTitle>
        </DialogHeader>

        <p style={{ color: "#71717A", fontFamily: "Satoshi", fontSize: "14px", fontWeight: 400, lineHeight: "140%" }}>
          Do you wish to proceed with the settlement?
        </p>

        {/* Detail card */}
        <div
          style={{
            width: "403px",
            padding: "24px 16px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "8px",
            borderRadius: "8px",
            border: "1px solid #E9EAEB",
            background: "#FAFAFA",
          }}
        >
          <div style={{ display: "flex", width: "100%", gap: "8px" }}>
            {settleConfig.map((cfg) => (
              <div key={cfg.label} style={{ flex: "1 1 0", minWidth: 0, display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ color: "#71717A", fontFamily: "Satoshi", fontSize: "12px", fontWeight: 500, lineHeight: "140%" }}>
                  {cfg.label}
                </span>
                <span
                  style={{ color: "#09090B", fontFamily: "Plus Jakarta Sans", fontSize: "14px", fontWeight: 600, lineHeight: "140%", letterSpacing: "-0.28px", wordBreak: "break-word", overflowWrap: "break-word" }}
                >
                  {getVal(cfg)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 w-full">
          <button
            onClick={onClose}
            style={{
              display: "flex",
              height: "44px",
              padding: "8px 16px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              borderRadius: "8px",
              border: "1px solid #E4E4E7",
              background: "#FFF",
              color: "#09090B",
              fontFamily: "Satoshi",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "140%",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            disabled={submitting}
            onClick={async () => {
              if (!onConfirm) return
              setSubmitting(true)
              try {
                const res = await onConfirm(row)
                if (res?.res === "success") {
                  toast(<SuccessToast message={res?.messg || "Settlement applied successfully."} />, { style: { padding: 0 } })
                  onClose()
                  onSuccess?.()
                } else {
                  toast(<ErrorToast message={res?.messg || "Settlement failed."} />, { style: { padding: 0 } })
                }
              } catch {
                toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
              } finally {
                setSubmitting(false)
              }
            }}
            style={{
              display: "flex",
              height: "44px",
              padding: "8px 16px",
              justifyContent: "center",
              alignItems: "center",
              gap: "8px",
              borderRadius: "8px",
              background: "#0098DB",
              border: "none",
              color: "#FAFAFA",
              fontFamily: "Satoshi",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "140%",
              cursor: "pointer",
            }}
          >
            {submitting ? "Processing..." : "Yes, Settle"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ─── Tab content ──────────────────────────────────────────────────────────────

function SettlementTabContent({ tab }) {
  const [loading, setLoading]         = useState(true)
  const [rows, setRows]               = useState([])
  const [totalPages, setTotalPages]   = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch]           = useState("")
  const [fromDate, setFromDate]       = useState("")
  const [toDate, setToDate]           = useState("")
  const [settleRow, setSettleRow]     = useState(null)

  const fetchData = async ({ page = 1, searchVal = "", from = "", to = "" }) => {
    const res = await tab.fetchFn({ page_number: page, page_size: PAGE_SIZE, search: searchVal, from_date: from, to_date: to })
    setRows(res.data?.[tab.dataKey] ?? [])
    setTotalPages(res.data?.pagination?.total_pages ?? 1)
    return res
  }

  const showErrorToast = (res) => {
    if (res?.res !== "success" && res?.messg) {
      toast(<ErrorToast message={res.messg} />, { style: { padding: 0 } })
    }
  }

  useEffect(() => {
    setLoading(true)
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

  return (
    <div className="space-y-6">
      <h3 className="text-base font-bold text-customBlack">{tab.sectionTitle}</h3>

      <section className="flex items-center justify-between gap-4">
        <DateRangePicker label="Select Date Range" onChange={handleDateChange} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
      </section>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <div className="flex items-center justify-end gap-3 p-4 border-b border-borderGrey">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={tab.searchPlaceholder}
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>
          <Button variant="outline" className="h-10 gap-2 border-borderGrey">
            <Filter className="size-4" />
            Filters
          </Button>
        </div>

        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                {tab.tableHeader.map((col) => (
                  <TableHead key={col.key} className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">
                    {col.key}
                  </TableHead>
                ))}
                <TableHead className="px-6 py-6 text-left font-bold text-grey">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={tab.tableHeader.length + 1} className="text-center py-16 text-grey text-sm">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={tab.tableHeader.length + 1} className="text-center py-16 text-grey text-sm">
                    No data found.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row, i) => (
                  <TableRow key={row.deal_id ?? row.asset_id ?? i}>
                    {tab.tableHeader.map((col) => (
                      <TableCell key={col.key} className="px-6 py-6 text-tableGrey whitespace-nowrap">
                        {renderCell(col, row)}
                      </TableCell>
                    ))}
                    <TableCell className="px-6 py-6">
                      <button
                        className="flex items-center gap-1 text-sm font-semibold text-blue hover:opacity-80 transition-opacity whitespace-nowrap"
                        onClick={() => setSettleRow(row)}
                      >
                        Settle <ArrowRight className="size-4" />
                      </button>
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

      <SettlementConfirmModal
        open={!!settleRow}
        onClose={() => setSettleRow(null)}
        row={settleRow}
        settleConfig={tab.settleConfig}
        onConfirm={tab.settleFn ?? null}
        onSuccess={() => fetchData({ page: currentPage, searchVal: search, from: fromDate, to: toDate })}
      />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManualSettlementPage() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Manual Settlement</h2>
        <p className="text-sm text-grey">Showing receivables that can be settled manually</p>
      </header>

      <Tabs defaultValue="invoices" className="gap-6">
        <TabsList className="bg-deepGrey h-auto p-1 rounded-xl w-fit justify-start">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <SettlementTabContent tab={tab} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
