import { routes } from "./apiRoutes"
import HttpService from "./httpService"

// Calls /redesign/admin/rf-invoice-list
// payload: { page_number, page_size, type, search, from_date, to_date }
// Throws on failure so page keeps showing PageLoader
export const getAdminRFInvoiceList = async ({ page_number = 1, page_size = 10, type = "all", search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.AdminRFInvoiceList()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, type, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { invoice_list, pagination, filters }, messg }
}
