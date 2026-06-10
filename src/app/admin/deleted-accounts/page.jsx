"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronDown, MoreHorizontal, Search } from "lucide-react"
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
  getDeletedVendors,
  getDeletedInvestors,
  getDeletedAnchors,
  getDeletedGrowthPartners,
} from "../services/deletedAccounts"

// ── Mock data ────────────────────────────────────────────────────────────────

const VENDOR_ROWS = [
  { id:"1", vendorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  anchorName:"Stanbic IBTC Bank Plc", deletedOn:"Sept 30, 2021" },
  { id:"2", vendorName:"Shell PLC",             bvn:"39029028428", email:"silver@shell.com",   anchorName:"Shell PLC",             deletedOn:"Sept 30, 2021" },
  { id:"3", vendorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  anchorName:"Stanbic IBTC Bank Plc", deletedOn:"Sept 21, 2021" },
  { id:"4", vendorName:"Delloite Nigeria",       bvn:"39029028428", email:"admin@delloite.com", anchorName:"Delloite Nigeria",       deletedOn:"Mar 21, 2021"  },
  { id:"5", vendorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  anchorName:"Stanbic IBTC Bank Plc", deletedOn:"Aug 21, 2021"  },
  { id:"6", vendorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  anchorName:"Stanbic IBTC Bank Plc", deletedOn:"Aug 21, 2021"  },
  { id:"7", vendorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  anchorName:"Stanbic IBTC Bank Plc", deletedOn:"Aug 21, 2021"  },
  { id:"8", vendorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  anchorName:"Stanbic IBTC Bank Plc", deletedOn:"Aug 21, 2021"  },
  { id:"9", vendorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  anchorName:"Stanbic IBTC Bank Plc", deletedOn:"Aug 21, 2021"  },
]

const INVESTOR_ROWS = [
  { id:"1", investorName:"Mustapha Suberu",   bvn:"39029028428", email:"justmisi@gmail.com",   type:"Individual", deletedOn:"Sept 30, 2021" },
  { id:"2", investorName:"Kodvest",           bvn:"39029028428", email:"sales@kodvest.com",    type:"Corporate",  deletedOn:"Sept 30, 2021" },
  { id:"3", investorName:"Griffin Finance",   bvn:"39029028428", email:"admin@griffin.com",    type:"Corporate",  deletedOn:"Sept 21, 2021" },
  { id:"4", investorName:"Kudy Financials",   bvn:"39029028428", email:"main@kudy.com",        type:"Corporate",  deletedOn:"Mar 21, 2021"  },
  { id:"5", investorName:"ASPAC Cooperative", bvn:"39029028428", email:"aspac@aspaccoop.com",  type:"Corporate",  deletedOn:"Aug 21, 2021"  },
  { id:"6", investorName:"Samiat Aremu",      bvn:"39029028428", email:"sleemest@gmail.com",   type:"Individual", deletedOn:"Aug 21, 2021"  },
  { id:"7", investorName:"Mustapha Suberu",   bvn:"39029028428", email:"justmisi@gmail.com",   type:"Individual", deletedOn:"Aug 21, 2021"  },
  { id:"8", investorName:"Kodvest",           bvn:"39029028428", email:"sales@kodvest.com",    type:"Corporate",  deletedOn:"Aug 21, 2021"  },
  { id:"9", investorName:"Griffin Finance",   bvn:"39029028428", email:"admin@griffin.com",    type:"Corporate",  deletedOn:"Aug 21, 2021"  },
]

