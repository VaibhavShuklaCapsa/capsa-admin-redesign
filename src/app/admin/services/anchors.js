import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getAnchorsData = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.AnchorsList()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { anchor_list, pagination, filters }, messg }
}
