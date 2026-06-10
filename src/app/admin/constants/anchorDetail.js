export const DEFAULT_PAGE_TITLE = "User Details"
export const DEFAULT_PAGE_SUBTITLE = "Showing user information"

export const ANCHOR_DETAIL_TABS = [
  { value: "vendor-information", label: "Anchor Information" },
  { value: "beneficiary-account", label: "Beneficiary Account" },
  { value: "email-preferences", label: "Email Preferences" },
]

export const ANCHOR_DETAIL_ACTIONS = [
  { title: "Block Account" },
  { title: "Delete Account" },
]

export const DEFAULT_ANCHOR_DETAIL = {
  id: "1",
  name: "Stanbic IBTC Bank Plc",
  status: "Active",
  bvn: "44142233460",
  email: "anchor@stanbic.com",
  phone: "+2348030516178",
  rcNumber: "RC5093020",
  dateJoined: "Sept 30, 2021",
  businessEntityType: "Limited Liability Company",
  industry: "Banking",
  dateFounded: "Mar 21, 2021",
  tin: "1234567890-0003",
  address: "10, Alfred Rewane Road, Lekki, Lagos",
  anchor: "Deloitte Nigeria",
  directorName: "Oladayo Olawuni",
  directorPhone: "+2348030516178",
  directorBvn: "44142233460",
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
