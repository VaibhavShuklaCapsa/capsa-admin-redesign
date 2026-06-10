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
import { getPendingGrowthPartnerDetail } from "../../../services/pendingGrowthPartnerDetail"

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

const KYC_DOCS = ["Valid ID", "Proof of Residential Address"]
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

export default function PendingGrowthPartnerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPendingGrowthPartnerDetail(params.id).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [params.id])

  if (loading) return <PageLoader />

  const { partner, actions } = data

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

      <Tabs defaultValue="partner-information" className="gap-6">
        <TabsList className="bg-deepGrey h-auto p-1 rounded-xl w-full justify-start">
          <TabsTrigger
            value="partner-information"
            className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Growth Partner Information
          </TabsTrigger>
          <TabsTrigger
            value="kyc-documents"
            className="rounded-lg px-4 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            KYC Documents
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Partner Information ── */}
        <TabsContent value="partner-information" className="space-y-6">
          <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
            <CardContent className="p-6 space-y-6">
              <header className="flex items-start justify-between gap-4">
                <section className="space-y-1">
                  <p className="text-sm text-grey">Name</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="text-xl font-bold text-customBlack">{partner.name}</h3>
                    <StatusBadge status={partner.status} />
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
                        onClick={() => console.log(action.title, partner)}
                      >
                        {action.title}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </header>

              <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
                <VerifiableField label="BVN" value={partner.bvn} buttonLabel="Verify BVN" />
                <InfoField label="Email Address" value={partner.email} editable />
                <InfoField label="Phone Number" value={partner.phone} editable />
                <InfoField label="Date Joined" value={partner.dateJoined} />
                <InfoField label="Address" value={partner.address} />
              </section>

              <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
                <InfoField label="City" value={partner.city} />
                <InfoField label="State" value={partner.state} />
              </section>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 2: KYC Documents ── */}
        <TabsContent value="kyc-documents" className="space-y-4">
          {KYC_DOCS.map((doc) => (
            <KycDocCard key={doc} title={doc} file={KYC_FILE} />
          ))}
        </TabsContent>
      </Tabs>
    </section>
  )
}
