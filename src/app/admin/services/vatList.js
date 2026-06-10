import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getVatListData = async (payload) => {
  const apiRoute = routes.VatList()
  const http = new HttpService()
  const response = await http.postData(payload, apiRoute)
  return response?.data ?? {}
}
