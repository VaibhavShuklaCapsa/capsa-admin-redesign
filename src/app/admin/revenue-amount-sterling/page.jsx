"use client"

import { useEffect, useMemo, useState } from "react"
import { MoreHorizontal, Search } from "lucide-react"
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
import { getRevenueAmountSterlingData } from "../services/revenueAmountSterling"

const ROWS = [
  { id:"1", date:"Sept 30, 2021", invoiceNo:"IN0000001",  status:"Open",    vendor:"Normal Vendor", investor:"Mustapha Suberu",   invoiceAmount:"200,000,000", capsaFees:"20,000", sterlingFees:"20,000", totalFees:"40,000" },
  { id:"2", date:"Sept 30, 2021", invoiceNo:"IN0000232",  status:"Open",    vendor:"Normal Vendor", investor:"Kodvest",           invoiceAmount:"200,000,000", capsaFees:"20,000", sterlingFees:"20,000", totalFees:"40,000" },
  { id:"3", date:"Sept 21, 2021", invoiceNo:"INVG672627", status:"Open",    vendor:"Normal Vendor", investor:"Griffin Finance",   invoiceAmount:"200,000,000", capsaFees:"20,000", sterlingFees:"20,000", totalFees:"40,000" },
  { id:"4", date:"Mar 21, 2021",  invoiceNo:"INVB47827",  status:"Open",    vendor:"Normal Vendor", investor:"Kudy Financials",   invoiceAmount:"200,000,000", capsaFees:"20,000", sterlingFees:"20,000", totalFees:"40,000" },
  { id:"5", date:"Aug 21, 2021",  invoiceNo:"IN0000001",  status:"Open",    vendor:"Normal Vendor", investor:"ASPAC Cooperative", invoiceAmount:"200,000,000", capsaFees:"20,000", sterlingFees:"20,000", totalFees:"40,000" },
  { id:"6", date:"Aug 21, 2021",  invoiceNo:"IN0000001",  status:"Open",    vendor:"Normal Vendor", investor:"Samiat Aremu",      invoiceAmount:"200,000,000", capsaFees:"20,000", sterlingFees:"20,000", totalFees:"40,000" },
  { id:"7", date:"Aug 21, 2021",  invoiceNo:"IN0000001",  status:"Open",    vendor:"Normal Vendor", investor:"Mustapha Suberu",   invoiceAmount:"200,000,000", capsaFees:"20,000", sterlingFees:"20,000", totalFees:"40,000" },
  { id:"8", date:"Aug 21, 2021",  invoiceNo:"IN0000001",  status:"Overdue", vendor:"Normal Vendor", investor:"Kodvest",           invoiceAmount:"200,000,000", capsaFees:"20,000", sterlingFees:"20,000", totalFees:"40,000" },
  { id:"9", date:"Aug 21, 2021",  invoiceNo:"IN0000001",  status:"Overdue", vendor:"Normal Vendor", investor:"Griffin Finance",   invoiceAmount:"200,000,000", capsaFees:"20,000", sterlingFees:"20,000", totalFees:"40,000" },
]

const PAGE_DATA = {
  dateRangeLabel: "Jan 20, 2023 - Feb 09, 2023",
  rows:           ROWS,
  totalPages:     10,
}

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

export default function RevenueAmountSterlingPage() {
  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    getRevenueAmountSterlingData(PAGE_DATA).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.toLowerCase().trim()
    if (!q) return data.rows
    return data.rows.filter((r) => r.invoiceNo.toLowerCase().includes(q))
  }, [data, search])

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Revenue Amount (Sterling)</h2>
        <p className="text-sm text-grey">Showing all revenue entries</p>
      </header>

      <div className="flex items-center justify-between gap-4">
        <DateRangePicker label={data.dateRangeLabel} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
      </div>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <div className="flex justify-end p-4 border-b border-borderGrey">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              placeholder="Search by invoice number"
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Date</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Invoice No</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Status</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Vendor</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Investor</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Invoice Amount (₦)</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Capsa Fees (₦)</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Sterling Fees (₦)</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey whitespace-nowrap">Total Fees (₦)</TableHead>
                <TableHead className="px-4 py-5 text-left font-bold text-grey">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.date}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.invoiceNo}</TableCell>
                  <TableCell className="px-4 py-5 whitespace-nowrap"><StatusBadge status={row.status} /></TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.vendor}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.investor}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.invoiceAmount}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.capsaFees}</TableCell>
                  <TableCell className="px-4 py-5 text-tableGrey whitespace-nowrap">{row.sterlingFees}</TableCell>
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
      </section>
    </section>
  )
}
