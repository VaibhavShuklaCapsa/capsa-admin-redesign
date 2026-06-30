import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const transferBetweenAccounts = async ({ sourceAccount, destAccount, amount, sourceNarration, destNarration }) => {
  const apiRoute = routes.TransferBetweenAccounts()
  const http = new HttpService()
  const response = await http.postData(
    {
      source_account: sourceAccount,
      destination_account: destAccount,
      amount,
      source_narration: sourceNarration,
      destination_narration: destNarration,
    },
    apiRoute
  )
  return response?.data
}

export const debitFromAccount = async ({ sourceAccount, sourceNarration, amount }) => {
  const apiRoute = routes.DebitFromAccount()
  const http = new HttpService()
  const response = await http.postData(
    {
      source_account: sourceAccount,
      source_narration: sourceNarration,
      amount,
    },
    apiRoute
  )
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
      name: a.account_name || a.account_number,
      label: a.account_name
        ? `${a.account_name} - ${a.account_number}`
        : a.account_number,
    }))
}
