export const DEFAULT_PAGE_TITLE = "Investors"
export const DEFAULT_PAGE_SUBTITLE = "Showing all investors"
export const DEFAULT_INVESTOR_COUNT_LABEL = "Investors"
export const DEFAULT_SEARCH_PLACEHOLDER = "Search by investor name, BVN"
export const DEFAULT_FILTERS_LABEL = "Filters"
export const DEFAULT_DOWNLOAD_LABEL = "Download"
export const DEFAULT_DATE_RANGE_LABEL = "Select Date Range"

export const INVESTOR_TABLE_HEADER = [
  { key: "Investor Name", title: "name" },
  { key: "BVN", title: "bvn" },
  { key: "Email Address", title: "email" },
  { key: "Type", title: "type" },
  { key: "Date Joined", title: "dateJoined" },
  { key: "Status", title: "status" },
]

export const INVESTOR_ROW_ACTIONS = [
  { title: "View User Details" },
  { title: "Block Account" },
  { title: "Delete Account" },
]

export const DEFAULT_INVESTORS = [
  {
    id: "1",
    name: "Stanbic IBTC Capital",
    bvn: "33142233460",
    email: "invest@stanbic.com",
    type: "Individual",
    dateJoined: "Sept 30, 2021",
    status: "Active",
  },
  {
    id: "2",
    name: "Shell Pension Fund",
    bvn: "33142233461",
    email: "investors@shell.com",
    type: "Corporate",
    dateJoined: "Oct 12, 2021",
    status: "Pending",
  },
  {
    id: "3",
    name: "Deloitte Investment Ltd",
    bvn: "33142233462",
    email: "funds@deloitte.ng",
    type: "Corporate",
    dateJoined: "Nov 5, 2021",
    status: "Under Review",
  },
  {
    id: "4",
    name: "Access Capital Partners",
    bvn: "33142233463",
    email: "capital@accessbank.com",
    type: "Individual",
    dateJoined: "Dec 1, 2021",
    status: "Active",
  },
  {
    id: "5",
    name: "MTN Investment Holdings",
    bvn: "33142233464",
    email: "holdings@mtn.ng",
    type: "Corporate",
    dateJoined: "Jan 15, 2022",
    status: "Active",
  },
  {
    id: "6",
    name: "Dangote Capital",
    bvn: "33142233465",
    email: "capital@dangote.com",
    type: "Corporate",
    dateJoined: "Feb 20, 2022",
    status: "Pending",
  },
  {
    id: "7",
    name: "Flutterwave Investors",
    bvn: "33142233466",
    email: "invest@flutterwave.com",
    type: "Individual",
    dateJoined: "Mar 8, 2022",
    status: "Active",
  },
  {
    id: "8",
    name: "Interswitch Capital",
    bvn: "33142233467",
    email: "capital@interswitch.com",
    type: "Corporate",
    dateJoined: "Apr 2, 2022",
    status: "Under Review",
  },
]

export const DEFAULT_INVESTOR_COUNT = 1105
export const DEFAULT_TOTAL_PAGES = 10
