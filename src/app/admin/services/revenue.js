import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getRevenueData = async ({ page_number = 1, page_size = 10, from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.AdminRevenue()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { revenue_list, pagination, filters }, messg }
}
