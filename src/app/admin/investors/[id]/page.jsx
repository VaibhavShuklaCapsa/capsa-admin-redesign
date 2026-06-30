"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import PageLoader from "../../components/ui/PageLoader"
import VendorDetailContent from "../../components/ui/VendorDetailContent"
import { getInvestorDetailData, getInvestorBeneficiaryAccount, getInvestorEmailPreferences, updateInvestorEmailPreference, updateInvestorBeneficiary, editInvestorContact } from "../../services/investorDetail"
import { toast } from "react-toastify"
import { ErrorToast } from "../../components/toast"

export default function InvestorDetailPage() {
  const router      = useRouter()
  const { id }      = useParams()   // id = bvn from the list page
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  const loadInvestor = useCallback(() => {
    if (!id) return
    getInvestorDetailData(id)
      .then((res) => {
        setData(res)
        setLoading(false)
        if (res?.res !== "success" && res?.messg) {
          toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
        }
      })
      .catch(() => { /* API failed — keep PageLoader showing */ })
  }, [id])

  useEffect(() => {
    loadInvestor()
  }, [loadInvestor])

  if (loading) return <PageLoader />

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

      <VendorDetailContent
        vendor={data.investor}
        tabs={data.tabs}
        actions={data.actions}
        companyDocumentsTitle="Investor Documents"
        directorInfoTitle="Director's Information"
        directorDocumentsTitle="Director Information Documents"
        showAnchorField={false}
        refreshVendorInfo={loadInvestor}
        editContactFn={editInvestorContact}
        fetchBeneficiaryFn={getInvestorBeneficiaryAccount}
        updateBeneficiaryFn={updateInvestorBeneficiary}
        fetchEmailPrefsFn={getInvestorEmailPreferences}
        updateEmailPrefFn={updateInvestorEmailPreference}
        emailPrefFields={[
          { field: "newDeals",             label: "New Deals",               description: "Get notified when new investment deals are available" },
          { field: "purchaseOfInvoice",    label: "Purchase of Invoice",     description: "Get notified when an invoice purchase has been completed" },
          { field: "debitInvoicePurchase", label: "Debit Invoice Purchase",  description: "Get notified when your account is debited for an invoice purchase" },
        ]}
      />
    </section>
  )
}
