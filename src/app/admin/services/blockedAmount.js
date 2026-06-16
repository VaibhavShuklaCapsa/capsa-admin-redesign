import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getBlockedAmountData = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.BlockedAmount()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { blocked_list, pagination, filters }, messg }
}

export const unblockAmount = async ({ nadId, account_number, order_number }) => {
  const apiRoute = routes.UnblockAmount()
  const http = new HttpService()
  const response = await http.postData({ nadId, account_number, order_number }, apiRoute)
  return response.data  // { res, data, messg }
}
