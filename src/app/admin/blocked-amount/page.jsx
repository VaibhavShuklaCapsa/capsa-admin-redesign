"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowRight } from "lucide-react"
import Pagination from "../components/Pagination/Pagination"
import PageLoader from "../components/ui/PageLoader"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { getBlockedAmountData, unblockAmount } from "../services/blockedAmount"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "../components/toast"

const ROWS = [
  { id:"1", accountName:"Stanbic IBTC Bank Plc", bvn:"39029028428", accountNumber:"5130383439", date:"Sept 30, 2021", blockedAmount:"200,000,000" },
  { id:"2", accountName:"Shell PLC",             bvn:"39029028428", accountNumber:"5130383439", date:"Sept 30, 2021", blockedAmount:"200,000,000" },
  { id:"3", accountName:"Stanbic IBTC Bank Plc", bvn:"39029028428", accountNumber:"5130383439", date:"Sept 21, 2021", blockedAmount:"200,000,000" },
  { id:"4", accountName:"Delloite Nigeria",       bvn:"39029028428", accountNumber:"5130383439", date:"Mar 21, 2021",  blockedAmount:"200,000,000" },
  { id:"5", accountName:"Stanbic IBTC Bank Plc", bvn:"39029028428", accountNumber:"0039234545", date:"Aug 21, 2021",  blockedAmount:"200,000,000" },
  { id:"6", accountName:"Stanbic IBTC Bank Plc", bvn:"39029028428", accountNumber:"5130383439", date:"Aug 21, 2021",  blockedAmount:"200,000,000" },
  { id:"7", accountName:"Stanbic IBTC Bank Plc", bvn:"39029028428", accountNumber:"0039234545", date:"Aug 21, 2021",  blockedAmount:"200,000,000" },
  { id:"8", accountName:"Stanbic IBTC Bank Plc", bvn:"39029028428", accountNumber:"0039234545", date:"Aug 21, 2021",  blockedAmount:"200,000,000" },
  { id:"9", accountName:"Stanbic IBTC Bank Plc", bvn:"39029028428", accountNumber:"5130383439", date:"Aug 21, 2021",  blockedAmount:"200,000,000" },
]

const PAGE_DATA = {
  rows:       ROWS,
  totalPages: 10,
}

export default function BlockedAmountPage() {
  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    getBlockedAmountData(PAGE_DATA).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  const handleUnblock = async (row) => {
    try {
      const res = await unblockAmount({ id: row.id })
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
      } else {
        toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    }
  }

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Blocked Amount</h2>
        <p className="text-sm text-grey">Showing all blocked inflows</p>
      </header>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Account Name</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">BVN</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Account Number</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Date</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey whitespace-nowrap">Blocked Amount (₦)</TableHead>
                <TableHead className="px-6 py-6 text-left font-bold text-grey">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {data.rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.accountName}</TableCell>
                  <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn}</TableCell>
                  <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.accountNumber}</TableCell>
                  <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.date}</TableCell>
                  <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.blockedAmount}</TableCell>
                  <TableCell className="px-6 py-6">
                    <button
                      onClick={() => handleUnblock(row)}
                      className="flex items-center gap-1 text-sm font-medium text-blue hover:underline"
                    >
                      Unblock <ArrowRight className="size-4" />
                    </button>
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
