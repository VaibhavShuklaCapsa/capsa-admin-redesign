import { routes } from "./apiRoutes"
import HttpService from "./httpService"
import { format } from "date-fns"

// Calls /redesign/admin/requestor-list
// payload: { page_number, page_size, search, from_date, to_date }
// Throws on network/server failure so the page keeps showing PageLoader
export const getVendorList = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.VendorList()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data.data   // { vendor_list, pagination, filters }
}
