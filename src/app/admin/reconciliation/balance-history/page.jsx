"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronDown, Search } from "lucide-react"
import DateRangePicker from "../../components/ui/DateRangePicker"
import Pagination from "../../components/Pagination/Pagination"
import PageLoader from "../../components/ui/PageLoader"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table"
import { viewBalanceHistory } from "../../services/reconciliation"

const TABLE_HEADER = [
  { key: "Account Name",    title: "accountName"    },
  { key: "Account Number",  title: "accountNumber"  },
  { key: "BVN",             title: "bvn"            },
  { key: "Balance (₦)",     title: "balance"        },
]

const ROWS = [
  { id:"1", accountName:"Stanbic IBTC Bank Plc", accountNumber:"5130383439",  bvn:"39029028428", balance:"33,264,990.84" },
  { id:"2", accountName:"Shell PLC",             accountNumber:"5130383439",  bvn:"39029028428", balance:"33,264,990.84" },
  { id:"3", accountName:"Stanbic IBTC Bank Plc", accountNumber:"5130383439",  bvn:"39029028428", balance:"33,264,990.84" },
  { id:"4", accountName:"Delloite Nigeria",       accountNumber:"5130383439",  bvn:"39029028428", balance:"33,264,990.84" },
  { id:"5", accountName:"Stanbic IBTC Bank Plc", accountNumber:"0039234545",  bvn:"39029028428", balance:"33,264,990.84" },
  { id:"6", accountName:"Stanbic IBTC Bank Plc", accountNumber:"5130383439",  bvn:"39029028428", balance:"33,264,990.84" },
  { id:"7", accountName:"Stanbic IBTC Bank Plc", accountNumber:"0039234545",  bvn:"39029028428", balance:"33,264,990.84" },
  { id:"8", accountName:"Stanbic IBTC Bank Plc", accountNumber:"0039234545",  bvn:"39029028428", balance:"33,264,990.84" },
  { id:"9", accountName:"Stanbic IBTC Bank Plc", accountNumber:"5130383439",  bvn:"39029028428", balance:"33,264,990.84" },
]

const FILTER_OPTIONS = [
  "All Accounts",
  "Accounts with non-zero balances",
  "Accounts with zero balances",
]

const PAGE_DATA = {
  dateRangeLabel: "Jan 20, 2023 - Feb 09, 2023",
  downloadLabel:  "Download",
  tableHeader:    TABLE_HEADER,
  rows:           ROWS,
  totalPages:     10,
}

export default function BalanceHistoryPage() {
  const router                        = useRouter()
  const [data, setData]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState("")
  const [accountFilter, setAccountFilter] = useState("All Accounts")
  const [currentPage, setCurrentPage] = useState(1)

  const fetchData = (filter) => {
    setLoading(true)
    setData(null)
    viewBalanceHistory({ ...PAGE_DATA, accountFilter: filter }).then((res) => {
      setData(res)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchData(accountFilter)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    if (!data) return []
    const q = search.toLowerCase().trim()
    return data.rows.filter((r) => {
      if (!q) return true
      return (
        r.accountName.toLowerCase().includes(q) ||
        r.bvn.includes(q) ||
        r.accountNumber.includes(q)
      )
    })
  }, [data, search])

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      {/* Back arrow */}
      <Image
        src="/icons/left-arrow.svg"
        width={24}
        height={24}
        alt="Go back"
        className="cursor-pointer"
        onClick={() => router.back()}
      />

      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Balance History</h2>
      </header>

      {/* Date + Download */}
      <section className="flex items-center justify-between gap-4">
        <DateRangePicker label={data.dateRangeLabel} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">
          {data.downloadLabel}
        </Button>
      </section>

      {/* Table card */}
      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">

        {/* Search + filter toolbar */}
        <div className="flex items-center justify-between gap-3 p-4 border-b border-borderGrey">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              placeholder="Search by vendor name, BVN"
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 border-borderGrey min-w-[200px] justify-between">
                {accountFilter}
                <ChevronDown className="size-4 text-grey" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[220px]">
              {FILTER_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  className="cursor-pointer"
                  onClick={() => { setAccountFilter(opt); setCurrentPage(1); fetchData(opt) }}
                >
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
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
              </TableRow>
            </TableHeader>

            <TableBody className="bg-white">
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  {data.tableHeader.map((col) => (
                    <TableCell key={col.key} className="px-6 py-6 text-tableGrey whitespace-nowrap">
                      {row[col.title]}
                    </TableCell>
                  ))}
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
