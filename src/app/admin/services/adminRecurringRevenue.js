import { routes } from "./apiRoutes"
import HttpService from "./httpService"

// Calls /redesign/admin/rr-list
// payload: { page_number, page_size, type, search, from_date, to_date }
// Throws on failure so page keeps showing PageLoader
export const getAdminRRList = async ({ page_number = 1, page_size = 10, type = "all", search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.AdminRRList()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, type, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { rr_list, pagination, filters }, messg }
}

export const reviewAdminRR = async ({ deal_id, action, reason }) => {
  const apiRoute = routes.AdminRRReview()
  const http = new HttpService()
  const payload = { deal_id, action }
  if (reason) payload.reason = reason
  try {
    const response = await http.postData(payload, apiRoute)
    return response.data  // { res, data, messg }
  } catch (err) {
    if (err?.response?.data) return err.response.data
    throw err
  }
}
