"use client"

import { useEffect, useMemo, useState } from "react"
import { MoreHorizontal, Search } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"
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
  getRevenueAmountInvoices,
  getRevenueAmountRevenues,
  getRevenueAmountAssets,
} from "../services/revenueAmount"

// ── Mock data ────────────────────────────────────────────────────────────────

const INVESTORS = [
  "Mustapha Suberu", "Kodvest", "Griffin Finance", "Kudy Financials",
  "ASPAC Cooperative", "Samiat Aremu", "Mustapha Suberu", "Kodvest", "Griffin Finance",
]

const INVOICE_ROWS = [
  { id:"1", date:"Sept 30, 2021", refNo:"IN0000001",   status:"Open",    vendor:"Normal Vendor", investor:"Mustapha Suberu",   invoiceAmount:"200,000,000", vendorFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"2", date:"Sept 30, 2021", refNo:"IN0000232",   status:"Open",    vendor:"Normal Vendor", investor:"Kodvest",           invoiceAmount:"200,000,000", vendorFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"3", date:"Sept 21, 2021", refNo:"INVG672627",  status:"Open",    vendor:"Normal Vendor", investor:"Griffin Finance",   invoiceAmount:"200,000,000", vendorFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"4", date:"Mar 21, 2021",  refNo:"INVB47827",   status:"Open",    vendor:"Normal Vendor", investor:"Kudy Financials",   invoiceAmount:"200,000,000", vendorFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"5", date:"Aug 21, 2021",  refNo:"IN0000001",   status:"Open",    vendor:"Normal Vendor", investor:"ASPAC Cooperative", invoiceAmount:"200,000,000", vendorFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"6", date:"Aug 21, 2021",  refNo:"IN0000001",   status:"Open",    vendor:"Normal Vendor", investor:"Samiat Aremu",      invoiceAmount:"200,000,000", vendorFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"7", date:"Aug 21, 2021",  refNo:"IN0000001",   status:"Open",    vendor:"Normal Vendor", investor:"Mustapha Suberu",   invoiceAmount:"200,000,000", vendorFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"8", date:"Aug 21, 2021",  refNo:"IN0000001",   status:"Overdue", vendor:"Normal Vendor", investor:"Kodvest",           invoiceAmount:"200,000,000", vendorFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"9", date:"Aug 21, 2021",  refNo:"IN0000001",   status:"Overdue", vendor:"Normal Vendor", investor:"Griffin Finance",   invoiceAmount:"200,000,000", vendorFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
]

const REVENUE_ROWS = INVOICE_ROWS.map((r) => ({
  ...r,
  refNo: r.refNo.replace("IN", "RV").replace("INV", "RV"),
}))

const ASSET_ROWS = [
  { id:"1", date:"Sept 30, 2021", seriesDetails:"Sovereign Debt Notes Series I",        status:"Open",    vendor:"Normal Vendor", investor:"Mustapha Suberu",   totalValue:"200,000,000", sellerFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"2", date:"Sept 30, 2021", seriesDetails:"Corporate Debt Notes Series XX",       status:"Open",    vendor:"Normal Vendor", investor:"Kodvest",           totalValue:"200,000,000", sellerFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"3", date:"Sept 21, 2021", seriesDetails:"Corporate Debt Investment III",        status:"Open",    vendor:"Normal Vendor", investor:"Griffin Finance",   totalValue:"200,000,000", sellerFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"4", date:"Mar 21, 2021",  seriesDetails:"Sovereign Debt Notes Series IV",       status:"Open",    vendor:"Normal Vendor", investor:"Kudy Financials",   totalValue:"200,000,000", sellerFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"5", date:"Aug 21, 2021",  seriesDetails:"Corporate Debt Notes Series II",       status:"Open",    vendor:"Normal Vendor", investor:"ASPAC Cooperative", totalValue:"200,000,000", sellerFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"6", date:"Aug 21, 2021",  seriesDetails:"Sovereign Debt Investment Fund A",     status:"Open",    vendor:"Normal Vendor", investor:"Samiat Aremu",      totalValue:"200,000,000", sellerFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"7", date:"Aug 21, 2021",  seriesDetails:"Corporate Debt Instruments Series V",  status:"Open",    vendor:"Normal Vendor", investor:"Mustapha Suberu",   totalValue:"200,000,000", sellerFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"8", date:"Aug 21, 2021",  seriesDetails:"Sovereign Debt Bonds Series III",      status:"Overdue", vendor:"Normal Vendor", investor:"Kodvest",           totalValue:"200,000,000", sellerFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
  { id:"9", date:"Aug 21, 2021",  seriesDetails:"Corporate Debt Notes Series VII",      status:"Overdue", vendor:"Normal Vendor", investor:"Griffin Finance",   totalValue:"200,000,000", sellerFees:"20,000", investorFees:"20,000", totalFees:"40,000" },
]

const DATE_RANGE_LABEL = "Jan 20, 2023 - Feb 09, 2023"

// ── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const isOverdue = status === "Overdue"
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
      isOverdue ? "bg-[#FEE2E2] text-[#EF4444]" : "bg-[#EBF6FB] text-blue"
    }`}>
      {status}
    </span>
  )
}

// ── Invoices / Revenues tab content ──────────────────────────────────────────

function InvoiceRevenueTab({ rows, refNoLabel, searchPlaceholder, fetchFn, mockData }) {
  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    fetchFn(mockData).then((res) => {
      setData(res)
      setLoading(false)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.toLowerCase().trim()
    if (!q) return data.rows
    return data.rows.filter((r) => r.refNo.toLowerCase().includes(q))
  }, [data, search])

  if (loading) return <div className="flex justify-center items-center py-16"><img src="/images/loader.gif" width={80} height={80} alt="Loading" className="object-contain" /></div>

  return (
    <>
      {/* Search */}
      <div className="flex justify-end p-4 border-b border-borderGrey">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            placeholder={searchPlaceholder}
            className="pl-9 h-10 border-borderGrey bg-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="bg-white">
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Date</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">{refNoLabel}</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Status</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Vendor</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Invoice Amount (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Vendor Fees (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor Fees (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Total Fees (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {filtered.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.date}</TableCell>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.refNo}</TableCell>
                <TableCell className="px-4 py-5 whitespace-nowrap"><StatusBadge status={row.status} /></TableCell>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.vendor}</TableCell>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.investor}</TableCell>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.invoiceAmount}</TableCell>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.vendorFees}</TableCell>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.investorFees}</TableCell>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.totalFees}</TableCell>
                <TableCell className="px-4 py-5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-48">
                      <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <footer className="p-4 border-t border-borderGrey">
        <Pagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={setCurrentPage} />
      </footer>
    </>
  )
}

// ── Assets tab content ────────────────────────────────────────────────────────

function AssetsTab() {
  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    getRevenueAmountAssets({ rows: ASSET_ROWS, totalPages: 10 }).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.toLowerCase().trim()
    if (!q) return data.rows
    return data.rows.filter((r) => r.seriesDetails.toLowerCase().includes(q))
  }, [data, search])

  if (loading) return <div className="flex justify-center items-center py-16"><img src="/images/loader.gif" width={80} height={80} alt="Loading" className="object-contain" /></div>

  return (
    <>
      <div className="flex justify-end p-4 border-b border-borderGrey">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
          <Input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
            placeholder="Search by series details"
            className="pl-9 h-10 border-borderGrey bg-white"
          />
        </div>
      </div>

      <div className="overflow-x-auto bg-white">
        <Table>
          <TableHeader className="bg-white">
            <TableRow className="bg-white">
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Date</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Series Details</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Status</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Vendor</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Total Value (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Seller Fees (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor Fees (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Total Fees (₦)</TableHead>
              <TableHead className="px-4 py-5 text-left font-bold text-grey">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white">
            {filtered.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.date}</TableCell>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.seriesDetails}</TableCell>
                <TableCell className="px-4 py-5 whitespace-nowrap"><StatusBadge status={row.status} /></TableCell>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.vendor}</TableCell>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.investor}</TableCell>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.totalValue}</TableCell>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.sellerFees}</TableCell>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.investorFees}</TableCell>
                <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.totalFees}</TableCell>
                <TableCell className="px-4 py-5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-48">
                      <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <footer className="p-4 border-t border-borderGrey">
        <Pagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={setCurrentPage} />
      </footer>
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RevenueAmountPage() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Revenue Amount</h2>
        <p className="text-sm text-grey">Showing all revenue entries</p>
      </header>

      <Tabs defaultValue="invoices">
        <TabsList className="bg-deepGrey h-auto p-1 rounded-xl w-fit justify-start mb-4">
          <TabsTrigger value="invoices"  className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Invoices</TabsTrigger>
          <TabsTrigger value="revenues" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Revenues</TabsTrigger>
          <TabsTrigger value="assets"   className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Assets</TabsTrigger>
        </TabsList>

        {/* Date + Download (shared) */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <DateRangePicker label={DATE_RANGE_LABEL} />
          <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
        </div>

        <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
          <TabsContent value="invoices" className="mt-0">
            <InvoiceRevenueTab
              rows={INVOICE_ROWS}
              refNoLabel="Invoice No"
              searchPlaceholder="Search by invoice number"
              fetchFn={getRevenueAmountInvoices}
              mockData={{ rows: INVOICE_ROWS, totalPages: 10 }}
            />
          </TabsContent>

          <TabsContent value="revenues" className="mt-0">
            <InvoiceRevenueTab
              rows={REVENUE_ROWS}
              refNoLabel="Revenue No"
              searchPlaceholder="Search by revenue number"
              fetchFn={getRevenueAmountRevenues}
              mockData={{ rows: REVENUE_ROWS, totalPages: 10 }}
            />
          </TabsContent>

          <TabsContent value="assets" className="mt-0">
            <AssetsTab />
          </TabsContent>
        </section>
      </Tabs>
    </section>
  )
}
