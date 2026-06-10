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
import { getVendorSweepInData } from "../services/vendorSweepIn"

const ROWS = [
  { id:"1", productNo:"PRD-0001",   productType:"Swap",       accountName:"Stanbic IBTC Bank Plc", bvn:"39029028428", accountType:"Investor", event:"Initiated",          transactionAmount:"200,000,000", transactionDate:"Sept 30, 2021 06:48 AM", sweepInStatus:"Settled", sweepInDate:"Sept 30, 2021 06:48 AM" },
  { id:"2", productNo:"PRD-0001",   productType:"Redemption", accountName:"Shell PLC",             bvn:"39029028428", accountType:"Vendor",   event:"Completed",          transactionAmount:"200,000,000", transactionDate:"Sept 30, 2021 06:48 AM", sweepInStatus:"Settled", sweepInDate:"Sept 30, 2021 06:48 AM" },
  { id:"3", productNo:"APR15TH-1",  productType:"Invoice",    accountName:"Stanbic IBTC Bank Plc", bvn:"39029028428", accountType:"Vendor",   event:"Discount of Invoice", transactionAmount:"200,000,000", transactionDate:"Sept 30, 2021 06:48 AM", sweepInStatus:"Settled", sweepInDate:"Sept 30, 2021 06:48 AM" },
  { id:"4", productNo:"APR15TH-2",  productType:"Invoice",    accountName:"Delloite Nigeria",       bvn:"39029028428", accountType:"Vendor",   event:"Discount of Invoice", transactionAmount:"200,000,000", transactionDate:"Sept 30, 2021 06:48 AM", sweepInStatus:"Settled", sweepInDate:"Sept 30, 2021 06:48 AM" },
  { id:"5", productNo:"INV062025-3",productType:"Invoice",    accountName:"Stanbic IBTC Bank Plc", bvn:"39029028428", accountType:"Investor", event:"Discount of Invoice", transactionAmount:"200,000,000", transactionDate:"Sept 30, 2021 06:48 AM", sweepInStatus:"Settled", sweepInDate:"Sept 30, 2021 06:48 AM" },
]

const PAGE_DATA = {
  dateRangeLabel: "Jan 20, 2023 - Feb 09, 2023",
  rows:           ROWS,
  totalPages:     10,
}

function SweepInStatusBadge({ status }) {
  const isSettled = status === "Settled"
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
      isSettled ? "bg-lightGreen text-[#16A34A]" : "bg-[#FEF3C7] text-[#D97706]"
    }`}>
      {status}
    </span>
  )
}

export default function VendorSweepInListPage() {
  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    getVendorSweepInData(PAGE_DATA).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Vendor Sweep-In List</h2>
        <p className="text-sm text-grey">Showing sweep entries</p>
      </header>

      <div className="flex items-center justify-between gap-4">
        <DateRangePicker label={data.dateRangeLabel} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
      </div>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <div className="overflow-x-auto bg-white">
          <table className="min-w-[1400px] w-full text-sm">
            <thead className="bg-white">
              <tr>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Product No</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Product Type</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Account Name</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">BVN</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Account Type</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Event</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Transaction Amount (₦)</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Transaction Date (₦)</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Sweep In Status</th>
                <th className="px-5 py-6 text-left font-bold text-grey whitespace-nowrap">Sweep In Date (₦)</th>
                <th className="px-5 py-6 text-left font-bold text-grey">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-borderGrey">
              {data.rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{row.productNo}</td>
                  <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{row.productType}</td>
                  <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{row.accountName}</td>
                  <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{row.bvn}</td>
                  <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{row.accountType}</td>
                  <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{row.event}</td>
                  <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{row.transactionAmount}</td>
                  <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{row.transactionDate}</td>
                  <td className="px-5 py-6 whitespace-nowrap"><SweepInStatusBadge status={row.sweepInStatus} /></td>
                  <td className="px-5 py-6 text-tableGrey whitespace-nowrap">{row.sweepInDate}</td>
                  <td className="px-5 py-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-48">
                        <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
                        <hr />
                        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => console.log("View", row)}>
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <footer className="p-4 border-t border-borderGrey">
          <Pagination currentPage={currentPage} totalPages={data.totalPages} onPageChange={setCurrentPage} />
        </footer>
      </section>
    </section>
  )
}
