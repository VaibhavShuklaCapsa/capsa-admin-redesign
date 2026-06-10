"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Loader2 } from "lucide-react"
import { toast } from "react-toastify"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { Input } from "../ui/input"
import { SuccessToast, ErrorToast } from "../toast"
import { getBankCodes, updateVendorBeneficiary } from "../../services/vendorDetail"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

const fieldLabel = {
  color: "#09090B",
  fontFamily: "Satoshi",
  fontSize: "18px",
  fontWeight: 500,
  lineHeight: "140%",
  display: "block",
  marginBottom: "6px",
}

const fieldInput = {
  color: "#09090B",
  fontFamily: "Satoshi",
  fontSize: "18px",
  fontWeight: 400,
  lineHeight: "140%",
}

const fieldPlaceholder = {
  color: "#71717A",
}

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

export default function UpdateBeneficiaryModal({ open, onClose, panNumber, onSuccess, updateBeneficiaryFn }) {
  const [banks, setBanks]               = useState([])
  const [banksLoading, setBanksLoading] = useState(false)
  const [selectedBank, setSelectedBank] = useState(null)   // { code, name }
  const [accountNumber, setAccountNumber] = useState("")
  const [reAccountNumber, setReAccountNumber] = useState("")
  const [accountName, setAccountName]   = useState("")
  const [bankCode, setBankCode]         = useState("")
  const [submitting, setSubmitting]     = useState(false)

  // Fetch banks when modal opens
  useEffect(() => {
    if (!open) return
    setBanksLoading(true)
    getBankCodes("")
      .then((list) => {
        setBanks(list)
        setBanksLoading(false)
      })
      .catch((err) => {
        setBanksLoading(false)
        toast(<ErrorToast message="Failed to load bank list. Please try again." />, { style: { padding: 0 } })
      })
  }, [open])

  const handleBankSelect = (bank) => {
    setSelectedBank(bank)
    setBankCode(bank.code)  // auto-fill bank code
  }

  const handleClose = () => {
    // Reset form
    setSelectedBank(null)
    setAccountNumber("")
    setReAccountNumber("")
    setAccountName("")
    setBankCode("")
    onClose(false)
  }

  const isFormValid = selectedBank && accountNumber && reAccountNumber && accountName && bankCode
  const isDisabled  = !isFormValid || submitting

  const handleSubmit = async () => {
    if (accountNumber !== reAccountNumber) {
      toast(<ErrorToast message="Account numbers do not match." />, { style: { padding: 0 } })
      return
    }
    setSubmitting(true)
    try {
      // Use custom updateBeneficiaryFn if provided (investor), else default to vendor
      const updateFn = updateBeneficiaryFn ?? updateVendorBeneficiary
      const res = await updateFn({
        panNumber,
        bank_name:      selectedBank.name,
        account_number: accountNumber,
        account_name:   accountName,
        bank_code:      bankCode,
      })
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
        handleClose()
        onSuccess?.()   // triggers tab refresh in parent
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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle
            style={{
              color: "#09090B",
              fontFamily: "Satoshi",
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: "140%",
            }}
          >
            Update Beneficiary Account
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Select Bank */}
          <div>
            <label style={fieldLabel}>Select Bank</label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  style={{ width: "100%", ...fieldInput }}
                  className="flex items-center justify-between border border-borderGrey rounded-lg px-4 h-11 bg-white focus:outline-none"
                >
                  <span style={selectedBank ? { color: "#09090B" } : fieldPlaceholder}>
                    {selectedBank ? selectedBank.name : banksLoading ? "Loading banks..." : "Select Bank"}
                  </span>
                  <ChevronDown className="size-4 text-grey shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent style={{ width: "var(--radix-dropdown-menu-trigger-width)" }} className="max-h-60 overflow-y-auto">
                {banks.map((bank) => (
                  <DropdownMenuItem
                    key={bank.code}
                    className="cursor-pointer"
                    onClick={() => handleBankSelect(bank)}
                  >
                    {bank.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Account Number */}
          <div>
            <label style={fieldLabel}>Account Number</label>
            <Input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Enter Account Number"
              style={fieldInput}
              className="h-11 border-borderGrey placeholder:text-[#71717A]"
            />
          </div>

          {/* Re-Enter Account Number */}
          <div>
            <label style={fieldLabel}>Re-Enter Account Number</label>
            <Input
              value={reAccountNumber}
              onChange={(e) => setReAccountNumber(e.target.value)}
              placeholder="Enter Account Number"
              style={fieldInput}
              className="h-11 border-borderGrey placeholder:text-[#71717A]"
            />
          </div>

          {/* Account Name */}
          <div>
            <label style={fieldLabel}>Account Name</label>
            <Input
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="Enter name"
              style={fieldInput}
              className="h-11 border-borderGrey placeholder:text-[#71717A]"
            />
          </div>

          {/* Bank Code — auto-filled, editable */}
          <div>
            <label style={fieldLabel}>Bank Code</label>
            <Input
              value={bankCode}
              onChange={(e) => setBankCode(e.target.value)}
              placeholder="Bank code"
              style={fieldInput}
              className="h-11 border-borderGrey placeholder:text-[#71717A]"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleClose}
            style={{
              ...btnBase,
              background: "#fff",
              border: "1px solid #E4E4E7",
              color: "#09090B",
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isDisabled}
            style={{
              ...btnBase,
              background: isDisabled ? "#A3A3A3" : "#0098DB",
              color: "#fff",
              cursor: isDisabled ? "not-allowed" : "pointer",
              minWidth: "160px",
            }}
          >
            {submitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Update Beneficiary"
            )}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
