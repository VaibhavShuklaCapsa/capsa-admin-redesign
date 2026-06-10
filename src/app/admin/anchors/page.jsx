"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Filter, Search } from "lucide-react"
import DateRangePicker from "../components/ui/DateRangePicker"
import BidTable from "../components/Table/BidTable"
import Pagination from "../components/Pagination/Pagination"
import PageLoader from "../components/ui/PageLoader"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { getAnchorsData } from "../services/anchors"
import { DEFAULT_DATE_RANGE_LABEL } from "../constants/anchors"

export default function AnchorsPage({
  pageTitle,
  pageSubtitle,
  anchorCountLabel,
  searchPlaceholder,
  filtersLabel,
  downloadLabel,
  dateRangeLabel,
}) {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    getAnchorsData().then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  const dropActionContent = useMemo(() => {
    if (!data?.rowActions) return []
    return data.rowActions.map((action) => ({
      title: action.title,
      handleClick: (row) => {
        if (action.title === "View User Details") {
          router.push(`/admin/anchors/${row.id}`)
          return
        }
        console.log(action.title, row)
      },
    }))
  }, [data, router])

  if (loading) return <PageLoader />

  const title = pageTitle ?? data.pageTitle
  const subtitle = pageSubtitle ?? data.pageSubtitle
  const countLabel = anchorCountLabel ?? data.anchorCountLabel
  const searchText = searchPlaceholder ?? data.searchPlaceholder
  const filtersText = filtersLabel ?? data.filtersLabel
  const downloadText = downloadLabel ?? data.downloadLabel
  const dateLabel = dateRangeLabel ?? data.dateRangeLabel ?? DEFAULT_DATE_RANGE_LABEL

  const filteredAnchors = data.anchors.filter((anchor) => {
    const q = search.toLowerCase()
    if (!q) return true
    return (
      anchor.name.toLowerCase().includes(q) ||
      anchor.bvn.includes(q) ||
      anchor.email.toLowerCase().includes(q)
    )
  })

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <section>
          <h2 className="text-2xl font-bold text-customBlack mb-1">{title}</h2>
          <p className="text-sm text-grey">{subtitle}</p>
        </section>

        <section className="flex items-center gap-3">
          <DateRangePicker label={dateLabel} showChevron />
          <Button className="bg-blue hover:bg-blue/90 text-white rounded-lg px-5 h-10">
            {downloadText}
          </Button>
        </section>
      </header>

      <section className="bg-white border border-borderGrey rounded-xl overflow-hidden">
        <section className="flex items-center gap-4 p-4 border-b border-borderGrey">
          <span className="inline-flex items-center rounded-full border border-borderGrey bg-deepGrey px-3 py-1 text-xs font-medium text-customBlack">
            {countLabel}: {data.anchorCount.toLocaleString()}
          </span>

          <section className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-grey" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchText}
              className="pl-9 h-10 border-borderGrey bg-white"
            />
          </section>

          <Button variant="outline" className="h-10 gap-2 border-borderGrey">
            <Filter className="size-4" />
            {filtersText}
          </Button>
        </section>

        <BidTable
          tableHeader={data.tableHeader}
          tableData={filteredAnchors}
          dropDownAction
          dropActionContent={dropActionContent}
          rounded={false}
          bg="bg-white"
        />

        <footer className="p-4 border-t border-borderGrey">
          <Pagination
            currentPage={currentPage}
            totalPages={data.totalPages}
            onPageChange={setCurrentPage}
          />
        </footer>
      </section>
    </section>
  )
}
