"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { transferBetweenAccounts, debitFromAccount } from "../services/transferFunds"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "../components/toast"

const ACCOUNT_OPTIONS = [
  { value: "nodal-1", label: "Nodal Account 1 - 5130383439" },
  { value: "nodal-2", label: "Nodal Account 2 - 0039234545" },
  { value: "nodal-3", label: "Nodal Account 3 - 7823901234" },
]

function AccountSelect({ value, onChange, placeholder = "Select Account" }) {
  const selected = ACCOUNT_OPTIONS.find((o) => o.value === value)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button style={{ width: "100%" }} className="flex items-center justify-between border border-borderGrey rounded-lg px-4 h-11 text-sm bg-white focus:outline-none">
          <span className={selected ? "text-customBlack" : "text-grey"}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="size-4 text-grey shrink-0" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }}>
        {ACCOUNT_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            className="cursor-pointer"
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function TransferBetweenAccountsTab() {
  const [sourceAccount, setSourceAccount]       = useState("")
  const [sourceNarration, setSourceNarration]   = useState("")
  const [destAccount, setDestAccount]           = useState("")
  const [destNarration, setDestNarration]       = useState("")
  const [amount, setAmount]                     = useState("")
  const [submitting, setSubmitting]             = useState(false)

  const handleTransfer = async () => {
    setSubmitting(true)
    try {
      const res = await transferBetweenAccounts({ sourceAccount, sourceNarration, destAccount, destNarration, amount })
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
      } else {
        toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setSourceAccount("")
    setSourceNarration("")
    setDestAccount("")
    setDestNarration("")
    setAmount("")
  }

  return (
    <div className="bg-white border border-borderGrey rounded-xl p-6 space-y-6">
      <h3 className="text-base font-semibold text-customBlack">Transfer from a Nodal Account to another</h3>

      <div className="space-y-2">
        <label className="text-sm font-medium text-customBlack">Source Account</label>
        <AccountSelect value={sourceAccount} onChange={setSourceAccount} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-customBlack">Source Account Narration</label>
        <Input
          value={sourceNarration}
          onChange={(e) => setSourceNarration(e.target.value)}
          placeholder="Enter Narration"
          className="h-11 border-borderGrey"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-customBlack">Destination Account</label>
        <AccountSelect value={destAccount} onChange={setDestAccount} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-customBlack">Destination Account Narration</label>
        <Input
          value={destNarration}
          onChange={(e) => setDestNarration(e.target.value)}
          placeholder="Enter Narration"
          className="h-11 border-borderGrey"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-customBlack">Amount</label>
        <div className="flex items-center border border-borderGrey rounded-lg h-11 px-4 gap-2 bg-white">
          <span className="text-grey text-sm">₦</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 outline-none text-sm text-customBlack bg-transparent placeholder:text-grey"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" className="h-11 px-6 border-borderGrey" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          className="bg-blue hover:bg-blue/90 text-white h-11 px-8"
          disabled={!sourceAccount || !destAccount || !amount || submitting}
          onClick={handleTransfer}
        >
          {submitting ? "Transferring..." : "Transfer"}
        </Button>
      </div>
    </div>
  )
}

function DebitFromAccountTab() {
  const [sourceAccount, setSourceAccount]     = useState("")
  const [sourceNarration, setSourceNarration] = useState("")
  const [amount, setAmount]                   = useState("")
  const [submitting, setSubmitting]           = useState(false)

  const handleDebit = async () => {
    setSubmitting(true)
    try {
      const res = await debitFromAccount({ sourceAccount, sourceNarration, amount })
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
      } else {
        toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setSourceAccount("")
    setSourceNarration("")
    setAmount("")
  }

  return (
    <div className="bg-white border border-borderGrey rounded-xl p-6 space-y-6">
      <h3 className="text-base font-semibold text-customBlack">Debit from a Nodal Account</h3>

      <div className="space-y-2">
        <label className="text-sm font-medium text-customBlack">Source Account</label>
        <AccountSelect value={sourceAccount} onChange={setSourceAccount} />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-customBlack">Source Account Narration</label>
        <Input
          value={sourceNarration}
          onChange={(e) => setSourceNarration(e.target.value)}
          placeholder="Enter Narration"
          className="h-11 border-borderGrey"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-customBlack">Amount</label>
        <div className="flex items-center border border-borderGrey rounded-lg h-11 px-4 gap-2 bg-white">
          <span className="text-grey text-sm">₦</span>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 outline-none text-sm text-customBlack bg-transparent placeholder:text-grey"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button variant="outline" className="h-11 px-6 border-borderGrey" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          className="bg-blue hover:bg-blue/90 text-white h-11 px-8"
          disabled={!sourceAccount || !amount || submitting}
          onClick={handleDebit}
        >
          {submitting ? "Debiting..." : "Debit"}
        </Button>
      </div>
    </div>
  )
}

export default function TransferFundsPage() {
  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">Transfer Funds</h2>
        <p className="text-sm text-grey">Transfer funds between users</p>
      </header>

      <Tabs defaultValue="transfer-between">
        <TabsList className="bg-deepGrey h-auto p-1 rounded-xl w-fit justify-start mb-6">
          <TabsTrigger
            value="transfer-between"
            className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Transfer Between Accounts
          </TabsTrigger>
          <TabsTrigger
            value="debit-from"
            className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Debit From Account
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transfer-between">
          <TransferBetweenAccountsTab />
        </TabsContent>

        <TabsContent value="debit-from">
          <DebitFromAccountTab />
        </TabsContent>
      </Tabs>
    </section>
  )
}
