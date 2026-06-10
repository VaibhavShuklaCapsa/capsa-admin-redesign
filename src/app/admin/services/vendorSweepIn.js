import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getVendorSweepInData = async (data) => {
  const apiRoute = routes.VendorSweepInList()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}
