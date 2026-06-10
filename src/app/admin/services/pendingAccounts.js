import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getPendingVendors = async (data) => {
  const apiRoute = routes.PendingVendors()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}

export const getPendingInvestors = async (data) => {
  const apiRoute = routes.PendingInvestors()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}

export const getPendingGrowthPartners = async (data) => {
  const apiRoute = routes.PendingGrowthPartners()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}
