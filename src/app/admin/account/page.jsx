"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ChevronDown, Copy, Search } from "lucide-react"
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
import { getAccountOverview, getAccountTransactions } from "../services/account"
import { toast } from "react-toastify"
import { ErrorToast } from "../components/toast"
import ConfirmActionModal from "../components/modals/ConfirmActionModal"
import WithdrawModal from "../components/modals/WithdrawModal"

const PAGE_SIZE = 10

const fmtDate = (iso) => {
  if (!iso) return ""
  try { return format(new Date(iso), "MMM d, yyyy") } catch { return iso }
}

const fmtNum = (val) => {
  if (val === null || val === undefined) return ""
  return Number(val).toLocaleString("en-NG", { maximumFractionDigits: 2 })
}

function CardIcon({ color = "#0B6DA2" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  )
}

function BankIcon({ color = "white" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="10" width="18" height="11" rx="1" />
      <polyline points="3 10 12 3 21 10" />
      <line x1="9" y1="21" x2="9" y2="14" />
      <line x1="15" y1="21" x2="15" y2="14" />
    </svg>
  )
}

const QUICK_ACTIONS = [
  { id: "topup",    label: "Topup Account"                  },
  { id: "withdraw", label: "Withdraw to Saved Beneficiary"  },
  { id: "freeze",   label: "Freeze Fund Transfer"           },
]

const ACCOUNT_OPTIONS = ["Admin", "Vendor", "Investor"]

