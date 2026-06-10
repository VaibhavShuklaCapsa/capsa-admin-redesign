"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
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
import { getGrowthPartnerDetails, editGrowthPartnerContact } from "../../services/growthPartners"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "../../components/toast"
import EditFieldModal from "../../components/modals/EditFieldModal"

const fmtDate = (iso) => {
  if (!iso) return ""
  try { return format(new Date(iso), "MMM d, yyyy") } catch { return iso }
}

const ACTIONS = [
  { title: "Edit Email Address", className: ""               },
  { title: "Edit Phone Number",  className: ""               },
  { title: "Block Account",      className: "text-[#B7791F]" },
  { title: "Delete Account",     className: "text-[#EF4444]" },
]

export default function GrowthPartnerDetailPage() {
  const router    = useRouter()
  const { id }    = useParams()   // id = user_id from the list page

  const [data, setData]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [emailModal, setEmailModal] = useState(false)
  const [phoneModal, setPhoneModal] = useState(false)

  const loadPartner = useCallback(() => {
    getGrowthPartnerDetails(id)
      .then((res) => {
        setData(res)
        setLoading(false)
      })
      .catch(() => { /* keep PageLoader */ })
  }, [id])

  useEffect(() => { loadPartner() }, [loadPartner])

  if (loading) return <PageLoader />

  const p    = data?.data?.partner       ?? {}
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

      <Card className="border border-borderGrey rounded-2xl shadow-sm py-0">
        <CardContent className="p-6 space-y-6">
          <header className="flex items-start justify-between gap-4">
            <section className="flex items-center gap-3 flex-wrap">
              <InfoField label="Name" value={p.name ?? ""} />
              <StatusBadge status={p.status ?? ""} />
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
                    className={`p-4 text-sm cursor-pointer ${action.className}`}
                    onClick={() => {
                      if (action.title === "Edit Email Address") setEmailModal(true)
                      else if (action.title === "Edit Phone Number") setPhoneModal(true)
                      else console.log(action.title, p)
                    }}
                  >
                    {action.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          <section className="grid grid-cols-5 gap-6 border-t border-borderGrey pt-6">
            <InfoField label="BVN"              value={p.bvn         ?? ""} />
            <InfoField label="Email Address"    value={p.email       ?? ""} editable />
            <InfoField label="Phone Number"     value={p.phone       ?? ""} />
            <InfoField label="Date Joined"      value={fmtDate(p.date_joined)} />
            <InfoField label="Address"          value={p.address     ?? ""} />
            <InfoField label="City"             value={p.city        ?? ""} />
            <InfoField label="State"            value={p.state       ?? ""} />
            <InfoField label="Referral Code"    value={p.referral_code ?? ""} />
            <InfoField label="Referred Vendors" value={String(p.referred_vendors ?? "")} />
          </section>
        </CardContent>
      </Card>

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
                  title={doc.label    ?? ""}
                  value={doc.filename ?? ""}
                  handleClick={() => doc.url && window.open(doc.url, "_blank")}
                />
              ))}
            </section>
          )}
        </CardContent>
      </Card>
      <EditFieldModal
        open={emailModal} onClose={setEmailModal}
        title="Edit Email Address" label="Email Address"
        placeholder="Enter email address"
        onUpdate={async (val) => {
          try {
            const res = await editGrowthPartnerContact(id, { email: val })
            if (res?.res === "success") {
              toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
              loadPartner()
            } else {
              toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
              throw new Error(res?.messg)
            }
          } catch (err) {
            if (!err._toasted) {
              toast(<ErrorToast message={err?.message ?? "Something went wrong."} />, { style: { padding: 0 } })
            }
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
            const res = await editGrowthPartnerContact(id, { phone: val })
            if (res?.res === "success") {
              toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
              loadPartner()
            } else {
              toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
              throw new Error(res?.messg)
            }
          } catch (err) {
            if (!err._toasted) {
              toast(<ErrorToast message={err?.message ?? "Something went wrong."} />, { style: { padding: 0 } })
            }
            throw err
          }
        }}
      />
    </section>
  )
}
