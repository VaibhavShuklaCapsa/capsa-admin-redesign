import { routes } from "./apiRoutes"
import HttpService from "./httpService"

const CORPORATE_MOCK = {
  pageTitle: "User Details",
  pageSubtitle: "Showing user information",
  investor: {
    id: "2",
    name: "Kodvest",
    status: "Pending",
    investorType: "Corporate",
    bvn: "39029028428",
    email: "sale@kodvest.com",
    phone: "+2348030516178",
    dateJoined: "Mar 21, 2021",
    businessEntityType: "Limited Liability Company",
    industry: "Technology",
    dateFounded: "Mar 21, 2021",
    rcNumber: "RC3093020",
    address: "10, Alfred Rewane Road, Lekki, Lagos",
    director: {
      name: "Oladayo Olawuni",
      phone: "+2348030516178",
      bvn: "39029028428",
      nin: "1239023902392",
      politicalAffiliation: "No",
    },
  },
  actions: [
    { title: "View KYC Documents" },
    { title: "Approve Account" },
    { title: "Delete Account" },
  ],
}

const INDIVIDUAL_MOCK = {
  pageTitle: "User Details",
  pageSubtitle: "Showing user information",
  investor: {
    id: "3",
    name: "Oladayo Olawuni",
    status: "Pending",
    investorType: "Individual",
    bvn: "39029028428",
    email: "dayuwuni@g.com",
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

export const getPendingInvestorDetail = async (id) => {
  const apiRoute = routes.PendingInvestorDetails(id)
  try {
    const http = new HttpService()
    const response = await http.getData(apiRoute)
    return response?.data ?? CORPORATE_MOCK
  } catch {
    // alternate mock types for demo: even ids → Corporate, odd → Individual
    const isEven = Number(id) % 2 === 0
    return isEven ? CORPORATE_MOCK : INDIVIDUAL_MOCK
  }
}
