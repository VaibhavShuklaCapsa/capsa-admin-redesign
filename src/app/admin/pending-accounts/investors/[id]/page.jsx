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
import { getPendingInvestorDetail } from "../../../services/pendingInvestorDetail"

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

function ActionsDropdown({ actions, investor }) {
  return (
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
            onClick={() => console.log(action.title, investor)}
          >
            {action.title}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── KYC document card ─────────────────────────────────────────────────────────

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

// ── Investor information cards ────────────────────────────────────────────────

function CorporateInvestorCard({ investor, actions }) {
  return (
    <>
      <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
        <CardContent className="p-6 space-y-6">
          <header className="flex items-start justify-between gap-4">
            <section className="space-y-1">
              <p className="text-sm text-grey">Investor Name</p>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-customBlack">{investor.name}</h3>
                <StatusBadge status={investor.status} />
              </div>
            </section>
            <ActionsDropdown actions={actions} investor={investor} />
          </header>

          <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
            <VerifiableField label="BVN" value={investor.bvn} buttonLabel="Verify BVN" />
            <InfoField label="Email Address" value={investor.email} editable />
            <InfoField label="Phone Number" value={investor.phone} editable />
            <InfoField label="Investor Type" value={investor.investorType} />
            <InfoField label="Date Joined" value={investor.dateJoined} />
          </section>

          <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
            <InfoField label="Business Entity Type" value={investor.businessEntityType} />
            <InfoField label="Industry" value={investor.industry} />
            <InfoField label="Date Founded" value={investor.dateFounded} />
            <InfoField label="RC Number" value={investor.rcNumber} />
            <InfoField label="Address" value={investor.address} />
          </section>
        </CardContent>
      </Card>

      <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
        <CardContent className="p-6 space-y-6">
          <h4 className="text-base font-semibold text-customBlack">Director&apos;s Information</h4>
          <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
            <InfoField label="Director's Name" value={investor.director.name} />
            <InfoField label="Phone Number" value={investor.director.phone} />
            <InfoField label="BVN" value={investor.director.bvn} />
            <VerifiableField label="NIN" value={investor.director.nin} buttonLabel="Verify NIN" />
            <InfoField label="Political Affiliation" value={investor.director.politicalAffiliation} />
          </section>
        </CardContent>
      </Card>
    </>
  )
}

function IndividualInvestorCard({ investor, actions }) {
  return (
    <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
      <CardContent className="p-6 space-y-6">
        <header className="flex items-start justify-between gap-4">
          <section className="space-y-1">
            <p className="text-sm text-grey">Investor Name</p>
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-xl font-bold text-customBlack">{investor.name}</h3>
              <StatusBadge status={investor.status} />
            </div>
          </section>
          <ActionsDropdown actions={actions} investor={investor} />
        </header>

        <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
          <VerifiableField label="BVN" value={investor.bvn} buttonLabel="Verify BVN" />
          <InfoField label="Email Address" value={investor.email} editable />
          <InfoField label="Phone Number" value={investor.phone} editable />
          <InfoField label="Investor Type" value={investor.investorType} />
          <InfoField label="Date Joined" value={investor.dateJoined} />
        </section>

        <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
          <InfoField label="Address" value={investor.address} className="col-span-2" />
          <InfoField label="City" value={investor.city} />
          <InfoField label="State" value={investor.state} />
        </section>
      </CardContent>
    </Card>
  )
}

// ── KYC tabs content ──────────────────────────────────────────────────────────

const CORPORATE_KYC_DOCS = [
  "Proof of Registration",
  "CAC Form 2",
  "CAC Form 7",
  "CBN Operating License",
  "SCUML Certificate",
  "Proof of Operational Address",
  "Director's Valid Identification",
  "Board Resolution Document",
]

const INDIVIDUAL_KYC_DOCS = [
  "Valid ID",
  "Proof of Residential Address",
]

const KYC_FILE = "DOC389343200_2025_05_18.pdf"

function CorporateKycTab() {
  return (
    <div className="space-y-4">
      {CORPORATE_KYC_DOCS.map((doc) => (
        <KycDocCard key={doc} title={doc} file={KYC_FILE} />
      ))}
    </div>
  )
}

function IndividualKycTab() {
  return (
    <div className="space-y-4">
      {INDIVIDUAL_KYC_DOCS.map((doc) => (
        <KycDocCard key={doc} title={doc} file={KYC_FILE} />
      ))}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PendingInvestorDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPendingInvestorDetail(params.id).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [params.id])

  if (loading) return <PageLoader />

  const { investor, actions } = data
  const isCorporate = investor.investorType === "Corporate"

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

      <Tabs defaultValue="investor-information" className="gap-6">
        <TabsList className="bg-deepGrey h-auto p-1 rounded-xl w-full justify-start">
          <TabsTrigger
            value="investor-information"
            className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Investor Information
          </TabsTrigger>
          <TabsTrigger
            value="kyc-documents"
            className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            KYC Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="investor-information" className="space-y-6">
          {isCorporate ? (
            <CorporateInvestorCard investor={investor} actions={actions} />
          ) : (
            <IndividualInvestorCard investor={investor} actions={actions} />
          )}
        </TabsContent>

        <TabsContent value="kyc-documents" className="space-y-4">
          {isCorporate ? <CorporateKycTab /> : <IndividualKycTab />}
        </TabsContent>
      </Tabs>
    </section>
  )
}
