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
import { getPendingInvestorDetail, getInvestorKycDocuments, investorKycDocAction } from "../../../services/pendingInvestorDetail"
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
  const [approving, setApproving] = useState(false)

  const fullUrl = doc?.doc_url ? `${FILE_BASE}/${doc.doc_url}` : null
  const ext = (doc?.doc_url || "").split(".").pop().toLowerCase()
  const isImage = ["png", "jpg", "jpeg", "gif", "webp"].includes(ext)

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
        style={{
          width: "580px",
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
          {doc?.label}
        </DialogTitle>

        {/* Document preview */}
        <div
          style={{
            height: "380px",
            flexShrink: 0,
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
            ) : (
              <object data={fullUrl} type="application/pdf" style={{ width: "100%", height: "100%", border: "none", display: "block" }}>
                <p style={{ color: "#71717A", fontSize: "14px" }}>
                  Cannot preview this file.{" "}
                  <a href={fullUrl} target="_blank" rel="noreferrer" style={{ color: "#0098DB" }}>Open in new tab</a>
                </p>
              </object>
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
        {doc.doc_url ? (
          <div className="flex items-center justify-between gap-4 bg-[#F4F4F5] py-3 px-4 rounded-xl w-[480px] max-w-full">
            <div className="flex items-center gap-3 min-w-0">
              <Image src="/icons/document-2.svg" width={20} height={20} alt="file" className="shrink-0" />
              <span className="text-sm text-grey truncate">{doc.doc_url.split("/").pop()}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setViewerOpen(true)} className="text-[#16A34A] hover:opacity-80 transition-opacity">
                <CheckCircle2 className="size-5" />
              </button>
              <button onClick={() => setViewerOpen(true)} className="text-[#EF4444] hover:opacity-80 transition-opacity">
                <XCircle className="size-5" />
              </button>
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

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PendingInvestorDetailPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") ?? "investor-information")

  const [investorInfo, setInvestorInfo]   = useState(null)
  const [directorsInfo, setDirectorsInfo] = useState(null)
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState(false)

  const [kycDocs, setKycDocs]             = useState([])
  const [kycLoading, setKycLoading]       = useState(false)
  const [kycError, setKycError]           = useState(false)

  const fetchKycDocuments = () => {
    setKycLoading(true); setKycError(false)
    getInvestorKycDocuments(params.id)
      .then((res) => setKycDocs(res?.data?.kyc_documents ?? []))
      .catch(() => setKycError(true))
      .finally(() => setKycLoading(false))
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
                    <section className="min-w-0">
                      <p className="text-sm text-grey mb-1">BVN</p>
                      <p className="text-sm font-semibold text-customBlack mb-2">{investorInfo.bvn || "—"}</p>
                      <Button size="sm" disabled className="bg-blue hover:bg-blue/90 text-white h-8 px-4 text-xs rounded-lg">
                        Verify BVN
                      </Button>
                    </section>
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
                      <section className="min-w-0">
                        <p className="text-sm text-grey mb-1">NIN</p>
                        <p className="text-sm font-semibold text-customBlack mb-2">{directorsInfo?.nin || "—"}</p>
                        <Button size="sm" disabled className="bg-blue hover:bg-blue/90 text-white h-8 px-4 text-xs rounded-lg">
                          Verify NIN
                        </Button>
                      </section>
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
      </Tabs>
    </section>
  )
}
