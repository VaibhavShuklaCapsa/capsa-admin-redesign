import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const transferBetweenAccounts = async (data) => {
  const apiRoute = routes.TransferBetweenAccounts()
  const http = new HttpService()
  const response = await http.postData(data, apiRoute)
  return response?.data
}

export const debitFromAccount = async (data) => {
  const apiRoute = routes.DebitFromAccount()
  const http = new HttpService()
  const response = await http.postData(data, apiRoute)
  return response?.data
}

export const getAccountOptions = async () => {
  const apiRoute = routes.TransferFundsAccountsList()
  const http = new HttpService()
  const response = await http.postData({}, apiRoute)
  const accounts = response?.data?.data?.accounts ?? []
  return accounts
    .filter((a) => a.account_number)
    .map((a) => ({
      value: a.account_number,
      label: a.account_name
        ? `${a.account_name} - ${a.account_number}`
        : a.account_number,
    }))
}
