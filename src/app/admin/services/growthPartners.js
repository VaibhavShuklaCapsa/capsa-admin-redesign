import { routes } from "./apiRoutes"
import HttpService from "./httpService"

// Calls /redesign/admin/growth-partner-list
// payload: { page_number, page_size, search, from_date, to_date }
// Throws on failure so page keeps showing PageLoader
export const getGrowthPartnerList = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.GrowthPartnerList()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { partner_list, pagination, filters }, messg }
}

// Calls /redesign/admin/growth-partner-edit-contact
// fields: { email } or { phone } — user_id always included
export const editGrowthPartnerContact = async (userId, fields) => {
  const apiRoute = routes.GrowthPartnerEditContact()
  const http = new HttpService()
  const response = await http.postData({ user_id: userId, ...fields }, apiRoute)
  return response.data  // { res, data: { updated }, messg }
}

// Calls /redesign/admin/growth-partner-details
// payload: { user_id }
// Throws on failure so page keeps showing PageLoader
export const getGrowthPartnerDetails = async (userId) => {
  const apiRoute = routes.GrowthPartnerDetails()
  const http = new HttpService()
  const response = await http.postData({ user_id: userId }, apiRoute)
  return response.data  // { res, data: { partner, verification_docs }, messg }
}
