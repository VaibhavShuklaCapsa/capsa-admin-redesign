"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import PageLoader from "../../components/ui/PageLoader"
import VendorDetailContent from "../../components/ui/VendorDetailContent"
import { getAnchorDetailData } from "../../services/anchorDetail"

export default function AnchorDetailPage({
  pageTitle,
  pageSubtitle,
}) {
  const router = useRouter()
  const params = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getAnchorDetailData(params.id).then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [params.id])

  if (loading) return <PageLoader />

  const title = pageTitle ?? data.pageTitle
  const subtitle = pageSubtitle ?? data.pageSubtitle

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
        <h2 className="text-2xl font-bold text-customBlack mb-1">{title}</h2>
        <p className="text-sm text-grey">{subtitle}</p>
      </header>

      <VendorDetailContent
        vendor={data.anchor}
        tabs={data.tabs}
        actions={data.actions}
        companyDocumentsTitle="Anchor Documents"
        directorInfoTitle="Director's Information"
        directorDocumentsTitle="Director Information Documents"
        anchorLabel="Linked Vendor"
      />
    </section>
  )
}
