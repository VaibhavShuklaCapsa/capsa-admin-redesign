import { routes } from "./apiRoutes"
import HttpService from "./httpService"

// Calls /redesign/admin/account-overview
// payload: { account_number } — empty string = admin/platform default
// Throws on failure so page keeps showing PageLoader
export const getAccountOverview = async (accountNumber = "") => {
  const apiRoute = routes.AdminAccountOverview()
  const http = new HttpService()
  const response = await http.postData({ account_number: accountNumber }, apiRoute)
  return response.data  // { res, data: { capsa_account_balance, total_transaction_value, capsa_bank_account }, messg }
}

// Calls /redesign/admin/account-transactions
// payload: { account_number, page_number, page_size, search, from_date, to_date }
// Throws on failure so page keeps showing PageLoader
export const getAccountTransactions = async ({ account_number = "", page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.AdminAccountTransactions()
  const http = new HttpService()
  const response = await http.postData({ account_number, page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { account_number, transactions, pagination, filters }, messg }
}

// Calls /redesign/admin/accounts-by-role
// payload: { role }
export const getAccountsByRole = async (role = "ADMIN") => {
  const apiRoute = routes.AccountsByRole()
  const http = new HttpService()
  const response = await http.postData({ role }, apiRoute)
  return response.data  // { res, data: { accounts, total }, messg }
}
