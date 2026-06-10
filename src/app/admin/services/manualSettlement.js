import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getManualSettlementInvoices = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.ManualSettlementInvoices()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { settlement_list, pagination }, messg }
}

export const applySettlementInvoice = async ({ pan, invoice }) => {
  const apiRoute = routes.SettlementInvoiceApply()
  const http = new HttpService()
  const response = await http.postData({ pan, invoice }, apiRoute)
  return response.data  // { res, data, messg }
}

export const applySettlementRFInvoice = async ({ pan, invoice }) => {
  const apiRoute = routes.SettlementRFInvoiceApply()
  const http = new HttpService()
  const response = await http.postData({ pan, invoice }, apiRoute)
  return response.data
}

export const getManualSettlementRFInvoices = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.ManualSettlementRFInvoices()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data
}

export const applySettlementRevenue = async ({ deal_id }) => {
  const apiRoute = routes.SettlementRevenueApply()
  const http = new HttpService()
  const response = await http.postData({ deal_id }, apiRoute)
  return response.data
}

export const getManualSettlementRevenues = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.ManualSettlementRevenues()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data
}

export const getManualSettlementAssets = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.ManualSettlementAssets()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data
}
