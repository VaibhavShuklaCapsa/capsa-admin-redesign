"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { ChevronDown, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Card, CardContent } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import StatusBadge from "../../../components/ui/StatusBadge"
import InfoField from "../../../components/ui/InfoField"
import PageLoader from "../../../components/ui/PageLoader"
import { getPendingVendorDetail } from "../../../services/pendingVendorDetail"

// ── Shared sub-components ─────────────────────────────────────────────────────

function VerifiableField({ label, value, buttonLabel }) {
  return (
    <section className="min-w-0">
      <p className="text-sm text-grey mb-1">{label}</p>
      <p className="text-sm font-semibold text-customBlack mb-2">{value}</p>
      <Button size="sm" className="bg-blue hover:bg-blue/90 text-white h-8 px-4 text-xs rounded-lg">
        {buttonLabel}
      </Button>
    </section>
  )
}

// ── KYC document card (matches DetailCard dimensions) ─────────────────────────

const VENDOR_KYC_DOCS = [
  "Proof of Operational Address",
  "Proof of Registration",
  "CAC Form 2",
  "CAC Form 7",
  "Valid ID",
  "Board Resolution Document",
]
const KYC_FILE = "DOC389343200_2025_05_18.pdf"

function KycDocCard({ title, file }) {
  return (
    <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
      <CardContent className="p-6 space-y-3">
        <h4 className="text-sm font-semibold text-customBlack">{title}</h4>
        <div className="flex flex-col gap-2 bg-[#F4F4F5] py-4 px-4 rounded-lg w-full">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-5">
              <Image src="/icons/document-2.svg" width={24} height={24} alt="file" className="cursor-pointer" />
              <span className="text-sm text-grey pr-4 break-all">{file}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => console.log("Approve", title)}
                className="text-[#16A34A] hover:opacity-80 transition-opacity"
              >
                <CheckCircle2 className="size-5" />
              </button>
              <button
                onClick={() => console.log("Reject", title)}
                className="text-[#EF4444] hover:opacity-80 transition-opacity"
              >
                <XCircle className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PendingVendorDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPendingVendorDetail(params.id).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [params.id])

  if (loading) return <PageLoader />

  const { vendor, actions } = data

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
        <h2 className="text-2xl font-bold text-customBlack mb-1">{data.pageTitle}</h2>
        <p className="text-sm text-grey">{data.pageSubtitle}</p>
      </header>

      <Tabs defaultValue="vendor-information" className="gap-6">
        <TabsList className="bg-deepGrey h-auto p-1 rounded-xl w-full justify-start">
          <TabsTrigger
            value="vendor-information"
            className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Vendor Information
          </TabsTrigger>
          <TabsTrigger
            value="kyc-documents"
            className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            KYC Documents
          </TabsTrigger>
          <TabsTrigger
            value="account-letter"
            className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Account and Account Letter
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Vendor Information ── */}
        <TabsContent value="vendor-information" className="space-y-6">
          {/* Main info card */}
          <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
            <CardContent className="p-6 space-y-6">
              <header className="flex items-start justify-between gap-4">
                <section className="space-y-1">
                  <p className="text-sm text-grey">Vendor Name</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-bold text-customBlack">{vendor.name}</h3>
                    <StatusBadge status={vendor.status} />
                  </div>
                </section>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 h-10 px-4">
                      Actions
                      <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-48">
                    <DropdownMenuItem className="font-semibold text-customBlack p-4 cursor-default">Actions</DropdownMenuItem>
                    <hr />
                    {actions.map((action) => (
                      <DropdownMenuItem
                        key={action.title}
                        className={`p-4 text-sm cursor-pointer ${action.title === "Delete Account" ? "text-[#EF4444]" : ""}`}
                        onClick={() => console.log(action.title, vendor)}
                      >
                        {action.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </header>

              {/* Row 1 */}
              <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
                <VerifiableField label="BVN" value={vendor.bvn} buttonLabel="Verify BVN" />
                <InfoField label="Email Address" value={vendor.email} editable />
                <InfoField label="Phone Number" value={vendor.phone} editable />
                <InfoField label="RC/BN Number" value={vendor.rcNumber} />
                <InfoField label="Date Joined" value={vendor.dateJoined} />
              </section>

              {/* Row 2 */}
              <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
                <InfoField label="Business Entity Type" value={vendor.businessEntityType} />
                <InfoField label="Industry" value={vendor.industry} />
                <InfoField label="Date Founded" value={vendor.dateFounded} />
                <VerifiableField label="Tax Identification Number (TIN)" value={vendor.tin} buttonLabel="Verify TIN" />
                <InfoField label="Address" value={vendor.address} />
              </section>
            </CardContent>
          </Card>

          {/* Director's Information card */}
          <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
            <CardContent className="p-6 space-y-6">
              <h4 className="text-base font-semibold text-customBlack">Director&apos;s Information</h4>
              <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
                <InfoField label="Director's Name" value={vendor.director.name} />
                <InfoField label="Phone Number" value={vendor.director.phone} />
                <InfoField label="BVN" value={vendor.director.bvn} />
                <VerifiableField label="NIN" value={vendor.director.nin} buttonLabel="Verify NIN" />
                <InfoField label="Political Affiliation" value={vendor.director.politicalAffiliation} />
              </section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 2: KYC Documents ── */}
        <TabsContent value="kyc-documents" className="space-y-4">
          {VENDOR_KYC_DOCS.map((doc) => (
            <KycDocCard key={doc} title={doc} file={KYC_FILE} />
          ))}
        </TabsContent>

        {/* ── Tab 3: Account and Account Letter ── */}
        <TabsContent value="account-letter" className="space-y-4">
          <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
            <CardContent className="p-6 space-y-4">

              {/* Header row */}
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-customBlack">Bank Account Details</h4>
                {vendor.bankAccount.accountCreated ? (
                  <button
                    onClick={() => console.log("Download account letter")}
                    className="flex items-center gap-1 text-sm font-medium text-blue hover:underline"
                  >
                    Download →
                  </button>
                ) : (
                  <button
                    onClick={() => console.log("Create account")}
                    className="flex items-center gap-1 text-sm font-medium text-blue hover:underline"
                  >
                    Create Account →
                  </button>
                )}
              </div>

              {/* Account row */}
              <div className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-4">
                <div>
                  <p className="text-xs text-grey mb-1">Anchor Name</p>
                  <p className="text-sm font-semibold text-customBlack">{vendor.bankAccount.anchorName}</p>
                </div>
                <div>
                  <p className="text-xs text-grey mb-1">Bank Name</p>
                  <p className="text-sm font-semibold text-customBlack">{vendor.bankAccount.bankName}</p>
                </div>
                <div>
                  <p className="text-xs text-grey mb-1">Account Number</p>
                  <p className="text-sm font-semibold text-customBlack">
                    {vendor.bankAccount.accountCreated ? vendor.bankAccount.accountNumber : "–"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-grey mb-1">Account Name</p>
                  <p className="text-sm font-semibold text-customBlack">
                    {vendor.bankAccount.accountCreated ? vendor.bankAccount.accountName : "–"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-grey mb-1">Status</p>
                  {vendor.bankAccount.accountCreated ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-lightGreen text-[#16A34A]">
                      Created
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-custard text-yellow">
                      Not Created
                    </span>
                  )}
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Account Letter card — only shown when account is created */}
          {vendor.bankAccount.accountCreated && (
            <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
              <CardContent className="p-6 space-y-3">
                <h4 className="text-sm font-semibold text-customBlack">
                  Account Letter for {vendor.bankAccount.anchorName}
                </h4>
                <div className="flex flex-col gap-2 bg-[#F4F4F5] py-4 px-4 rounded-lg w-full">
                  <div className="flex items-center justify-between gap-5">
                    <div className="flex items-center gap-5">
                      <Image src="/icons/document-2.svg" width={24} height={24} alt="file" className="cursor-pointer" />
                      <span className="text-sm text-grey pr-4 break-all">{vendor.bankAccount.accountLetterFile}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => console.log("Approve account letter")}
                        className="text-[#16A34A] hover:opacity-80 transition-opacity"
                      >
                        <CheckCircle2 className="size-5" />
                      </button>
                      <button
                        onClick={() => console.log("Reject account letter")}
                        className="text-[#EF4444] hover:opacity-80 transition-opacity"
                      >
                        <XCircle className="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </section>
  )
}
