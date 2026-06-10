import { routes } from "./apiRoutes"
import HttpService from "./httpService"

// Calls /redesign/admin/invoices-list
// payload: { page_number, page_size, type, search, from_date, to_date }
// type: all | uploaded | pending | live | bid_accepted | open_repayment |
//       secondary_market | closed | overdue | expired_no_bid
// Throws on failure so page keeps showing PageLoader
// Calls /redesign/admin/invoice-delete
// payload: { deal_id }
export const deleteAdminInvoice = async (dealId) => {
  const apiRoute = routes.AdminInvoiceDelete()
  const http = new HttpService()
  const response = await http.postData({ deal_id: dealId }, apiRoute)
  return response.data  // { res, data, messg }
}

// Calls /redesign/admin/invoice-cancel-accepted-bid
// payload: { deal_id, invoice_number }
export const cancelAcceptedBid = async (dealId, invoiceNumber) => {
  const apiRoute = routes.AdminInvoiceCancelBid()
  const http = new HttpService()
  const response = await http.postData({ deal_id: dealId, invoice_number: invoiceNumber }, apiRoute)
  return response.data  // { res, data, messg }
}

export const getAdminInvoicesList = async ({ page_number = 1, page_size = 10, type = "all", search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.AdminInvoicesList()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, type, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { invoice_list, pagination, filters }, messg }
}
