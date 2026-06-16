import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getEditInvoiceList = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.AdminEditInvoiceList()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { invoice_list, pagination }, messg }
}

export const getEditInvoiceAnchorsList = async () => {
  const apiRoute = routes.AdminEditInvoiceAnchorsList()
  const http = new HttpService()
  const response = await http.postData({}, apiRoute)
  return response.data  // { res, data: { anchors, total }, messg }
}

export const getEditInvoiceDetails = async (deal_id) => {
  const apiRoute = routes.AdminEditInvoiceDetails()
  const http = new HttpService()
  const response = await http.postData({ deal_id }, apiRoute)
  return response.data  // { res, data: { deal_id, basic_information, amount_information, additional_information, ... }, messg }
}

export const updateEditInvoice = async (payload) => {
  const apiRoute = routes.AdminEditInvoiceUpdate()
  const http = new HttpService()
  const response = await http.postData(payload, apiRoute)
  return response.data  // { res, data, messg }
}

export const deleteInvoice = async (deal_id) => {
  const apiRoute = routes.AdminDeleteInvoice()
  const http = new HttpService()
  const response = await http.postData({ deal_id }, apiRoute)
  return response.data  // { res, data, messg }
}
