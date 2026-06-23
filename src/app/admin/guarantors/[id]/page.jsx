"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { ChevronDown } from "lucide-react"
import DetailCard from "../../components/card/DetailCard"
import PageLoader from "../../components/ui/PageLoader"
import StatusBadge from "../../components/ui/StatusBadge"
import InfoField from "../../components/ui/InfoField"
import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { getGuarantorDetails } from "../../services/guarantors"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "../../components/toast"

const fmtDate = (iso) => {
  if (!iso) return ""
  try { return format(new Date(iso), "MMM d, yyyy") } catch { return iso }
}

const ACTIONS = []

export default function GuarantorDetailPage() {
  const router       = useRouter()
  const { id }       = useParams()
  const searchParams = useSearchParams()

  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  // rc_number passed from the list page via query param
  const rcNumber = searchParams.get("rc") ?? id

  const loadGuarantor = useCallback(() => {
    getGuarantorDetails(rcNumber)
      .then((res) => {
        setData(res)
        setLoading(false)
        if (res?.res === "success") {
          toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
        } else if (res?.messg) {
          toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
        }
      })
      .catch(() => { /* keep PageLoader */ })
  }, [rcNumber])

  useEffect(() => { loadGuarantor() }, [loadGuarantor])

  if (loading) return <PageLoader />

  const g = data?.data?.guarantor ?? {}
  const docs = data?.data?.verification_docs ?? []

  return (
    <section className="space-y-8">
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

      {/* Main info card */}
      <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
        <CardContent className="p-6 space-y-6">
          <header className="flex items-start justify-between gap-4">
            <section className="flex items-center gap-3 flex-wrap">
              <InfoField label="Name" value={g.name ?? ""} />
              <StatusBadge status={g.status ?? ""} />
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
                {ACTIONS.map((action) => (
                  <DropdownMenuItem
                    key={action.title}
                    className={`p-4 text-sm cursor-pointer ${action.className ?? ""}`}
                    onClick={() => console.log(action.title, g)}
                  >
                    {action.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
            <InfoField label="RC Number"  value={g.rc_number ?? ""} />
            <InfoField label="Industry"   value={g.industry  ?? ""} />
            <InfoField label="Date Added" value={fmtDate(g.date_added)} />
          </section>
        </CardContent>
      </Card>

      {/* Verification documents */}
      <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
        <CardContent className="p-6 space-y-4">
          <h4 className="text-base font-semibold text-customBlack">Verification Documents</h4>
          {docs.length === 0 ? (
            <p className="text-sm text-grey">No verification documents found.</p>
          ) : (
            <section className="grid grid-cols-3 gap-4">
              {docs.map((doc, i) => (
                <DetailCard
                  key={i}
                  title={doc.label   ?? ""}
                  value={doc.filename ?? ""}
                  handleClick={() => doc.url && window.open(doc.url, "_blank")}
                />
              ))}
            </section>
          )}
        </CardContent>
      </Card>
    </section>
  )
}
