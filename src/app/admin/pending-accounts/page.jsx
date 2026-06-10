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
import { useRouter } from "next/navigation"
import {
  getPendingVendors,
  getPendingInvestors,
  getPendingGrowthPartners,
} from "../services/pendingAccounts"

// ── Mock data ────────────────────────────────────────────────────────────────

const VENDOR_ROWS = [
  { id:"1", vendorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  anchorName:"Stanbic IBTC Bank Plc", bank:"Stanbic IBTC", createdOn:"Sept 30, 2021", status:"Pending"  },
  { id:"2", vendorName:"Shell PLC",             bvn:"39029028428", email:"silver@shell.com",   anchorName:"Shell PLC",             bank:"Stanbic IBTC", createdOn:"Sept 30, 2021", status:"Pending"  },
  { id:"3", vendorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  anchorName:"Stanbic IBTC Bank Plc", bank:"Stanbic IBTC", createdOn:"Sept 21, 2021", status:"Pending"  },
  { id:"4", vendorName:"Delloite Nigeria",       bvn:"39029028428", email:"admin@delloite.com", anchorName:"Delloite Nigeria",       bank:"Stanbic IBTC", createdOn:"Mar 21, 2021",  status:"Pending"  },
  { id:"5", vendorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  anchorName:"Stanbic IBTC Bank Plc", bank:"Stanbic IBTC", createdOn:"Aug 21, 2021",  status:"Pending"  },
  { id:"6", vendorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  anchorName:"Stanbic IBTC Bank Plc", bank:"Stanbic IBTC", createdOn:"Aug 21, 2021",  status:"Approved" },
  { id:"7", vendorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  anchorName:"Stanbic IBTC Bank Plc", bank:"Sterling",     createdOn:"Aug 21, 2021",  status:"Approved" },
  { id:"8", vendorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  anchorName:"Stanbic IBTC Bank Plc", bank:"Sterling",     createdOn:"Aug 21, 2021",  status:"Approved" },
  { id:"9", vendorName:"Stanbic IBTC Bank Plc", bvn:"39029028428", email:"force@stanbic.com",  anchorName:"Stanbic IBTC Bank Plc", bank:"Sterling",     createdOn:"Aug 21, 2021",  status:"Approved" },
]

const INVESTOR_ROWS = [
  { id:"1", investorName:"Mustapha Suberu",   bvn:"39029028428", email:"justmisi@gmail.com",  bank:"Stanbic IBTC", createdOn:"Sept 30, 2021", status:"Pending"  },
  { id:"2", investorName:"Kodvest",           bvn:"39029028428", email:"sales@kodvest.com",   bank:"Stanbic IBTC", createdOn:"Sept 30, 2021", status:"Pending"  },
  { id:"3", investorName:"Griffin Finance",   bvn:"39029028428", email:"admin@griffin.com",   bank:"Stanbic IBTC", createdOn:"Sept 21, 2021", status:"Pending"  },
  { id:"4", investorName:"Kudy Financials",   bvn:"39029028428", email:"main@kudy.com",       bank:"Stanbic IBTC", createdOn:"Mar 21, 2021",  status:"Pending"  },
  { id:"5", investorName:"ASPAC Cooperative", bvn:"39029028428", email:"aspac@aspaccoop.com", bank:"Stanbic IBTC", createdOn:"Aug 21, 2021",  status:"Pending"  },
  { id:"6", investorName:"Samiat Aremu",      bvn:"39029028428", email:"sleemest@gmail.com",  bank:"Stanbic IBTC", createdOn:"Aug 21, 2021",  status:"Approved" },
  { id:"7", investorName:"Mustapha Suberu",   bvn:"39029028428", email:"justmisi@gmail.com",  bank:"Sterling",     createdOn:"Aug 21, 2021",  status:"Approved" },
  { id:"8", investorName:"Kodvest",           bvn:"39029028428", email:"sales@kodvest.com",   bank:"Sterling",     createdOn:"Aug 21, 2021",  status:"Approved" },
  { id:"9", investorName:"Griffin Finance",   bvn:"39029028428", email:"admin@griffin.com",   bank:"Sterling",     createdOn:"Aug 21, 2021",  status:"Approved" },
]

const GROWTH_PARTNER_ROWS = [
  { id:"1", name:"Mustapha Suberu",   bvn:"39029028428", email:"justmisi@gmail.com",  createdOn:"Sept 30, 2021", status:"Pending"  },
  { id:"2", name:"Samiat Aremu",      bvn:"39029028428", email:"sleemest@gmail.com",  createdOn:"Sept 30, 2021", status:"Pending"  },
  { id:"3", name:"Olawuni Oladayo",   bvn:"39029028428", email:"dayuwuni@gmail.com",  createdOn:"Sept 21, 2021", status:"Pending"  },
  { id:"4", name:"Osameya Shed",      bvn:"39029028428", email:"koddy@gmail.com",     createdOn:"Mar 21, 2021",  status:"Pending"  },
  { id:"5", name:"Chituga Weli",      bvn:"39029028428", email:"cweli@getcapsa.com",  createdOn:"Aug 21, 2021",  status:"Pending"  },
  { id:"6", name:"Samiat Aremu",      bvn:"39029028428", email:"sleemest@gmail.com",  createdOn:"Aug 21, 2021",  status:"Approved" },
  { id:"7", name:"Mustapha Suberu",   bvn:"39029028428", email:"justmisi@gmail.com",  createdOn:"Aug 21, 2021",  status:"Approved" },
  { id:"8", name:"Olawuni Oladayo",   bvn:"39029028428", email:"dayuwuni@gmail.com",  createdOn:"Aug 21, 2021",  status:"Approved" },
  { id:"9", name:"Osameya Shed",      bvn:"39029028428", email:"koddy@gmail.com",     createdOn:"Aug 21, 2021",  status:"Approved" },
]

