import { routes } from "./apiRoutes"
import HttpService from "./httpService"

const MOCK_DATA = {
  pageTitle: "User Details",
  pageSubtitle: "Showing user information",
  partner: {
    id: "1",
    name: "John Doe",
    status: "Pending",
    bvn: "39029028428",
    email: "sale@kodvest.com",
    phone: "+2348030516178",
    dateJoined: "Mar 21, 2021",
    address: "10, Alfred Rewane Road, Lekki, Lagos",
    city: "Lagos",
    state: "Lagos",
  },
  actions: [
    { title: "View KYC Documents" },
    { title: "Approve Account" },
    { title: "Delete Account" },
  ],
}

export const getPendingGrowthPartnerDetail = async (id) => {
  const apiRoute = routes.PendingGrowthPartnerDetails(id)
  try {
    const http = new HttpService()
    const response = await http.getData(apiRoute)
    return response?.data ?? MOCK_DATA
  } catch {
    return { ...MOCK_DATA, partner: { ...MOCK_DATA.partner, id } }
  }
}
