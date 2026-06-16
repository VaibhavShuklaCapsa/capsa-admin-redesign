import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const addAnchorBusinessInfo = async (data) => {
  const apiRoute = routes.AddAnchorBusinessInfo()
  const http = new HttpService()
  const response = await http.postData(data, apiRoute)
  return response.data  // { res, data, messg }
}

export const addAnchorDocuments = async ({ bvn, financialReport, balanceSheet, profitLoss }) => {
  const apiRoute = routes.AddAnchorDocuments()
  const http = new HttpService()
  const fd = new FormData()
  fd.append("bvn", bvn)
  fd.append("financial_report", financialReport)
  fd.append("balance_sheet", balanceSheet)
  fd.append("profit_loss", profitLoss)
  const response = await http.postFormData(fd, apiRoute)
  return response.data  // { res, data, messg }
}
