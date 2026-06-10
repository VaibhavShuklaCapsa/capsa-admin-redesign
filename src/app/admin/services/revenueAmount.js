import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getRevenueAmountInvoices = async (data) => {
  const apiRoute = routes.RevenueAmountInvoices()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}

export const getRevenueAmountRevenues = async (data) => {
  const apiRoute = routes.RevenueAmountRevenues()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}

export const getRevenueAmountAssets = async (data) => {
  const apiRoute = routes.RevenueAmountAssets()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}
