import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getVendorSweepInData = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "", anchor_pan = "", vendor_pan = "" } = {}) => {
  const apiRoute = routes.VendorSweepInList()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date, anchor_pan, vendor_pan }, apiRoute)
  return response.data  // { res, data: { sweep_list, pagination, filters }, messg }
}
