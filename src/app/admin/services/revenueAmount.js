import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getRevenueAmountInvoices = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.RevenueAmountInvoices()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { revenue_amount_list, pagination, filters }, messg }
}

export const getRevenueAmountRevenues = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.RevenueAmountRevenues()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { revenue_amount_list, pagination, filters }, messg }
}

export const getRevenueAmountAssets = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.RevenueAmountAssets()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { revenue_amount_list, pagination, filters }, messg }
}