const ANCHOR_ROWS = [
  { id:"1", anchorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", rcNumber:"RC2893828", email:"justmisi@gmail.com",  grade:"A",   deletedOn:"Sept 30, 2021" },
  { id:"2", anchorName:"Shell PLC",             bvn:"39029028428", rcNumber:"RC2893828", email:"sales@kodvest.com",   grade:"A",   deletedOn:"Sept 30, 2021" },
  { id:"3", anchorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", rcNumber:"RC2893828", email:"admin@griffin.com",  grade:"A",   deletedOn:"Sept 21, 2021" },
  { id:"4", anchorName:"Delloite Nigeria",       bvn:"39029028428", rcNumber:"RC2893828", email:"main@kudy.com",      grade:"A",   deletedOn:"Mar 21, 2021"  },
  { id:"5", anchorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", rcNumber:"RC2893828", email:"aspac@aspaccoop.com",grade:"B",   deletedOn:"Aug 21, 2021"  },
  { id:"6", anchorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", rcNumber:"RC2893828", email:"sleemest@gmail.com", grade:"D",   deletedOn:"Aug 21, 2021"  },
  { id:"7", anchorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", rcNumber:"RC2893828", email:"justmisi@gmail.com", grade:"N/A", deletedOn:"Aug 21, 2021"  },
  { id:"8", anchorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", rcNumber:"RC2893828", email:"sales@kodvest.com",  grade:"A",   deletedOn:"Aug 21, 2021"  },
  { id:"9", anchorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", rcNumber:"RC2893828", email:"admin@griffin.com",  grade:"A",   deletedOn:"Aug 21, 2021"  },
]

const GROWTH_PARTNER_ROWS = [
  { id:"1", partnerName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  deletedOn:"Sept 30, 2021" },
  { id:"2", partnerName:"Shell PLC",             bvn:"39029028428", email:"silver@shell.com",   deletedOn:"Sept 30, 2021" },
  { id:"3", partnerName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  deletedOn:"Sept 21, 2021" },
  { id:"4", partnerName:"Delloite Nigeria",       bvn:"39029028428", email:"admin@delloite.com", deletedOn:"Mar 21, 2021"  },
  { id:"5", partnerName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  deletedOn:"Aug 21, 2021"  },
  { id:"6", partnerName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  deletedOn:"Aug 21, 2021"  },
  { id:"7", partnerName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  deletedOn:"Aug 21, 2021"  },
  { id:"8", partnerName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  deletedOn:"Aug 21, 2021"  },
  { id:"9", partnerName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  deletedOn:"Aug 21, 2021"  },
]

const ACCOUNT_TYPES = ["Vendors", "Investors", "Anchors", "Growth Partners"]

const DATE_RANGE_LABEL = "Jan 20, 2023 - Feb 09, 2023"

const FETCH_MAP = {
  Vendors:          { fn: getDeletedVendors,       rows: VENDOR_ROWS         },
  Investors:        { fn: getDeletedInvestors,     rows: INVESTOR_ROWS       },
  Anchors:          { fn: getDeletedAnchors,       rows: ANCHOR_ROWS         },
  "Growth Partners":{ fn: getDeletedGrowthPartners,rows: GROWTH_PARTNER_ROWS },
}

// ── Per-type table body ───────────────────────────────────────────────────────

function VendorTable({ rows }) {
  return (
    <>
      <TableHeader className="bg-white">
        <TableRow className="bg-white">
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Vendor Name</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">BVN</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Email Address</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Anchor Name</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Deleted On</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.vendorName}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.email}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.anchorName}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.deletedOn}</TableCell>
            <TableCell className="px-6 py-6"><ActionMenu row={row} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  )
}

function InvestorTable({ rows }) {
  return (
    <>
      <TableHeader className="bg-white">
        <TableRow className="bg-white">
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Investor Name</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">BVN</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Email Address</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Type</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Deleted On</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.investorName}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.email}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.type}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.deletedOn}</TableCell>
            <TableCell className="px-6 py-6"><ActionMenu row={row} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  )
}

function AnchorTable({ rows }) {
  return (
    <>
      <TableHeader className="bg-white">
        <TableRow className="bg-white">
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Anchor Name</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">BVN</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">RC Number</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Email Address</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Grade</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Deleted On</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.anchorName}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.rcNumber}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.email}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.grade}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.deletedOn}</TableCell>
            <TableCell className="px-6 py-6"><ActionMenu row={row} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  )
}

function GrowthPartnerTable({ rows }) {
  return (
    <>
      <TableHeader className="bg-white">
        <TableRow className="bg-white">
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Partner Name</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">BVN</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Email Address</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Deleted On</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.partnerName}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.email}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.deletedOn}</TableCell>
            <TableCell className="px-6 py-6"><ActionMenu row={row} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  )
}

function ActionMenu({ row }) {
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
        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => console.log("View", row)}>
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DeletedAccountsPage() {
  const [accountType, setAccountType]   = useState("Vendors")
  const [rows, setRows]                 = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [switching, setSwitching]       = useState(false)
  const [search, setSearch]             = useState("")
  const [currentPage, setCurrentPage]   = useState(1)
  const [totalPages, setTotalPages]     = useState(10)

  const fetchData = (type, isSwitch = false) => {
    if (isSwitch) setSwitching(true)
    else setInitialLoading(true)
    setRows([])
    const { fn, rows: mockRows } = FETCH_MAP[type]
    fn({ rows: mockRows, totalPages: 10 }).then((res) => {
      setRows(res.rows ?? mockRows)
      setTotalPages(res.totalPages ?? 10)
      if (isSwitch) setSwitching(false)
      else setInitialLoading(false)
    })
  }

  useEffect(() => {
    fetchData(accountType, false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleTypeChange = (type) => {
    setAccountType(type)
    setSearch("")
    setCurrentPage(1)
    fetchData(type, true)
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return rows
    return rows.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q))
    )
  }, [rows, search])

  if (initialLoading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Deleted Accounts</h2>
        <p className="text-sm text-grey">Showing deleted accounts</p>
      </header>

      <div className="flex items-center justify-between gap-4">
        <DateRangePicker label={DATE_RANGE_LABEL} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
      </div>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        {/* Search + account type dropdown */}
        <div className="flex items-center justify-end gap-3 p-4 border-b border-borderGrey">
          <div className="relative w-72">
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
              <Button variant="outline" className="h-10 gap-2 border-borderGrey min-w-[160px] justify-between">
                {accountType}
                <ChevronDown className="size-4 text-grey" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[160px]">
              {ACCOUNT_TYPES.map((opt) => (
                <DropdownMenuItem key={opt} className="cursor-pointer" onClick={() => handleTypeChange(opt)}>
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="overflow-x-auto bg-white">
          {switching ? (
            <div className="flex justify-center items-center py-16">
              <img src="/images/loader.gif" width={80} height={80} alt="Loading" className="object-contain" />
            </div>
          ) : (
            <Table>
              {accountType === "Vendors"          && <VendorTable        rows={filtered} />}
              {accountType === "Investors"        && <InvestorTable      rows={filtered} />}
              {accountType === "Anchors"          && <AnchorTable        rows={filtered} />}
              {accountType === "Growth Partners"  && <GrowthPartnerTable rows={filtered} />}
            </Table>
          )}
        </div>

        <footer className="p-4 border-t border-borderGrey">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </footer>
      </section>
    </section>
  )
}
