import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getReconciliationData = async () => {
  const apiRoute = routes.Reconciliation()
  const http = new HttpService()
  const response = await http.postData({}, apiRoute)
  return response.data  // { res, data: { pool_account_balance, capsa_platform_balance, difference, error_pool, error_platform }, messg }
}

export const viewBalanceHistory = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "", balance_filter = "all" } = {}) => {
  const apiRoute = routes.ReconciliationBalanceHistory()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date, balance_filter }, apiRoute)
  return response.data  // { res, data: { balance_list, pagination, filters }, messg }
}

export const viewAccountStatement = async ({
  account_number = "",
  page_number = 1,
  page_size = 10,
  search = "",
  from_date = "",
  to_date = "",
} = {}) => {
  const apiRoute = routes.ReconciliationAccountStatement()
  const http = new HttpService()
  const response = await http.postData(
    { account_number, page_number, page_size, search, from_date, to_date },
    apiRoute
  )

  const csv = response?.data
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const blobUrl = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = blobUrl
  link.setAttribute("download", `account-statement-${Date.now()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(blobUrl)
}
