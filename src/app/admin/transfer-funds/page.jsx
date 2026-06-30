"use client"

import { useEffect, useState } from "react"
import { ChevronDown } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { transferBetweenAccounts, debitFromAccount, getAccountOptions } from "../services/transferFunds"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "../components/toast"

function formatAmount(amount) {
  const n = Number(amount)
  if (Number.isNaN(n)) return amount
  return `₦${n.toLocaleString("en-NG")}`
}

function ConfirmActionDialog({
  open,
  onOpenChange,
  title,
  description,
  fields,
  submitting,
  onConfirm,
  confirmLabel,
  confirmingLabel,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          width: "451px",
          maxWidth: "95vw",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "24px",
          borderRadius: "8px",
          border: "1px solid #E4E4E7",
          background: "#FFF",
          boxShadow: "0 4px 6px -4px rgba(16, 24, 40, 0.10), 0 10px 15px -3px rgba(0, 0, 0, 0.10)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
          <DialogTitle
            style={{
              margin: 0,
              color: "#09090B",
              fontFamily: "Satoshi",
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: "140%",
            }}
          >
            {title}
          </DialogTitle>
          <p
            style={{
              margin: 0,
              color: "#71717A",
              fontFamily: "Satoshi",
              fontSize: "14px",
              fontWeight: 400,
              lineHeight: "140%",
            }}
          >
            {description}
          </p>
        </div>

        <div
          style={{
            display: "flex",
            width: "100%",
            padding: "24px 16px",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            borderRadius: "8px",
            border: "1px solid #E9EAEB",
            background: "#FAFAFA",
            boxSizing: "border-box",
          }}
        >
          {fields.map((item) => (
            <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: "8px", flex: "1 1 100px", minWidth: 0 }}>
              <span
                style={{
                  color: "#71717A",
                  fontFamily: "Satoshi",
                  fontSize: "12px",
                  fontWeight: 500,
                  lineHeight: "140%",
                }}
              >
                {item.label}
              </span>
              <span
                style={{
                  color: "#09090B",
                  fontFamily: "Plus Jakarta Sans",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: "140%",
                  letterSpacing: "-0.28px",
                  wordBreak: "break-word",
                  whiteSpace: "normal",
                }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", width: "100%" }}>
          <button
            onClick={() => onOpenChange(false)}
            disabled={submitting}
            style={{
              height: "44px",
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #E4E4E7",
              background: "transparent",
              color: "#09090B",
              fontFamily: "Satoshi",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "140%",
              cursor: submitting ? "not-allowed" : "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            style={{
              height: "44px",
              padding: "8px 16px",
              borderRadius: "8px",
              background: "#0098DB",
              border: "none",
              color: "#FAFAFA",
              fontFamily: "Satoshi",
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "140%",
              cursor: submitting ? "not-allowed" : "pointer",
              opacity: submitting ? 0.7 : 1,
            }}
          >
            {submitting ? confirmingLabel : confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function AccountSelect({ value, onChange, options = [], excludeValue = "", placeholder = "Select Account" }) {
  const available = options.filter((o) => o.value !== excludeValue)
  const selected = options.find((o) => o.value === value)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button style={{ width: "100%" }} className="flex items-center justify-between border border-borderGrey rounded-lg px-4 h-11 text-sm bg-white focus:outline-none">
          <span className={selected ? "text-customBlack truncate max-w-[90%] text-left" : "text-grey"}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronDown className="size-4 text-grey shrink-0 ml-2" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }} className="max-h-64 overflow-y-auto">
        {available.length === 0 ? (
          <DropdownMenuItem disabled className="text-grey text-sm">No accounts available</DropdownMenuItem>
        ) : (
          available.map((opt) => (
            <DropdownMenuItem
              key={opt.value}
              className="cursor-pointer text-sm"
              onClick={() => onChange(opt.value)}
            >
              {opt.label}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function TransferBetweenAccountsTab({ accounts }) {
  const [sourceAccount, setSourceAccount]       = useState("")
  const [sourceNarration, setSourceNarration]   = useState("")
  const [destAccount, setDestAccount]           = useState("")
  const [destNarration, setDestNarration]       = useState("")
  const [amount, setAmount]                     = useState("")
  const [confirmOpen, setConfirmOpen]           = useState(false)
  const [submitting, setSubmitting]             = useState(false)

  const sourceName = accounts.find((a) => a.value === sourceAccount)?.name ?? sourceAccount
  const destName    = accounts.find((a) => a.value === destAccount)?.name ?? destAccount

  const handleConfirmTransfer = async () => {
    setSubmitting(true)
    try {
      const res = await transferBetweenAccounts({ sourceAccount, sourceNarration, destAccount, destNarration, amount })
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg || "Funds transferred successfully."} />, { style: { padding: 0 } })
        setConfirmOpen(false)
        handleCancel()
      } else {
        toast(<ErrorToast message={res?.messg || "Transfer failed. Please try again."} />, { style: { padding: 0 } })
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
        <AccountSelect
          value={sourceAccount}
          onChange={setSourceAccount}
          options={accounts}
          excludeValue={destAccount}
        />
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
        <AccountSelect
          value={destAccount}
          onChange={setDestAccount}
          options={accounts}
          excludeValue={sourceAccount}
        />
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
          disabled={!sourceAccount || !destAccount || !amount}
          onClick={() => setConfirmOpen(true)}
        >
          Transfer
        </Button>
      </div>

      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Transfer Funds"
        description="Do you wish to proceed with the transfer?"
        fields={[
          { label: "Source Account", value: sourceName },
          { label: "Amount", value: formatAmount(amount) },
          { label: "Destination Account", value: destName },
        ]}
        submitting={submitting}
        onConfirm={handleConfirmTransfer}
        confirmLabel="Yes, Transfer"
        confirmingLabel="Transferring..."
      />
    </div>
  )
}

function DebitFromAccountTab({ accounts }) {
  const [sourceAccount, setSourceAccount]     = useState("")
  const [sourceNarration, setSourceNarration] = useState("")
  const [amount, setAmount]                   = useState("")
  const [confirmOpen, setConfirmOpen]         = useState(false)
  const [submitting, setSubmitting]           = useState(false)

  const sourceName = accounts.find((a) => a.value === sourceAccount)?.name ?? sourceAccount

  const handleConfirmDebit = async () => {
    setSubmitting(true)
    try {
      const res = await debitFromAccount({ sourceAccount, sourceNarration, amount })
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg || "Account debited successfully."} />, { style: { padding: 0 } })
        setConfirmOpen(false)
        handleCancel()
      } else {
        toast(<ErrorToast message={res?.messg || "Debit failed. Please try again."} />, { style: { padding: 0 } })
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
        <AccountSelect
          value={sourceAccount}
          onChange={setSourceAccount}
          options={accounts}
        />
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
          disabled={!sourceAccount || !amount}
          onClick={() => setConfirmOpen(true)}
        >
          Debit
        </Button>
      </div>

      <ConfirmActionDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Debit Confirmation"
        description="Do you wish to proceed with the debit?"
        fields={[
          { label: "Source Account", value: sourceName },
          { label: "Amount", value: formatAmount(amount) },
        ]}
        submitting={submitting}
        onConfirm={handleConfirmDebit}
        confirmLabel="Yes, Debit"
        confirmingLabel="Debiting..."
      />
    </div>
  )
}

export default function TransferFundsPage() {
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    getAccountOptions()
      .then(setAccounts)
      .catch(() => setAccounts([]))
  }, [])

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
          <TransferBetweenAccountsTab accounts={accounts} />
        </TabsContent>

        <TabsContent value="debit-from">
          <DebitFromAccountTab accounts={accounts} />
        </TabsContent>
      </Tabs>
    </section>
  )
}
