export const DEFAULT_GREETING = {
  heading: "Hello Super Admin",
  subheading: "Welcome to Capsa",
}

export const DEFAULT_DATE_RANGE_LABEL = "Jan 20, 2023 - Feb 09, 2023"

export const DEFAULT_OVERVIEW_TITLE = "Overview"

export const DEFAULT_METRIC_CARDS = [
  {
    id: "transaction-volume",
    title: "Transaction Volume",
    subTitle: "₦56,000,657,000",
    icon: "/icons/document.svg",
    iconBg: "bg-violet-100",
    color: "bg-white",
    borderColor: "border-borderGrey",
  },
  {
    id: "receivables-traded",
    title: "Receivables Traded",
    subTitle: "12,889",
    icon: "/icons/approved-invoice.svg",
    iconBg: "bg-rose-100",
    color: "bg-white",
    borderColor: "border-borderGrey",
  },
  {
    id: "average-trade-value",
    title: "Average Trade Value",
    subTitle: "₦12,000,000",
    icon: "/icons/invoice.svg",
    iconBg: "bg-green-100",
    color: "bg-white",
    borderColor: "border-borderGrey",
  },
  {
    id: "revenue",
    title: "Revenue",
    subTitle: "₦12,000,000",
    icon: "/icons/wallet.svg",
    iconBg: "bg-orange-100",
    color: "bg-white",
    borderColor: "border-borderGrey",
  },
]

export const DEFAULT_CHART = {
  title: "Transaction Volume",
  subtitle: "Showing transaction volume monthly",
  periodLabel: "Showing Weekly Data",
}

export const CHART_PERIOD_OPTIONS = [
  { value: "weekly", label: "Showing Weekly Data" },
  { value: "monthly", label: "Showing Monthly Data" },
]

export const CHART_X_LABELS = [
  "Apr 4",
  "Apr 9",
  "Apr 15",
  "Apr 21",
  "Apr 27",
  "May 3",
  "May 9",
  "May 15",
  "May 21",
  "May 27",
  "Jun 2",
  "Jun 7",
  "Jun 12",
  "Jun 18",
  "Jun 24",
  "Jun 30",
]

export const CHART_BAR_VALUES = [
  72, 88, 65, 95, 110, 78, 92, 105, 118, 85, 98, 112, 125, 90, 102, 115,
  128, 95, 108, 122, 135, 100, 88, 76, 94, 108, 120, 132, 98, 105, 118,
  130, 142, 108, 95, 82, 100, 115, 128, 140, 105, 92, 78, 96, 110, 125,
  138, 102, 88, 75, 90, 105, 118, 130, 95, 82, 70, 88, 102, 115, 128, 140,
  105, 92, 80, 98, 112, 125, 138, 100,
]
