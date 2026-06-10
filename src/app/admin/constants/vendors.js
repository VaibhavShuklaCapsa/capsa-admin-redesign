export const DEFAULT_PAGE_TITLE = "Vendors"
export const DEFAULT_PAGE_SUBTITLE = "Showing all vendors"
export const DEFAULT_VENDOR_COUNT_LABEL = "Vendors"
export const DEFAULT_SEARCH_PLACEHOLDER = "Search by vendor name, BVN"
export const DEFAULT_FILTERS_LABEL = "Filters"
export const DEFAULT_DOWNLOAD_LABEL = "Download"
export const DEFAULT_DATE_RANGE_LABEL = "Select Date Range"

export const VENDOR_TABLE_HEADER = [
  { key: "Vendor Name", title: "name" },
  { key: "BVN", title: "bvn" },
  { key: "Email Address", title: "email" },
  { key: "Phone Number", title: "phone" },
  { key: "Date Joined", title: "dateJoined" },
  { key: "Status", title: "status" },
]

export const VENDOR_ROW_ACTIONS = [
  { title: "View User Details" },
  { title: "Block Account" },
  { title: "Delete Account" },
]

export const STATUS_STYLES = {
  Active: "bg-lightGreen text-deepGreen border-transparent",
  Pending: "bg-custard text-yellow border-transparent",
  "Under Review": "bg-backgroundBlue text-blue border-transparent",
}

export const DEFAULT_VENDORS = [
  {
    id: "1",
    name: "Stanbic IBTC Bank Plc",
    bvn: "22142233460",
    email: "force@stanbic.com",
    phone: "08030516178",
    dateJoined: "Sept 30, 2021",
    status: "Active",
  },
  {
    id: "2",
    name: "Shell PLC",
    bvn: "22142233461",
    email: "contact@shell.com",
    phone: "08030516179",
    dateJoined: "Oct 12, 2021",
    status: "Pending",
  },
  {
    id: "3",
    name: "Delloite Nigeria",
    bvn: "22142233462",
    email: "info@deloitte.ng",
    phone: "08030516180",
    dateJoined: "Nov 5, 2021",
    status: "Under Review",
  },
  {
    id: "4",
    name: "Access Bank Plc",
    bvn: "22142233463",
    email: "support@accessbank.com",
    phone: "08030516181",
    dateJoined: "Dec 1, 2021",
    status: "Active",
  },
  {
    id: "5",
    name: "MTN Nigeria",
    bvn: "22142233464",
    email: "hello@mtn.ng",
    phone: "08030516182",
    dateJoined: "Jan 15, 2022",
    status: "Active",
  },
  {
    id: "6",
    name: "Dangote Group",
    bvn: "22142233465",
    email: "info@dangote.com",
    phone: "08030516183",
    dateJoined: "Feb 20, 2022",
    status: "Pending",
  },
  {
    id: "7",
    name: "Flutterwave",
    bvn: "22142233466",
    email: "team@flutterwave.com",
    phone: "08030516184",
    dateJoined: "Mar 8, 2022",
    status: "Active",
  },
  {
    id: "8",
    name: "Interswitch",
    bvn: "22142233467",
    email: "contact@interswitch.com",
    phone: "08030516185",
    dateJoined: "Apr 2, 2022",
    status: "Under Review",
  },
]

export const DEFAULT_VENDOR_COUNT = 1105
export const DEFAULT_TOTAL_PAGES = 10
