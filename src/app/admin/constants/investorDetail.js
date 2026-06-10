export const DEFAULT_PAGE_TITLE = "User Details"
export const DEFAULT_PAGE_SUBTITLE = "Showing user information"

export const INVESTOR_DETAIL_TABS = [
  { value: "vendor-information", label: "Investor Information" },
  { value: "beneficiary-account", label: "Beneficiary Account" },
  { value: "email-preferences", label: "Email Preferences" },
]

export const INVESTOR_DETAIL_ACTIONS = [
  { title: "Block Account" },
  { title: "Delete Account" },
]

export const DEFAULT_INVESTOR_DETAIL = {
  id: "1",
  name: "Stanbic IBTC Capital",
  status: "Active",
  bvn: "33142233460",
  email: "invest@stanbic.com",
  phone: "+2348030516178",
  rcNumber: "RC4093020",
  dateJoined: "Sept 30, 2021",
  businessEntityType: "Individual",
  industry: "Financial Services",
  dateFounded: "Mar 21, 2021",
  tin: "1234567890-0002",
  address: "10, Alfred Rewane Road, Lekki, Lagos",
  anchor: "Stanbic IBTC Bank",
  directorName: "Oladayo Olawuni",
  directorPhone: "+2348030516178",
  directorBvn: "33142233460",
  directorNin: "1239023902392",
  politicalAffiliation: "No",
  companyDocuments: [
    { title: "Proof of Address", file: "DOC389343200_2025_05_18.pdf" },
    { title: "Proof of Identity", file: "DOC389343200_2025_05_18.pdf" },
  ],
  directorDocuments: [
    { title: "Valid Identification", file: "DOC389343200_2025_05_18.pdf" },
    { title: "Bank Statement", file: "DOC389343200_2025_06_18.pdf" },
  ],
}