const ACCOUNT_TYPES  = ["Vendors", "Investors", "Growth Partners"]
const STATUS_OPTIONS = ["All", "Pending", "Approved"]
const DATE_RANGE_LABEL = "Jan 20, 2023 - Feb 09, 2023"

const FETCH_MAP = {
  Vendors:          { fn: getPendingVendors,        rows: VENDOR_ROWS         },
  Investors:        { fn: getPendingInvestors,      rows: INVESTOR_ROWS       },
  "Growth Partners":{ fn: getPendingGrowthPartners, rows: GROWTH_PARTNER_ROWS },
}

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const styles = {
    Pending:  "bg-[#FEF3C7] text-[#D97706]",
    Approved: "bg-lightGreen text-[#16A34A]",
  }
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${styles[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  )
}

// ── Action menus (differ per type) ───────────────────────────────────────────
function VendorActionMenu({ row }) {
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer"><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
        <hr />
        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => router.push(`/admin/pending-accounts/vendors/${row.id}`)}>View Details</DropdownMenuItem>
        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => console.log("View KYC", row)}>View KYC Documents</DropdownMenuItem>
        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => console.log("Bank Info", row)}>Bank Account Information</DropdownMenuItem>
        <DropdownMenuItem className="p-4 text-sm cursor-pointer text-[#EF4444]" onClick={() => console.log("Delete", row)}>Delete Account</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function InvestorActionMenu({ row }) {
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer"><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
        <hr />
        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => router.push(`/admin/pending-accounts/investors/${row.id}`)}>View Details</DropdownMenuItem>
        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => console.log("View KYC", row)}>View KYC Documents</DropdownMenuItem>
        <DropdownMenuItem className="p-4 text-sm cursor-pointer text-[#EF4444]" onClick={() => console.log("Delete", row)}>Delete Account</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function GrowthPartnerActionMenu({ row }) {
  const router = useRouter()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="cursor-pointer"><MoreHorizontal className="h-4 w-4" /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48">
        <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
        <hr />
        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => router.push(`/admin/pending-accounts/growth-partners/${row.id}`)}>View Details</DropdownMenuItem>
        <DropdownMenuItem className="p-4 text-sm cursor-pointer" onClick={() => console.log("View KYC", row)}>View KYC Documents</DropdownMenuItem>
        <DropdownMenuItem className="p-4 text-sm cursor-pointer text-[#EF4444]" onClick={() => console.log("Delete", row)}>Delete Account</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Per-type tables ───────────────────────────────────────────────────────────
function VendorTable({ rows }) {
  return (
    <>
      <TableHeader className="bg-white">
        <TableRow className="bg-white">
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Vendor Name</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">BVN</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Email Address</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Anchor Name</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Bank</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Created On</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Status</TableHead>
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
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bank}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.createdOn}</TableCell>
            <TableCell className="px-6 py-6 whitespace-nowrap"><StatusBadge status={row.status} /></TableCell>
            <TableCell className="px-6 py-6"><VendorActionMenu row={row} /></TableCell>
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
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Bank</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Created On</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Status</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.investorName}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.email}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bank}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.createdOn}</TableCell>
            <TableCell className="px-6 py-6 whitespace-nowrap"><StatusBadge status={row.status} /></TableCell>
            <TableCell className="px-6 py-6"><InvestorActionMenu row={row} /></TableCell>
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
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Name</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">BVN</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Email Address</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Created On</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Status</TableHead>
          <TableHead className="px-6 py-6 font-bold text-grey">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="bg-white">
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.name}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.bvn}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.email}</TableCell>
            <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{row.createdOn}</TableCell>
            <TableCell className="px-6 py-6 whitespace-nowrap"><StatusBadge status={row.status} /></TableCell>
            <TableCell className="px-6 py-6"><GrowthPartnerActionMenu row={row} /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PendingAccountsPage() {
  const [accountType, setAccountType]       = useState("Vendors")
  const [statusFilter, setStatusFilter]     = useState("All")
  const [rows, setRows]                     = useState([])
  const [initialLoading, setInitialLoading] = useState(true)
  const [switching, setSwitching]           = useState(false)
  const [search, setSearch]                 = useState("")
  const [currentPage, setCurrentPage]       = useState(1)
  const [totalPages, setTotalPages]         = useState(10)

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
    setStatusFilter("All")
    setCurrentPage(1)
    fetchData(type, true)
  }

  const searchPlaceholder = {
    Vendors:          "Search by vendor name, BVN",
    Investors:        "Search by investor name, BVN",
    "Growth Partners":"Search by name, BVN",
  }[accountType]

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return rows.filter((r) => {
      const matchStatus = statusFilter === "All" || r.status === statusFilter
      const matchSearch = !q || Object.values(r).some((v) => String(v).toLowerCase().includes(q))
      return matchStatus && matchSearch
    })
  }, [rows, search, statusFilter])

  if (initialLoading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Pending Accounts</h2>
        <p className="text-sm text-grey">Showing all accounts pending verification</p>
      </header>

      <div className="flex items-center justify-between gap-4">
        <DateRangePicker label={DATE_RANGE_LABEL} />
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
      </div>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-end gap-3 p-4 border-b border-borderGrey">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
              placeholder={searchPlaceholder}
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </div>

          {/* Status filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 border-borderGrey min-w-[80px] justify-between">
                {statusFilter}
                <ChevronDown className="size-4 text-grey" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[100px]">
              {STATUS_OPTIONS.map((opt) => (
                <DropdownMenuItem key={opt} className="cursor-pointer" onClick={() => { setStatusFilter(opt); setCurrentPage(1) }}>
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Account type filter */}
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
