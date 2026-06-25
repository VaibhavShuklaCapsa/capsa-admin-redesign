import { routes } from "./apiRoutes"
import HttpService from "./httpService"

// Calls /redesign/admin/asset-list
// payload: { page_number, page_size, type, search, from_date, to_date }
// Throws on failure so page keeps showing PageLoader
export const getAdminAssetList = async ({ page_number = 1, page_size = 10, type = "all", search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.AdminAssetList()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, type, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { asset_list, pagination, filters }, messg }
}

export const reviewAdminAsset = async ({ asset_id, action, reason }) => {
  const apiRoute = routes.AdminAssetReview()
  const http = new HttpService()
  const payload = { asset_id, action }
  if (reason) payload.reason = reason
  try {
    const response = await http.postData(payload, apiRoute)
    return response.data  // { res, data, messg }
  } catch (err) {
    if (err?.response?.data) return err.response.data
    throw err
  }
}
