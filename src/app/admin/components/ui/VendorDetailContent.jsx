"use client"

import { useState } from "react"
import { ChevronDown, AlertCircle } from "lucide-react"
import { getVendorAnchorLetters, getVendorBeneficiaryAccount, getVendorEmailPreferences, updateVendorEmailPreference, editVendorContact } from "../../services/vendorDetail"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "../toast"
import DetailCard from "../card/DetailCard"
import StatusBadge from "./StatusBadge"
import InfoField from "./InfoField"
import { Card, CardContent } from "./card"
import { Button } from "./button"
import { Input } from "./input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import EditFieldModal from "../modals/EditFieldModal"
import ConfirmActionModal from "../modals/ConfirmActionModal"
import UpdateBeneficiaryModal from "../modals/UpdateBeneficiaryModal"

// ── Main component ────────────────────────────────────────────────────────────

export default function VendorDetailContent({
  vendor,
  tabs = [],
  companyDocumentsTitle = "Company Information Documents",
  directorInfoTitle = "Director's Information",
  directorDocumentsTitle = "Director Information Documents",
  anchorLabel = "Anchor",
  refreshVendorInfo,        // called after edit email/phone success, and on vendor-information tab switch
  fetchBeneficiaryFn,       // override for investor — defaults to vendor beneficiary API
  editContactFn,            // override for investor — defaults to vendor edit contact API
  updateBeneficiaryFn,      // override for investor — defaults to vendor update beneficiary API
  fetchEmailPrefsFn,        // override for investor — defaults to vendor email prefs API
  updateEmailPrefFn,        // override for investor — defaults to vendor update pref API
  emailPrefFields,          // override field config for investor email prefs
}) {
  const [emailModal, setEmailModal]   = useState(false)
  const [phoneModal, setPhoneModal]   = useState(false)
  const [blockModal, setBlockModal]   = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)

  // Beneficiary tab state
  const [beneficiaryFetched, setBeneficiaryFetched] = useState(false)
  const [beneficiaryLoading, setBeneficiaryLoading] = useState(false)
  const [beneficiary, setBeneficiary]               = useState(null)
  const [beneficiaryError, setBeneficiaryError]     = useState(null)
  const [updateBeneficiaryModal, setUpdateBeneficiaryModal] = useState(false)

  const refreshBeneficiary = () => {
    setBeneficiaryFetched(false)
    setBeneficiaryLoading(true)
    setBeneficiaryError(null)
    getVendorBeneficiaryAccount(vendor.bvn)
      .then((res) => {
        setBeneficiary(res?.data?.beneficiary ?? null)
        setBeneficiaryFetched(true)
        setBeneficiaryLoading(false)
      })
      .catch(() => {})
  }

  // Email preferences tab state
  const [emailPrefFetched, setEmailPrefFetched] = useState(false)
  const [emailPrefLoading, setEmailPrefLoading] = useState(false)
  const [emailPrefs, setEmailPrefs]             = useState(null)
  // Track which toggle is mid-API-call to prevent double-tap
  const [togglingField, setTogglingField]       = useState(null)

  // Anchors tab state
  const [anchorsFetched, setAnchorsFetched] = useState(false)
  const [anchorsLoading, setAnchorsLoading] = useState(false)
  const [anchorLetters, setAnchorLetters]   = useState([])
  const [anchorsError, setAnchorsError]     = useState(null)

  const handleToggle = async (field, currentValue) => {
    if (togglingField) return  // prevent concurrent toggles
    const newValue = currentValue === 1 ? 0 : 1
    setTogglingField(field)
    // Optimistic update
    setEmailPrefs((prev) => ({ ...prev, [field]: newValue }))
    // Use custom updateEmailPrefFn if provided (investor), else default to vendor
    const updateFn = updateEmailPrefFn ?? updateVendorEmailPreference
    try {
      const res = await updateFn(vendor.bvn, field, newValue)
      if (res?.res === "success") {
        // On success re-fetch the tab so toggles reflect latest server state
        const fetchFn = fetchEmailPrefsFn ?? getVendorEmailPreferences
        fetchFn(vendor.bvn).then((fresh) => {
          setEmailPrefs(fresh?.data?.preferences ?? null)
        }).catch(() => {})
        toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
      } else {
        // Revert on failure
        setEmailPrefs((prev) => ({ ...prev, [field]: currentValue }))
        toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
      }
    } catch {
      setEmailPrefs((prev) => ({ ...prev, [field]: currentValue }))
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setTogglingField(null)
    }
  }

  const handleTabChange = (tab) => {
    if (tab === "vendor-information") {
      refreshVendorInfo?.()
      return
    }

    const showTabToast = (res) => {
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
      } else if (res?.messg) {
        toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
      }
    }

    if (tab === "email-preferences") {
      setEmailPrefLoading(true)
      setEmailPrefs(null)
      // Use custom fetchEmailPrefsFn if provided (investor), else default to vendor
      const emailFetchFn = fetchEmailPrefsFn ?? getVendorEmailPreferences
      emailFetchFn(vendor.bvn)
        .then((res) => {
          showTabToast(res)
          setEmailPrefs(res?.data?.preferences ?? null)
          setEmailPrefFetched(true)
          setEmailPrefLoading(false)
        })
        .catch(() => { /* keep loader */ })
    }
    if (tab === "beneficiary-account") {
      setBeneficiaryLoading(true)
      setBeneficiaryError(null)
      setBeneficiary(null)
      // Use custom fetchBeneficiaryFn if provided (e.g. investor), else default to vendor API
      const beneficiaryApiFn = fetchBeneficiaryFn ?? getVendorBeneficiaryAccount
      beneficiaryApiFn(vendor.bvn)
        .then((res) => {
          showTabToast(res)
          setBeneficiary(res?.data?.beneficiary ?? null)
          setBeneficiaryFetched(true)
          setBeneficiaryLoading(false)
        })
        .catch(() => { /* keep loader */ })
    }
    if (tab === "anchors") {
      setAnchorsLoading(true)
      setAnchorsError(null)
      setAnchorLetters([])
      getVendorAnchorLetters(vendor.bvn)
        .then((res) => {
          showTabToast(res)
          setAnchorLetters(res?.data?.anchor_letters ?? [])
          setAnchorsFetched(true)
          setAnchorsLoading(false)
        })
        .catch(() => { /* keep loader */ })
    }
  }

  return (
    <>
      <Tabs defaultValue={tabs[0]?.value ?? "vendor-information"} className="gap-6" onValueChange={handleTabChange}>
        <TabsList className="bg-deepGrey h-auto p-1 rounded-xl w-fit justify-start">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="vendor-information" className="space-y-6">
          <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
            <CardContent className="p-6 space-y-6">
              <header className="flex items-start justify-between gap-4">
                <section className="flex items-center gap-3 flex-wrap">
                  <div>
                    <p className="text-xs text-grey mb-1">Vendor Name</p>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-customBlack">{vendor.name}</h3>
                      <StatusBadge status={vendor.status} />
                    </div>
                  </div>
                </section>

                {/* Actions dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 h-10 px-4">
                      Actions
                      <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-52">
                    <DropdownMenuItem
                      className="p-4 text-sm cursor-pointer text-customBlack"
                      onClick={() => setEmailModal(true)}
                    >
                      Edit Email Address
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="p-4 text-sm cursor-pointer text-customBlack"
                      onClick={() => setPhoneModal(true)}
                    >
                      Edit Phone Number
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="p-4 text-sm cursor-pointer text-[#D97706]"
                      onClick={() => setBlockModal(true)}
                    >
                      Block Account
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="p-4 text-sm cursor-pointer text-[#EF4444]"
                      onClick={() => setDeleteModal(true)}
                    >
                      Delete Account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </header>

              <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
                <InfoField label="BVN"                            value={vendor.bvn} />
                <InfoField label="Email Address"                  value={vendor.email} editable />
                <InfoField label="Phone Number"                   value={vendor.phone} editable />
                <InfoField label="RC/BN Number"                   value={vendor.rcNumber} />
                <InfoField label="Date Joined"                    value={vendor.dateJoined} />
                <InfoField label="Business Entity Type"           value={vendor.businessEntityType} />
                <InfoField label="Industry"                       value={vendor.industry} />
                <InfoField label="Date Founded"                   value={vendor.dateFounded} />
                <InfoField label="Tax Identification Number (TIN)"value={vendor.tin} />
                <InfoField label="Address"                        value={vendor.address} />
              </section>

              <section className="border-t border-borderGrey pt-4">
                <InfoField label={anchorLabel} value={vendor.anchor} />
              </section>
            </CardContent>
          </Card>

          <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-base font-semibold text-customBlack">{companyDocumentsTitle}</h4>
              <section className="grid grid-cols-3 gap-4">
                {vendor.companyDocuments?.map((doc) => (
                  <DetailCard key={doc.title} title={doc.title} value={doc.file} />
                ))}
              </section>
            </CardContent>
          </Card>

          <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-base font-semibold text-customBlack">{directorInfoTitle}</h4>
              <section className="grid grid-cols-5 gap-6">
                <InfoField label="Director's Name"      value={vendor.directorName} />
                <InfoField label="Phone Number"         value={vendor.directorPhone} />
                <InfoField label="BVN"                  value={vendor.directorBvn} />
                <InfoField label="NIN"                  value={vendor.directorNin} />
                <InfoField label="Political Affiliation" value={vendor.politicalAffiliation} />
              </section>
            </CardContent>
          </Card>

          <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
            <CardContent className="p-6 space-y-4">
              <h4 className="text-base font-semibold text-customBlack">{directorDocumentsTitle}</h4>
              <section className="grid grid-cols-2 gap-4">
                {vendor.directorDocuments?.map((doc) => (
                  <DetailCard key={doc.title} title={doc.title} value={doc.file} />
                ))}
              </section>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anchors" className="space-y-4">
          {/* Error banner — shown if API returned an error message */}
          {anchorsError && (
            <div className="flex items-center gap-2 bg-[#FEE2E2] border border-[#EF4444] rounded-lg px-4 py-3 text-sm text-[#EF4444]">
              <AlertCircle className="size-4 shrink-0" />
              {anchorsError}
            </div>
          )}

          {/* Keep showing loader if API never responded */}
          {anchorsLoading ? (
            <div className="flex justify-center items-center py-16">
              <img src="/images/loader.gif" width={80} height={80} alt="Loading" className="object-contain" />
            </div>
          ) : anchorsFetched && anchorLetters.length === 0 ? (
            <Card className="border border-borderGrey rounded-2xl p-8 flex justify-center">
              <p className="text-sm text-grey">No anchor letters found for this vendor.</p>
            </Card>
          ) : (
            anchorLetters.map((letter, index) => (
              <Card key={index} className="border border-borderGrey rounded-2xl shadow-sm py-0">
                <CardContent className="p-6 space-y-4">
                  <h4 className="text-base font-semibold text-customBlack">
                    Account Letter for Anchor #{index + 1}
                  </h4>
                  <div className="w-64">
                    <DetailCard
                      title="Account Letter"
                      value={letter.filename || letter.file || ""}
                      handleClick={() => letter.url && window.open(letter.url, "_blank")}
                    />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="beneficiary-account">
          {beneficiaryLoading ? (
            <div className="flex justify-center items-center py-16">
              <img src="/images/loader.gif" width={80} height={80} alt="Loading" className="object-contain" />
            </div>
          ) : (
            <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-customBlack">Beneficiary Account Details</h4>
                  <button
                    className="flex items-center gap-1 text-sm font-medium text-blue hover:underline"
                    onClick={() => setUpdateBeneficiaryModal(true)}
                  >
                    Update Beneficiary Account
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>

                {beneficiaryFetched && !beneficiary ? (
                  <p className="text-sm text-grey">No beneficiary account found for this vendor.</p>
                ) : beneficiary ? (
                  <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
                    <InfoField label="Bank Name"      value={beneficiary.bank_name      ?? ""} />
                    <InfoField label="Account Number" value={beneficiary.account_number ?? ""} />
                    <InfoField label="Account Name"   value={beneficiary.account_name   ?? ""} />
                  </section>
                ) : null}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="email-preferences">
          {emailPrefLoading ? (
            <div className="flex justify-center items-center py-16">
              <img src="/images/loader.gif" width={80} height={80} alt="Loading" className="object-contain" />
            </div>
          ) : (
            <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
              <CardContent className="p-6">
                <div className="flex gap-12">
                  {/* Left: title + subtitle */}
                  <div className="w-56 shrink-0">
                    <h4 className="text-base font-bold text-customBlack mb-1">Email Preferences</h4>
                    <p className="text-sm text-grey">Manage how we communicate with you via email</p>
                  </div>

                  {/* Right: toggles — uses emailPrefFields prop if provided (investor), else vendor defaults */}
                  <div className="flex-1 space-y-3">
                    {(emailPrefFields ?? [
                      { field: "saleOfInvoice",    label: "Sales of Invoice",       description: "Get notified when the sale of an invoice has been completed successfully" },
                      { field: "creditInvoiceSale", label: "Credit on Invoice Sale", description: "Get notified on credit from an Invoice Sale" },
                      { field: "overdueInvoices",   label: "Overdue Invoice",        description: "Get notified on invoice due for repayment" },
                    ]).map(({ field, label, description }) => {
                      const isOn = emailPrefs?.[field] === 1
                      const isToggling = togglingField === field
                      return (
                        <div key={field} className="flex items-center justify-between gap-4 bg-white border border-borderGrey rounded-xl px-5 py-4">
                          <div>
                            <p className="text-sm font-semibold text-customBlack">{label}</p>
                            <p className="text-xs text-grey mt-0.5">{description}</p>
                          </div>
                          {/* Toggle switch */}
                          <button
                            disabled={isToggling || !emailPrefFetched}
                            onClick={() => handleToggle(field, emailPrefs?.[field] ?? 0)}
                            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition-colors duration-200 focus:outline-none ${
                              isOn ? "bg-blue" : "bg-gray-300"
                            } ${isToggling ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                          >
                            <span
                              className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 mt-0.5 ${
                                isOn ? "translate-x-5" : "translate-x-0.5"
                              }`}
                            />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <UpdateBeneficiaryModal
        open={updateBeneficiaryModal}
        onClose={setUpdateBeneficiaryModal}
        panNumber={vendor.bvn}
        onSuccess={refreshBeneficiary}
        updateBeneficiaryFn={updateBeneficiaryFn}
      />

      {/* Modals — using shared modal components from components/modals/ */}
      <EditFieldModal
        open={emailModal} onClose={setEmailModal}
        title="Edit Email Address" label="Email Address"
        placeholder="Enter email address"
        onUpdate={async (val) => {
          try {
            const contactFn = editContactFn ?? editVendorContact
            const res = await contactFn(vendor.bvn, { email: val })
            if (res?.res === "success") {
              toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
              refreshVendorInfo?.()
            } else {
              toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
              throw new Error(res?.messg)
            }
          } catch (err) {
            if (!err._toasted) toast(<ErrorToast message={err?.message ?? "Something went wrong."} />, { style: { padding: 0 } })
            throw err
          }
        }}
      />
      <EditFieldModal
        open={phoneModal} onClose={setPhoneModal}
        title="Edit Phone Number" label="Phone Number"
        placeholder="Enter phone number"
        onUpdate={async (val) => {
          try {
            const contactFn = editContactFn ?? editVendorContact
            const res = await contactFn(vendor.bvn, { phone: val })
            if (res?.res === "success") {
              toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
              refreshVendorInfo?.()
            } else {
              toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
              throw new Error(res?.messg)
            }
          } catch (err) {
            if (!err._toasted) toast(<ErrorToast message={err?.message ?? "Something went wrong."} />, { style: { padding: 0 } })
            throw err
          }
        }}
      />
      <ConfirmActionModal
        open={blockModal} onClose={setBlockModal}
        title="Block Account"
        description="Do you wish to proceed to block this account? This action can be reversed later."
        confirmLabel="Yes, Block"
        confirmBgColor="#D97706"
        onConfirm={() => console.log("Block account — API to be wired")}
      />
      <ConfirmActionModal
        open={deleteModal} onClose={setDeleteModal}
        title="Delete Account"
        description="Do you wish to proceed to delete this account. This action is irreversible"
        confirmLabel="Yes, Delete"
        confirmBgColor="#EF4444"
        onConfirm={() => console.log("Delete account")}
      />
    </>
  )
}
