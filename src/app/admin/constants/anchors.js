export const DEFAULT_PAGE_TITLE = "Anchors"
export const DEFAULT_PAGE_SUBTITLE = "Showing all anchors"
export const DEFAULT_ANCHOR_COUNT_LABEL = "Anchors"
export const DEFAULT_SEARCH_PLACEHOLDER = "Search by anchor name, BVN"
export const DEFAULT_FILTERS_LABEL = "Filters"
export const DEFAULT_DOWNLOAD_LABEL = "Download"
export const DEFAULT_DATE_RANGE_LABEL = "Select Date Range"

export const ANCHOR_TABLE_HEADER = [
  { key: "Anchor Name", title: "name" },
  { key: "BVN", title: "bvn" },
  { key: "Email Address", title: "email" },
  { key: "Phone Number", title: "phone" },
  { key: "Date Joined", title: "dateJoined" },
  { key: "Status", title: "status" },
]

export const ANCHOR_ROW_ACTIONS = [
  { title: "View User Details" },
  { title: "Block Account" },
  { title: "Delete Account" },
]

export const DEFAULT_ANCHORS = [
  {
    id: "1",
    name: "Stanbic IBTC Bank Plc",
    bvn: "44142233460",
    email: "anchor@stanbic.com",
    phone: "08030516178",
    dateJoined: "Sept 30, 2021",
    status: "Active",
  },
  {
    id: "2",
    name: "Shell PLC",
    bvn: "44142233461",
    email: "anchor@shell.com",
    phone: "08030516179",
    dateJoined: "Oct 12, 2021",
    status: "Pending",
  },
  {
    id: "3",
    name: "Deloitte Nigeria",
    bvn: "44142233462",
    email: "anchor@deloitte.ng",
    phone: "08030516180",
    dateJoined: "Nov 5, 2021",
    status: "Under Review",
  },
  {
    id: "4",
    name: "Access Bank Plc",
    bvn: "44142233463",
    email: "anchor@accessbank.com",
    phone: "08030516181",
    dateJoined: "Dec 1, 2021",
    status: "Active",
  },
]

export const DEFAULT_ANCHOR_COUNT = 1105
export const DEFAULT_TOTAL_PAGES = 10
