import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getTransactionLedgerAccountsData = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.TransactionLedgerAccounts()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { ledger, pagination, filters }, messg }
}

export const reverseTransactionAccount = async ({ id }) => {
  const apiRoute = routes.TransactionReverseAccounts()
  const http = new HttpService()
  const response = await http.postData({ id }, apiRoute)
  return response.data  // { res, data, messg }
}
