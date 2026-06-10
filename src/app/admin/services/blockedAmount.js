import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getBlockedAmountData = async (data) => {
  const apiRoute = routes.BlockedAmount()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}

export const unblockAmount = async (data) => {
  const apiRoute = routes.UnblockAmount()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { success: false, apiRoute }
  }
}
