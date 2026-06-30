"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { ChevronDown, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Dialog, DialogContent, DialogTitle } from "../../../components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import StatusBadge from "../../../components/ui/StatusBadge"
import InfoField from "../../../components/ui/InfoField"
import PageLoader from "../../../components/ui/PageLoader"
import { getPendingInvestorDetail, getInvestorKycDocuments, investorKycDocAction, verifyInvestorBvn, verifyInvestorNin, getInvestorBankAccount, createInvestorAccount } from "../../../services/pendingInvestorDetail"
import { toast } from "react-toastify"
import { ErrorToast, SuccessToast } from "../../../components/toast"

const fmtDate = (val) => {
  if (!val || val.startsWith("0000")) return "—"
  try { return format(new Date(val), "MMM d, yyyy") } catch { return val }
}

const FILE_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? ""

const ACTIONS = [
  { title: "View Details" },
  { title: "View KYC Documents" },
  { title: "Delete Account" },
]


// ── Dialog shared styles ──────────────────────────────────────────────────────

const dialogBtnBase = {
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
  lineHeight: "140%",
  cursor: "pointer",
  border: "none",
  transition: "opacity 0.15s",
}

// ── Reject Document Dialog ────────────────────────────────────────────────────

function RejectDocumentDialog({ open, onClose, onConfirm, busy }) {
  const [reason, setReason] = useState("")

  const handleClose = () => { setReason(""); onClose() }

  const handleConfirm = () => {
    if (!reason.trim()) {
      toast(<ErrorToast message="Please provide a rejection reason." />, { style: { padding: 0 } })
      return
    }
    onConfirm(reason.trim())
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
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
          boxShadow: "0 4px 6px -4px rgba(16,24,40,0.10), 0 10px 15px -3px rgba(0,0,0,0.10)",
        }}
      >
        <DialogTitle
          style={{ color: "#09090B", fontFamily: "Satoshi", fontSize: "18px", fontWeight: 700, lineHeight: "140%", margin: 0 }}
        >
          Reject Document
        </DialogTitle>

        <p style={{ color: "#71717A", fontFamily: "Satoshi", fontSize: "14px", fontWeight: 400, lineHeight: "140%", margin: 0 }}>
          Do you wish to proceed to reject this document. The user will be informed and the document will be reuploaded
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please state the reason this document was rejected"
          rows={4}
          className="placeholder:text-[#71717A] placeholder:font-normal w-full"
          style={{
            display: "flex",
            padding: "8px 12px",
            alignSelf: "stretch",
            border: "1px solid #E4E4E7",
            borderRadius: "8px",
            fontFamily: "Satoshi",
            fontSize: "14px",
            fontWeight: 400,
            lineHeight: "140%",
            color: "#09090B",
            resize: "none",
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", width: "100%" }}>
          <button
            onClick={handleClose}
            disabled={busy}
            style={{ ...dialogBtnBase, background: "#FFF", border: "1px solid #E4E4E7", color: "#09090B", opacity: busy ? 0.5 : 1 }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={busy}
            style={{ ...dialogBtnBase, background: "#B91C1C", color: "#FAFAFA", opacity: busy ? 0.5 : 1 }}
          >
            {busy ? "Processing..." : "Yes, Reject"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── KYC Document Viewer Dialog ────────────────────────────────────────────────

function KycDocViewerDialog({ doc, investorId, open, onClose, onSuccess, onRejectClick }) {
  const [approving, setApproving]     = useState(false)
  const [blobUrl, setBlobUrl]         = useState(null)
  const [blobLoading, setBlobLoading] = useState(false)

  const fullUrl = doc?.url || null
  const ext = (doc?.ext || "").toLowerCase()
  const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(ext)

  useEffect(() => {
    if (!open || !fullUrl || isImage) { setBlobUrl(null); return }
    let objectUrl = null
    setBlobLoading(true)
    fetch(fullUrl)
      .then((r) => r.blob())
      .then((blob) => {
        const typed = new Blob([blob], { type: "application/pdf" })
        objectUrl = URL.createObjectURL(typed)
        setBlobUrl(objectUrl)
      })
      .catch(() => setBlobUrl(null))
      .finally(() => setBlobLoading(false))
    return () => { if (objectUrl) URL.revokeObjectURL(objectUrl) }
  }, [open, fullUrl, isImage])

  const handleApprove = async () => {
    setApproving(true)
    try {
      const res = await investorKycDocAction({ user_id: Number(investorId), field_name: doc.field_name, action: "approve" })
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg || "Document approved."} />, { style: { padding: 0 } })
        onSuccess()
        onClose()
      } else {
        toast(<ErrorToast message={res?.messg || "Failed to approve document."} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setApproving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        overlayClassName="bg-transparent"
        style={{
          width: "720px",
          maxWidth: "95vw",
          height: "95vh",
          maxHeight: "95vh",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "24px",
          borderRadius: "8px",
          border: "1px solid #E4E4E7",
          background: "#FFF",
          boxShadow: "0 4px 6px -4px rgba(16,24,40,0.10), 0 10px 15px -3px rgba(0,0,0,0.10)",
        }}
      >
        <DialogTitle
          style={{ color: "#09090B", fontFamily: "Satoshi", fontSize: "18px", fontWeight: 700, lineHeight: "140%", margin: 0 }}
        >
          {doc?.label}
        </DialogTitle>

        {/* Document preview */}
        <div
          style={{
            flex: "1 1 0",
            minHeight: 0,
            alignSelf: "stretch",
            borderRadius: "8px",
            overflow: "hidden",
            background: "rgba(204, 234, 248, 0.50)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {fullUrl ? (
            isImage ? (
              <img src={fullUrl} alt={doc?.label} style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }} />
            ) : blobLoading ? (
              <div style={{ color: "#71717A", fontSize: "14px" }}>Loading document...</div>
            ) : blobUrl ? (
              <iframe src={blobUrl} title={doc?.label} style={{ width: "100%", height: "100%", border: "none", display: "block" }} />
            ) : (
              <div style={{ color: "#71717A", fontSize: "14px" }}>Unable to load document.</div>
            )
          ) : (
            <div style={{ color: "#71717A", fontSize: "14px" }}>No document available.</div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <button
            onClick={() => fullUrl && window.open(fullUrl, "_blank")}
            disabled={!fullUrl}
            style={{ ...dialogBtnBase, background: "#FFF", border: "1px solid #E4E4E7", color: "#09090B", opacity: !fullUrl ? 0.4 : 1 }}
          >
            Download
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={onRejectClick}
              disabled={approving}
              style={{ ...dialogBtnBase, background: "#DC2626", color: "#FAFAFA", opacity: approving ? 0.5 : 1 }}
            >
              Reject
            </button>
            <button
              onClick={handleApprove}
              disabled={approving}
              style={{ ...dialogBtnBase, background: "#0098DB", color: "#FAFAFA", opacity: approving ? 0.5 : 1 }}
            >
              {approving ? "Processing..." : "Accept"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ── KYC Doc Card ──────────────────────────────────────────────────────────────

function KycDocCard({ doc, investorId, onRefetch }) {
  const [viewerOpen, setViewerOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejecting, setRejecting]   = useState(false)

  const handleReject = async (reason) => {
    setRejecting(true)
    try {
      const res = await investorKycDocAction({ user_id: Number(investorId), field_name: doc.field_name, action: "reject", reason })
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg || "Document rejected."} />, { style: { padding: 0 } })
        onRefetch()
        setRejectOpen(false)
      } else {
        toast(<ErrorToast message={res?.messg || "Failed to reject document."} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setRejecting(false)
    }
  }

  return (
    <>
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-customBlack">{doc.label}</h4>
        {doc.url ? (
          <div className="flex items-center justify-between gap-4 bg-[#F4F4F5] py-3 px-4 rounded-xl w-[480px] max-w-full">
            <div className="flex items-center gap-3 min-w-0">
              <Image src="/icons/document-2.svg" width={20} height={20} alt="file" className="shrink-0" />
              <span className="text-sm text-grey truncate">{doc.filename?.split("/").pop() || doc.filename || "—"}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {doc.status === "2" ? (
                <>
                  <button onClick={() => setViewerOpen(true)} className="text-[#16A34A] hover:opacity-80 transition-opacity">
                    <CheckCircle2 className="size-5" />
                  </button>
                  <button onClick={() => setViewerOpen(true)} className="text-[#EF4444] hover:opacity-80 transition-opacity">
                    <XCircle className="size-5" />
                  </button>
                </>
              ) : (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${doc.status === "1" ? "bg-lightGreen text-[#16A34A]" : "bg-[#FEF3C7] text-[#D97706]"}`}>
                  {doc.status_label || "—"}
                </span>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-grey">No document uploaded.</p>
        )}
      </div>

      {viewerOpen && (
        <KycDocViewerDialog
          doc={doc}
          investorId={investorId}
          open={viewerOpen}
          onClose={() => setViewerOpen(false)}
          onSuccess={onRefetch}
          onRejectClick={() => { setViewerOpen(false); setRejectOpen(true) }}
        />
      )}

      <RejectDocumentDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        busy={rejecting}
      />
    </>
  )
}

// ── Verifiable Field ──────────────────────────────────────────────────────────

function VerifiableField({ label, value, buttonLabel, onVerify, onSuccess, verified }) {
  const [verifying, setVerifying] = useState(false)

  const handleClick = async () => {
    if (!onVerify) return
    setVerifying(true)
    try {
      const res = await onVerify()
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg || "Verified successfully."} />, { style: { padding: 0 } })
        onSuccess?.()
      } else {
        toast(<ErrorToast message={res?.messg || "Verification failed."} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong." />, { style: { padding: 0 } })
    } finally {
      setVerifying(false)
    }
  }

  return (
    <section className="min-w-0">
      <p className="text-sm text-grey mb-1">{label}</p>
      <p className="text-sm font-semibold text-customBlack mb-2">{value || "—"}</p>
      {verified ? (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#16A34A]">
          <CheckCircle2 className="size-3.5" /> Verified
        </span>
      ) : (
        <Button
          size="sm"
          onClick={handleClick}
          disabled={verifying}
          className="bg-blue hover:bg-blue/90 text-white h-8 px-4 text-xs rounded-lg"
        >
          {verifying ? "Verifying..." : buttonLabel}
        </Button>
      )}
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PendingInvestorDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") ?? "investor-information")

  const [investorInfo, setInvestorInfo]   = useState(null)
  const [directorsInfo, setDirectorsInfo] = useState(null)
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(false)

  const [kycDocs, setKycDocs]             = useState([])
  const [kycLoading, setKycLoading]       = useState(false)
  const [kycError, setKycError]           = useState(false)
  const [accountLoading, setAccountLoading]   = useState(false)
  const [accountError, setAccountError]       = useState(false)
  const [accountData, setAccountData]         = useState(null)
  const [accVerification, setAccVerification] = useState(null)
  const [creatingAccount, setCreatingAccount] = useState(false)

  const fetchInvestorInfo = () => {
    getPendingInvestorDetail(params.id)
      .then((res) => {
        setInvestorInfo(res?.data?.investor_information ?? null)
        setDirectorsInfo(res?.data?.directors_information ?? null)
      })
      .catch(() => {})
  }

  const fetchKycDocuments = () => {
    setKycLoading(true); setKycError(false)
    getInvestorKycDocuments(params.id)
      .then((res) => setKycDocs(res?.data?.kyc_documents ?? []))
      .catch(() => setKycError(true))
      .finally(() => setKycLoading(false))
  }

  const fetchAccountData = () => {
    setAccountLoading(true); setAccountError(false)
    getInvestorBankAccount(params.id)
      .then((res) => {
        setAccountData(res?.data ?? null)
        setAccVerification(res?.data?.verification ?? null)
      })
      .catch(() => setAccountError(true))
      .finally(() => setAccountLoading(false))
  }

  const handleCreateAccount = async () => {
    if (creatingAccount) return
    setCreatingAccount(true)
    try {
      const res = await createInvestorAccount(accountData?.investor_pan)
      if (res?.res === "success") {
        toast(<SuccessToast message={res?.messg || "Account created successfully."} />, { style: { padding: 0 } })
        fetchAccountData()
      } else {
        toast(<ErrorToast message={res?.messg || "Failed to create account."} />, { style: { padding: 0 } })
      }
    } catch {
      toast(<ErrorToast message="Something went wrong. Please try again." />, { style: { padding: 0 } })
    } finally {
      setCreatingAccount(false)
    }
  }

  useEffect(() => {
    if (activeTab === "investor-information") {
      setLoading(true); setError(false)
      getPendingInvestorDetail(params.id)
        .then((res) => {
          setInvestorInfo(res?.data?.investor_information ?? null)
          setDirectorsInfo(res?.data?.directors_information ?? null)
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false))
    }

    if (activeTab === "kyc-documents") {
      fetchKycDocuments()
    }

    if (activeTab === "account") {
      fetchAccountData()
    }
  }, [activeTab, params.id])

  if (activeTab === "investor-information" && loading) return <PageLoader />

  const isCorporate = investorInfo?.investor_type === "Corporate"

  return (
    <section className="space-y-6">
      <Image
        src="/icons/left-arrow.svg"
        width={24}
        height={24}
        alt="Go back"
        className="cursor-pointer"
        onClick={() => router.back()}
      />

      <header>
        <h2 className="text-2xl font-bold text-customBlack mb-1">User Details</h2>
        <p className="text-sm text-grey">Showing user information</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-6">
        <TabsList className="bg-deepGrey h-auto p-1 rounded-xl w-full justify-start">
          <TabsTrigger value="investor-information" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Investor Information
          </TabsTrigger>
          <TabsTrigger value="kyc-documents" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            KYC Documents
          </TabsTrigger>
          <TabsTrigger value="account" className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Account
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Investor Information ── */}
        <TabsContent value="investor-information" className="space-y-6">
          {error || !investorInfo ? (
            <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
              <CardContent className="p-6 text-center py-16 text-grey text-sm">
                Unable to load investor information. Please try again.
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
                <CardContent className="p-6 space-y-6">
                  <header className="flex items-start justify-between gap-4">
                    <section className="space-y-1">
                      <p className="text-sm text-grey">Investor Name</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-xl font-bold text-customBlack">{investorInfo.investor_name}</h3>
                        <StatusBadge status={investorInfo.status} />
                      </div>
                    </section>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="gap-2 h-10 px-4">
                          Actions <ChevronDown className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="min-w-48">
                        <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
                        <hr />
                        {ACTIONS.map((action) => (
                          <DropdownMenuItem
                            key={action.title}
                            className={`p-4 text-sm cursor-pointer ${action.title === "Delete Account" ? "text-[#EF4444]" : ""}`}
                            onClick={() => {
                              if (action.title === "View KYC Documents") setActiveTab("kyc-documents")
                            }}
                          >
                            {action.title}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </header>

                  {/* Row 1 — common fields */}
                  <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
                    <VerifiableField
                      label="BVN"
                      value={investorInfo.bvn}
                      buttonLabel="Verify BVN"
                      verified={investorInfo.bvn_verified === true}
                      onVerify={() => verifyInvestorBvn({ user_id: Number(params.id), bvn: investorInfo.bvn })}
                      onSuccess={fetchInvestorInfo}
                    />
                    <InfoField label="Email Address" value={investorInfo.email || "—"} editable />
                    <InfoField label="Phone Number" value={investorInfo.phone || "—"} editable />
                    <InfoField label="Investor Type" value={investorInfo.investor_type || "—"} />
                    <InfoField label="Date Joined" value={fmtDate(investorInfo.date_joined)} />
                  </section>

                  {/* Row 2 — differs by type */}
                  {isCorporate ? (
                    <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
                      <InfoField label="Business Entity Type" value={investorInfo.business_entity_type || "—"} />
                      <InfoField label="Industry" value={investorInfo.industry || "—"} />
                      <InfoField label="Date Founded" value={fmtDate(investorInfo.date_founded)} />
                      <InfoField label="RC Number" value={investorInfo.rc_number || "—"} />
                      <InfoField label="Address" value={investorInfo.address || "—"} />
                    </section>
                  ) : (
                    <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
                      <InfoField label="Address" value={investorInfo.address || "—"} />
                      <InfoField label="City" value={investorInfo.city || "—"} />
                      <InfoField label="State" value={investorInfo.state || "—"} />
                    </section>
                  )}
                </CardContent>
              </Card>

              {/* Director's Information — Corporate only */}
              {isCorporate && (
                <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
                  <CardContent className="p-6 space-y-6">
                    <h4 className="text-base font-semibold text-customBlack">Director&apos;s Information</h4>
                    <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
                      <InfoField label="Director's Name" value={directorsInfo?.director_name || "—"} />
                      <InfoField label="Phone Number" value={directorsInfo?.phone || "—"} />
                      <InfoField label="BVN" value={directorsInfo?.bvn || "—"} />
                      <VerifiableField
                        label="NIN"
                        value={directorsInfo?.nin}
                        buttonLabel="Verify NIN"
                        verified={directorsInfo?.nin_verified === true}
                        onVerify={() => verifyInvestorNin({ user_id: Number(params.id), nin: directorsInfo?.nin })}
                        onSuccess={fetchInvestorInfo}
                      />
                      <InfoField label="Political Affiliation" value={directorsInfo?.political_affiliation || "—"} />
                    </section>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* ── Tab 2: KYC Documents ── */}
        <TabsContent value="kyc-documents">
          {kycLoading ? (
            <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
              <CardContent className="p-6 text-center py-16 text-grey text-sm">Loading KYC documents...</CardContent>
            </Card>
          ) : kycError ? (
            <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
              <CardContent className="p-6 text-center py-16 text-grey text-sm">Unable to load KYC documents. Please try again.</CardContent>
            </Card>
          ) : kycDocs.length === 0 ? (
            <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
              <CardContent className="p-6 text-center py-16 text-grey text-sm">No KYC documents found.</CardContent>
            </Card>
          ) : (
            <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
              <CardContent className="p-0">
                <div className="divide-y divide-borderGrey">
                  {kycDocs.map((doc) => (
                    <div key={doc.field_name} className="p-6">
                      <KycDocCard doc={doc} investorId={params.id} onRefetch={fetchKycDocuments} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ── Tab 3: Account and Account Letter ── */}
        <TabsContent value="account" className="space-y-4">
          {accountLoading ? (
            <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
              <CardContent className="p-6 text-center py-16 text-grey text-sm">Loading account information...</CardContent>
            </Card>
          ) : accountError ? (
            <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
              <CardContent className="p-6 text-center py-16 text-grey text-sm">Unable to load account information. Please try again.</CardContent>
            </Card>
          ) : (
            <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-semibold text-customBlack">Bank Account Details</h4>
                  {accountData?.status === "Not Created" && accVerification &&
                    accVerification.bvn_verified === true &&
                    accVerification.nin_verified === true &&
                    accVerification.docs_verified === true &&
                    accVerification.kyc_pending_review === false && (
                    <button
                      onClick={handleCreateAccount}
                      disabled={creatingAccount}
                      className="text-sm font-medium text-blue hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {creatingAccount ? "Creating..." : "Create Account →"}
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-4 border-t border-borderGrey pt-4">
                  <p className="text-sm text-grey">Bank Name</p>
                  <p className="text-sm text-grey">Account Number</p>
                  <p className="text-sm text-grey">Account Name</p>
                  <p className="text-sm text-grey">Status</p>
                </div>
                <div className="grid grid-cols-4 gap-4 pt-2">
                  <p className="text-sm text-customBlack">{accountData?.bank_name || "—"}</p>
                  <p className="text-sm text-customBlack">{accountData?.account_number || "—"}</p>
                  <p className="text-sm text-customBlack">{accountData?.account_name || "—"}</p>
                  <StatusBadge status={accountData?.status} />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </section>
  )
}
