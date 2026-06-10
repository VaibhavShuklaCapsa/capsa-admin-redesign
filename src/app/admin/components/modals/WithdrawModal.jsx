"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { ErrorToast } from "../toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { getAccountOptions } from "../../services/transferFunds"
import { routes } from "../../services/apiRoutes"
import HttpService from "../../services/httpService"

const btnBase = {
  display: "flex",
  height: "44px",
  padding: "8px 16px",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  borderRadius: "8px",
  fontFamily: "Satoshi",
  fontSize: "16px",
  fontWeight: 500,
  cursor: "pointer",
  border: "none",
}

const fieldLabel = {
  color: "#09090B",
  fontFamily: "Satoshi",
  fontSize: "16px",
  fontWeight: 500,
  lineHeight: "140%",
  display: "block",
  marginBottom: "6px",
}

async function submitWithdraw(payload) {
  const apiRoute = routes.AdminAccountWithdraw()
  const http = new HttpService()
  const response = await http.postData(payload, apiRoute)
  return response.data
}

export default function WithdrawModal({ open, onClose, onSuccess }) {
  const [accounts, setAccounts]           = useState([])
  const [sourceAccount, setSourceAccount] = useState(null)
  const [destAccount, setDestAccount]     = useState(null)
  const [amount, setAmount]               = useState("")
  const [narration, setNarration]         = useState("")
  const [submitting, setSubmitting]       = useState(false)

  useEffect(() => {
    if (!open) return
    getAccountOptions().then(setAccounts).catch(() => {})
  }, [open])

  const handleClose = () => {
    setSourceAccount(null)
    setDestAccount(null)
    setAmount("")
    setNarration("")
    onClose(false)
  }

  const isFormValid = sourceAccount && destAccount && amount && Number(amount) > 0
  const isDisabled  = !isFormValid || submitting

  const handleWithdraw = async () => {
    setSubmitting(true)
    try {
      const res = await submitWithdraw({
        source_account:      sourceAccount.value,
        destination_account: destAccount.value,
        amount:              Number(amount),
        narration,
      })
      if (res?.res === "success") {
        handleClose()
        onSuccess?.()
      } else {
        toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o && !submitting) handleClose() }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle style={{ color: "#09090B", fontFamily: "Satoshi", fontSize: "18px", fontWeight: 700, lineHeight: "140%" }}>
            Withdraw to Saved Beneficiary
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Source Account */}
          <div>
            <label style={fieldLabel}>Source Account</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button style={{ width: "100%" }} className="flex items-center justify-between border border-borderGrey rounded-lg px-4 h-11 text-sm bg-white focus:outline-none">
                  <span className={sourceAccount ? "text-customBlack" : "text-grey"}>
                    {sourceAccount ? sourceAccount.label : "Select Account"}
                  </span>
                  <ChevronDown className="size-4 text-grey shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }} className="max-h-52 overflow-y-auto">
                {accounts
                  .filter((a) => a.value !== destAccount?.value)
                  .map((a) => (
                    <DropdownMenuItem key={a.value} className="cursor-pointer" onClick={() => setSourceAccount(a)}>
                      {a.label}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Withdrawal Account */}
          <div>
            <label style={fieldLabel}>Withdrawal Account</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button style={{ width: "100%" }} className="flex items-center justify-between border border-borderGrey rounded-lg px-4 h-11 text-sm bg-white focus:outline-none">
                  <span className={destAccount ? "text-customBlack" : "text-grey"}>
                    {destAccount ? destAccount.label : "Select Account"}
                  </span>
                  <ChevronDown className="size-4 text-grey shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }} className="max-h-52 overflow-y-auto">
                {accounts
                  .filter((a) => a.value !== sourceAccount?.value)
                  .map((a) => (
                    <DropdownMenuItem key={a.value} className="cursor-pointer" onClick={() => setDestAccount(a)}>
                      {a.label}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Amount */}
          <div>
            <label style={fieldLabel}>Amount</label>
            <div className="flex items-center border border-borderGrey rounded-lg px-4 h-11 gap-2 bg-white">
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

          {/* Narration */}
          <div>
            <label style={fieldLabel}>Narration</label>
            <Input
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
              placeholder="Add a narration"
              className="h-11 border-borderGrey"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={handleClose} style={{ ...btnBase, background: "#fff", border: "1px solid #E4E4E7", color: "#09090B" }}>
            Cancel
          </button>
          <button
            onClick={handleWithdraw}
            disabled={isDisabled}
            style={{ ...btnBase, background: isDisabled ? "#A3A3A3" : "#0098DB", color: "#fff", cursor: isDisabled ? "not-allowed" : "pointer", minWidth: "120px" }}
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : "Withdraw"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
