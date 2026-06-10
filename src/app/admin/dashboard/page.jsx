"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import DisplayCard from "../components/card/Card"
import DateRangePicker from "../components/ui/DateRangePicker"
import TransactionVolumeChart from "../components/ui/TransactionVolumeChart"
import PageLoader from "../components/ui/PageLoader"
import { getDashboardOverview, getDashboardChart } from "../services/dashboard"
import { CHART_PERIOD_OPTIONS } from "../constants/dashboard"

// ── Helpers ──────────────────────────────────────────────────────────────────

// Format today as YYYY-MM-DD
const todayStr = () => format(new Date(), "yyyy-MM-dd")

// Format a number as ₦1,234,567 (no decimals for large values)
const formatNaira = (val) => {
  if (val === null || val === undefined) return "—"
  return "₦" + Number(val).toLocaleString("en-NG", { maximumFractionDigits: 2 })
}

const formatCount = (val) => {
  if (val === null || val === undefined) return "—"
  return Number(val).toLocaleString("en-NG")
}

// Transform API { labels, values } into the shape TransactionVolumeChart expects
const buildChartBars = (labels = [], values = []) =>
  values.map((value, index) => ({
    index,
    value,
    label: labels[index] ?? "",
    showLabel: true,
  }))

// Thin out x-axis labels so they don't crowd (show every Nth)
const sparseLabels = (labels = [], max = 16) => {
  if (labels.length <= max) return labels
  const step = Math.ceil(labels.length / max)
  return labels.filter((_, i) => i % step === 0)
}

// ── Card config (static icons/styles, dynamic values from API) ───────────────
const buildCards = (overview) => [
  {
    id: "transaction-volume",
    title: "Transaction Volume",
    subTitle: overview ? formatNaira(overview.transaction_volume) : "—",
    icon: "/icons/document.svg",
    iconBg: "bg-violet-100",
    color: "bg-white",
    borderColor: "border-borderGrey",
  },
  {
    id: "receivables-traded",
    title: "Receivables Traded",
    subTitle: overview ? formatCount(overview.receivables_traded) : "—",
    icon: "/icons/approved-invoice.svg",
    iconBg: "bg-rose-100",
    color: "bg-white",
    borderColor: "border-borderGrey",
  },
  {
    id: "average-trade-value",
    title: "Average Trade Value",
    subTitle: overview ? formatNaira(overview.average_trade_value) : "—",
    icon: "/icons/invoice.svg",
    iconBg: "bg-green-100",
    color: "bg-white",
    borderColor: "border-borderGrey",
  },
  {
    id: "revenue",
    title: "Revenue",
    subTitle: overview ? formatNaira(overview.revenue) : "—",
    icon: "/icons/wallet.svg",
    iconBg: "bg-orange-100",
    color: "bg-white",
    borderColor: "border-borderGrey",
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [loading, setLoading]       = useState(true)
  const [overview, setOverview]     = useState(null)
  const [chartRaw, setChartRaw]     = useState(null)   // raw API chart data
  const [chartPeriod, setChartPeriod] = useState("weekly")

  // Date state — stored as YYYY-MM-DD strings for the API
  const [fromDate, setFromDate] = useState("1970-04-01")
  const [toDate, setToDate]     = useState(todayStr())

  const fetchAll = async (from, to) => {
    // Both calls run in parallel; if either throws, error bubbles up
    const [overviewData, chartData] = await Promise.all([
      getDashboardOverview({ from_date: from, to_date: to }),
      getDashboardChart({ from_date: from, to_date: to }),
    ])
    setOverview(overviewData)
    setChartRaw(chartData)
  }

  // Initial load — on failure, loading stays true → PageLoader stays on screen
  useEffect(() => {
    fetchAll(fromDate, toDate)
      .then(() => setLoading(false))
      .catch(() => { /* keep loader */ })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Called when user picks a date range from the picker
  const handleDateChange = (range) => {
    if (!range?.from || !range?.to) return  // wait until both dates selected
    const from = format(range.from, "yyyy-MM-dd")
    const to   = format(range.to,   "yyyy-MM-dd")
    setFromDate(from)
    setToDate(to)
    // Re-fetch both APIs with new dates; on failure keep existing data visible
    fetchAll(from, to).catch(() => {})
  }

  if (loading) return <PageLoader />

  // Build chart bars from selected period
  const periodData   = chartRaw?.[chartPeriod] ?? null
  const chartBars    = periodData ? buildChartBars(periodData.labels, periodData.values) : []
  const chartXLabels = periodData ? sparseLabels(periodData.labels) : []
  const chartEmpty   = !periodData || chartBars.length === 0

  return (
    <section className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <section>
          <h2 className="text-2xl font-bold text-customBlack mb-1">Hello Super Admin</h2>
          <p className="text-sm text-grey">Welcome to Capsa</p>
        </section>
        <DateRangePicker
          label={`${fromDate} – ${toDate}`}
          onChange={handleDateChange}
        />
      </header>

      {/* Overview cards */}
      <section>
        <h3 className="text-lg font-semibold text-customBlack mb-4">Overview</h3>
        <section className="grid grid-cols-4 gap-4">
          {buildCards(overview).map((card) => (
            <section key={card.id} className="min-w-0">
              <DisplayCard
                title={card.title}
                subTitle={card.subTitle}
                icon={card.icon}
                iconBg={card.iconBg}
                color={card.color}
                borderColor={card.borderColor}
              />
            </section>
          ))}
        </section>
      </section>

      {/* Chart */}
      <TransactionVolumeChart
        title="Transaction Volume"
        subtitle="Showing transaction volume"
        periodLabel="Showing Weekly Data"
        periodOptions={CHART_PERIOD_OPTIONS}
        chartData={chartEmpty ? [] : chartBars}
        xLabels={chartEmpty ? [] : chartXLabels}
        selectedPeriod={chartPeriod}
        onPeriodChange={setChartPeriod}
        emptyMessage={chartEmpty ? "No chart data available for the selected date range." : null}
      />
    </section>
  )
}
