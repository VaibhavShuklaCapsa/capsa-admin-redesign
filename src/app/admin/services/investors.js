import { routes } from "./apiRoutes"
import HttpService from "./httpService"

// Calls /redesign/admin/investors-list
// payload: { page_number, page_size, search, from_date, to_date }
// Throws on failure so the page keeps showing PageLoader
export const getInvestorList = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.InvestorList()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { investor_list, pagination, filters }, messg }
}
