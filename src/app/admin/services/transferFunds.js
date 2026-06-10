import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const transferBetweenAccounts = async (data) => {
  const apiRoute = routes.TransferBetweenAccounts()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { success: false, apiRoute }
  }
}

export const debitFromAccount = async (data) => {
  const apiRoute = routes.DebitFromAccount()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { success: false, apiRoute }
  }
}

export const getAccountOptions = async () => {
  const apiRoute = routes.AccountListForTransfer()
  const http = new HttpService()
  const response = await http.postData({}, apiRoute)
  const accounts = response?.data?.data?.accounts ?? []
  return accounts.map((a) => ({
    value: a.account_number,
    label: `${a.account_name} - ${a.account_number} (${a.bank_name})`,
  }))
}
