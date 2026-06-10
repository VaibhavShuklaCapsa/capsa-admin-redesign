export const DEFAULT_PAGE_TITLE = "User Details"
export const DEFAULT_PAGE_SUBTITLE = "Showing user information"

export const VENDOR_DETAIL_TABS = [
  { value: "vendor-information", label: "Vendor Information" },
  { value: "anchors",            label: "Anchors" },
  { value: "beneficiary-account", label: "Account and Beneficiary" },
  { value: "email-preferences",  label: "Email Preferences" },
]

export const VENDOR_DETAIL_ACTIONS = [
  { title: "Block Account" },
  { title: "Delete Account" },
]

export const DEFAULT_VENDOR_DETAIL = {
  id: "3",
  name: "Delloite Nigeria",
  status: "Active",
  bvn: "39029028428",
  email: "admin@delloite.com",
  phone: "+2348030516178",
  rcNumber: "RC3093020",
  dateJoined: "Mar 21, 2021",
  businessEntityType: "Limited Liability Company",
  industry: "Technology",
  dateFounded: "Mar 21, 2021",
  tin: "1234567890-0001",
  address: "10, Alfred Rewane Road, Lekki, Lagos",
  anchor: "Stanbic IBTC Bank",
  directorName: "Oladayo Olawuni",
  directorPhone: "+2348030516178",
  directorBvn: "39029028428",
  directorNin: "1239023902392",
  politicalAffiliation: "No",
  companyDocuments: [
    { title: "Proof of Operational Address", file: "DOC389343200_2025_05_18.pdf" },
    { title: "Proof of Registration", file: "DOC389343200_2025_05_18.pdf" },
    { title: "CAC Form 2", file: "DOC389343200_2025_05_18.pdf" },
    { title: "CAC Form 7", file: "DOC389343200_2025_06_18.pdf" },
  ],
  directorDocuments: [
    { title: "Board Resolution Document", file: "DOC389343200_2025_05_18.pdf" },
    { title: "Valid Identification", file: "DOC389343200_2025_05_18.pdf" },
  ],
}
