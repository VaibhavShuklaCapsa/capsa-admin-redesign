"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import PageLoader from "../../components/ui/PageLoader"
import VendorDetailContent from "../../components/ui/VendorDetailContent"
import { getVendorDetailData } from "../../services/vendorDetail"
import { toast } from "react-toastify"
import { SuccessToast, ErrorToast } from "../../components/toast"

export default function VendorDetailPage() {
  const router      = useRouter()
  const { id }      = useParams()   // id = bvn from the list page
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  const loadVendor = useCallback(() => {
    if (!id) return
    getVendorDetailData(id)
      .then((res) => {
        setData(res)
        setLoading(false)
        if (res?.res === "success") {
          toast(<SuccessToast message={res?.messg} />, { style: { padding: 0 } })
        } else if (res?.messg) {
          toast(<ErrorToast message={res?.messg} />, { style: { padding: 0 } })
        }
      })
      .catch(() => { /* API failed — keep PageLoader showing */ })
  }, [id])

  useEffect(() => {
    loadVendor()
  }, [loadVendor])

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
        vendor={data.vendor}
        tabs={data.tabs}
        actions={data.actions}
        refreshVendorInfo={loadVendor}
      />
    </section>
  )
}
