"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal } from "lucide-react"
import DateRangePicker from "../components/ui/DateRangePicker"
import Pagination from "../components/Pagination/Pagination"
import PageLoader from "../components/ui/PageLoader"
import { Button } from "../components/ui/button"
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
import { getRevenueData } from "../services/revenue"

const TABLE_HEADER = [
  { key: "Transaction Month", title: "transactionMonth" },
  { key: "Vendor Fees (₦)",   title: "vendorFees"       },
  { key: "Investor Fees (₦)", title: "investorFees"     },
  { key: "Total Revenue (₦)", title: "totalRevenue"     },
]

const ROWS = [
  { id: "1", transactionMonth: "January 2026",   vendorFees: "200,000,000", investorFees: "200,000,000", totalRevenue: "200,000,000" },
  { id: "2", transactionMonth: "December 2025",  vendorFees: "200,000,000", investorFees: "200,000,000", totalRevenue: "200,000,000" },
  { id: "3", transactionMonth: "November 2025",  vendorFees: "200,000,000", investorFees: "200,000,000", totalRevenue: "200,000,000" },
  { id: "4", transactionMonth: "October 2025",   vendorFees: "200,000,000", investorFees: "200,000,000", totalRevenue: "200,000,000" },
  { id: "5", transactionMonth: "September 2025", vendorFees: "200,000,000", investorFees: "200,000,000", totalRevenue: "200,000,000" },
  { id: "6", transactionMonth: "August 2025",    vendorFees: "200,000,000", investorFees: "200,000,000", totalRevenue: "200,000,000" },
  { id: "7", transactionMonth: "July 2025",      vendorFees: "200,000,000", investorFees: "200,000,000", totalRevenue: "200,000,000" },
  { id: "8", transactionMonth: "June 2025",      vendorFees: "200,000,000", investorFees: "200,000,000", totalRevenue: "200,000,000" },
  { id: "9", transactionMonth: "May 2025",       vendorFees: "200,000,000", investorFees: "200,000,000", totalRevenue: "200,000,000" },
]

const PAGE_DATA = {
  pageTitle:      "Revenue",
  pageSubtitle:   "Showing revenue per month",
  dateRangeLabel: "Jan 20, 2023 - Feb 09, 2023",
  tableHeader:    TABLE_HEADER,
  rows:           ROWS,
  totalPages:     10,
}

export default function RevenuePage() {
  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    getRevenueData(PAGE_DATA).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">{data.pageTitle}</h2>
        <p className="text-sm text-grey">{data.pageSubtitle}</p>
      </header>

      {/* Date + Download */}
      <div className="flex items-center justify-between gap-4">
        <DateRangePicker label={data.dateRangeLabel} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">
          Download
        </Button>
      </div>

      {/* Table card */}
      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                {data.tableHeader.map((col) => (
                  <TableHead key={col.key} className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">
                    {col.key}
                  </TableHead>
                ))}
                <TableHead className="px-6 py-6 text-left font-bold text-grey">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white">
              {data.rows.map((row) => (
                <TableRow key={row.id}>
                  {data.tableHeader.map((col) => (
                    <TableCell key={col.key} className="px-6 py-6 text-tableGrey whitespace-nowrap">
                      {row[col.title]}
                    </TableCell>
                  ))}
                  <TableCell className="px-6 py-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-48">
                        <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">
                          Actions
                        </DropdownMenuItem>
                        <hr />
                        <DropdownMenuItem
                          className="p-4 text-sm cursor-pointer"
                          onClick={() => console.log("View details", row)}
                        >
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <footer className="p-4 border-t border-borderGrey">
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        </footer>
      </section>
    </section>
  )
}
