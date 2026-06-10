"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal } from "lucide-react"
import DateRangePicker from "../components/ui/DateRangePicker"
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
import {
  getReconciliationData,
  viewBalanceHistory,
  viewAccountStatement,
} from "../services/reconciliation"

const TABLE_HEADER = [
  { key: "Pool Account Balance (₦)",    title: "poolAccountBalance"    },
  { key: "Capsa Platform Balance (₦)",  title: "capsaPlatformBalance"  },
  { key: "Difference (₦)",              title: "difference"            },
]

const ROWS = [
  {
    id: "1",
    poolAccountBalance:   "200,000,000",
    capsaPlatformBalance: "200,000,000",
    difference:           "200,000,000",
  },
]

const PAGE_DATA = {
  pageTitle:      "Reconciliation",
  pageSubtitle:   "Showing balance history",
  dateRangeLabel: "Jan 20, 2023 - Feb 09, 2023",
  downloadLabel:  "Download",
  tableHeader:    TABLE_HEADER,
  rows:           ROWS,
}

export default function ReconciliationPage() {
  const router                = useRouter()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getReconciliationData(PAGE_DATA).then((res) => {
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

      <section className="flex items-center justify-between gap-4">
        <DateRangePicker label={data.dateRangeLabel} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">
          {data.downloadLabel}
        </Button>
      </section>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">

        {/* Action buttons toolbar */}
        <div className="flex items-center justify-end gap-3 p-4 border-b border-borderGrey">
          <Button
            variant="outline"
            className="h-10 gap-2 border-borderGrey text-sm font-medium"
            onClick={() => router.push("/admin/reconciliation/balance-history")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            View Balance History
          </Button>

          <Button
            variant="outline"
            className="h-10 gap-2 border-borderGrey text-sm font-medium"
            onClick={() => viewAccountStatement({})}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Account Statement
          </Button>
        </div>

        {/* Table */}
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
                        <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
                        <hr />
                        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => console.log("View details", row)}>
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
      </section>
    </section>
  )
}
