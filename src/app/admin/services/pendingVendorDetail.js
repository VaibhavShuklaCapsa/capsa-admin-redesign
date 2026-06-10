import { routes } from "./apiRoutes"
import HttpService from "./httpService"

const MOCK_DATA = {
  pageTitle: "User Details",
  pageSubtitle: "Showing user information",
  vendor: {
    id: "1",
    name: "Delloite Nigeria",
    status: "Pending",
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
    director: {
      name: "Oladayo Olawuni",
      phone: "+2348030516178",
      bvn: "39029028428",
      nin: "1239023902392",
      politicalAffiliation: "No",
    },
    bankAccount: {
      // accountCreated: false  →  not created state (ss1)
      // accountCreated: true   →  created state (ss2)
      accountCreated: false,
      anchorName: "International Breweries",
      bankName: "Stanbic IBTC",
      accountNumber: "0051456754",
      accountName: "Olawuni Oladayo",
      accountLetterFile: "DOC389343200_2025_05_18.pdf",
    },
  },
  actions: [
    { title: "View KYC Documents" },
    { title: "Approve Account" },
    { title: "Delete Account" },
  ],
}

export const getPendingVendorDetail = async (id) => {
  const apiRoute = routes.PendingVendorDetails(id)
  try {
    const http = new HttpService()
    const response = await http.getData(apiRoute)
    return response?.data ?? MOCK_DATA
  } catch {
    return { ...MOCK_DATA, vendor: { ...MOCK_DATA.vendor, id } }
  }
}