export default function AccountPage() {
  const [loading, setLoading]           = useState(true)
  const [overview, setOverview]         = useState(null)
  const [transactions, setTransactions] = useState([])
  const [totalPages, setTotalPages]     = useState(1)
  const [currentPage, setCurrentPage]   = useState(1)
  const [selectedAccount, setSelectedAccount] = useState("Admin")
  const [search, setSearch]             = useState("")
  const [fromDate, setFromDate]         = useState("")
  const [toDate, setToDate]             = useState("")
  const [copiedId, setCopiedId]         = useState(null)
  const [freezeModal, setFreezeModal]     = useState(false)
  const [withdrawModal, setWithdrawModal] = useState(false)

  // account_number is empty string → defaults to admin/platform
  const accountNumber = ""

  const showErrorToast = (res) => {
    if (res?.res !== "success" && res?.messg) {
      toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
    }
  }

  const fetchTransactions = async ({ page = 1, searchVal = "", from = "", to = "" }) => {
    const res = await getAccountTransactions({ account_number: accountNumber, page_number: page, page_size: PAGE_SIZE, search: searchVal, from_date: from, to_date: to })
    setTransactions(res.data?.transactions ?? [])
    setTotalPages(res.data?.pagination?.total_pages ?? 1)
    return res
  }

  // Initial load — both APIs in parallel, keep loader on failure
  useEffect(() => {
    Promise.all([
      getAccountOverview(accountNumber),
      fetchTransactions({ page: 1 }),
    ])
      .then(([overviewRes, txRes]) => {
        setOverview(overviewRes.data ?? null)
        showErrorToast(overviewRes)
        showErrorToast(txRes)
        setLoading(false)
      })
      .catch(() => { /* keep PageLoader */ })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchTransactions({ page, searchVal: search, from: fromDate, to: toDate }).then(showErrorToast).catch(() => {})
  }

  const handleSearch = (val) => {
    setSearch(val)
    setCurrentPage(1)
    fetchTransactions({ page: 1, searchVal: val, from: fromDate, to: toDate }).then(showErrorToast).catch(() => {})
  }

  const handleDateChange = (range) => {
    if (!range?.from || !range?.to) return
    const from = format(range.from, "yyyy-MM-dd")
    const to   = format(range.to,   "yyyy-MM-dd")
    setFromDate(from); setToDate(to); setCurrentPage(1)
    fetchTransactions({ page: 1, searchVal: search, from, to }).then(showErrorToast).catch(() => {})
  }

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    }).catch(() => {})
  }

  if (loading) return <PageLoader />

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Account</h2>
        <p className="text-sm text-grey">Showing account information</p>
      </header>

      {/* Account selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 h-10 px-4 border-borderGrey font-semibold text-customBlack">
            <BankIcon color="#6B7280" />
            {selectedAccount}
            <ChevronDown className="size-4 text-grey" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="min-w-40">
          {ACCOUNT_OPTIONS.map((opt) => (
            <DropdownMenuItem key={opt} className="cursor-pointer" onClick={() => setSelectedAccount(opt)}>
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Summary cards */}
      <section className="grid grid-cols-3 gap-4">
        {/* Light card 1 — Capsa Account Balance */}
        <div className="rounded-2xl p-6 flex flex-col justify-between min-h-[148px] bg-[#EBF6FB]">
          <CardIcon color="#0B6DA2" />
          <div className="mt-4">
            <p className="text-sm text-[#5A7A8A] mb-1">Capsa Account Balance</p>
            <p className="text-2xl font-bold text-customBlack">
              {overview ? `₦${fmtNum(overview.capsa_account_balance)}` : "—"}
            </p>
          </div>
        </div>

        {/* Light card 2 — Total Transaction Value */}
        <div className="rounded-2xl p-6 flex flex-col justify-between min-h-[148px] bg-[#EBF6FB]">
          <CardIcon color="#0B6DA2" />
          <div className="mt-4">
            <p className="text-sm text-[#5A7A8A] mb-1">Total Transaction Value</p>
            <p className="text-2xl font-bold text-customBlack">
              {overview ? `₦${fmtNum(overview.total_transaction_value)}` : "—"}
            </p>
          </div>
        </div>

        {/* Dark card — Capsa Bank Account */}
        <div
          className="rounded-2xl p-6 flex flex-col justify-between min-h-[148px] relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1A8AC8 0%, #0B5EA8 60%, #0A4A8F 100%)" }}
        >
          <span className="pointer-events-none absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/10" />
          <span className="pointer-events-none absolute top-6 right-6 w-20 h-20 rounded-full bg-white/10" />
          <BankIcon color="white" />
          <div className="mt-4 relative z-10">
            <p className="text-sm text-white/80 mb-1">Capsa Bank Account</p>
            <p className="text-xs font-semibold text-white/90 mb-1 tracking-widest uppercase">
              {overview?.capsa_bank_account?.holder_label ?? ""}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-wider">
                {overview?.capsa_bank_account?.account_number ?? ""}
              </span>
              {overview?.capsa_bank_account?.account_number && (
                <button onClick={() => handleCopy(overview.capsa_bank_account.account_number, "bank")} className="text-white/70 hover:text-white transition-colors">
                  <Copy className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-3 gap-4">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.id}
            className="flex items-center justify-between gap-2 bg-white border border-borderGrey rounded-xl px-5 py-4 hover:bg-[#f0f9ff] transition-colors text-left w-full"
            onClick={() => {
              if (action.id === "freeze") { setFreezeModal(true) }
              else if (action.id === "withdraw") { setWithdrawModal(true) }
              else { console.log(action.label) }
            }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="shrink-0"><CardIcon color="#0B6DA2" /></span>
              <span className="text-sm font-semibold text-blue truncate">{action.label}</span>
            </div>
            <svg className="shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0B6DA2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        ))}
      </section>

      {/* Filters + Download */}
      <section className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <DateRangePicker label="Select Date Range" onChange={handleDateChange} />
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Search narration, reference" className="pl-9 h-10 border-borderGrey bg-white w-64" />
          </div>
        </div>
        <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">Download</Button>
      </section>

      {/* Transactions table */}
      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <div className="overflow-x-auto bg-white">
          <Table>
            <TableHeader className="bg-white">
              <TableRow className="bg-white">
                <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Date</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Narration</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Opening Balance (₦)</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Deposit (₦)</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Withdrawal (₦)</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Closing Balance (₦)</TableHead>
                <TableHead className="px-6 py-6 font-bold text-grey whitespace-nowrap">Reference Number</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-grey text-sm">No transactions found.</TableCell>
                </TableRow>
              ) : (
                transactions.map((row, i) => (
                  <TableRow key={row.reference_number + i}>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtDate(row.date)}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey max-w-[220px] truncate">{row.narration}</TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtNum(row.opening_balance)}</TableCell>
                    <TableCell className={`px-6 py-6 whitespace-nowrap font-medium ${row.deposit > 0 ? "text-[#16A34A]" : "text-tableGrey"}`}>
                      {fmtNum(row.deposit)}
                    </TableCell>
                    <TableCell className={`px-6 py-6 whitespace-nowrap font-medium ${row.withdrawal > 0 ? "text-[#EF4444]" : "text-tableGrey"}`}>
                      {fmtNum(row.withdrawal)}
                    </TableCell>
                    <TableCell className="px-6 py-6 text-tableGrey whitespace-nowrap">{fmtNum(row.closing_balance)}</TableCell>
                    <TableCell className="px-6 py-6">
                      <div className="flex items-center gap-2 text-tableGrey">
                        <span>{row.reference_number}</span>
                        <button
                          onClick={() => handleCopy(row.reference_number, i)}
                          className={`transition-colors ${copiedId === i ? "text-[#16A34A]" : "text-grey hover:text-customBlack"}`}
                        >
                          <Copy className="size-4" />
                        </button>
                      </div>
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
      <WithdrawModal
        open={withdrawModal}
        onClose={setWithdrawModal}
        onSuccess={() => {
          Promise.all([
            getAccountOverview(accountNumber).then((res) => { setOverview(res.data ?? null) }),
            fetchTransactions({ page: currentPage, searchVal: search, from: fromDate, to: toDate }),
          ]).catch(() => {})
        }}
      />
      <ConfirmActionModal
        open={freezeModal}
        onClose={setFreezeModal}
        title="Freeze Funds Transfer"
        description="Do you wish to proceed to freeze funds transfer. If this is done, users will not be able to withdraw money from their accounts"
        confirmLabel="Yes, Freeze"
        confirmBgColor="#EF4444"
        onConfirm={() => console.log("Freeze funds transfer — API to be wired")}
      />
    </section>
  )
}
