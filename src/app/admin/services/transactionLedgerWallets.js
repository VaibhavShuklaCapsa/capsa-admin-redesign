import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getTransactionLedgerWalletsData = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.TransactionLedgerWallets()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { ledger, pagination }, messg }
}
