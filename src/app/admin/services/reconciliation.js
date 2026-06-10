import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getReconciliationData = async (data) => {
  const apiRoute = routes.Reconciliation()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}

export const viewBalanceHistory = async (data) => {
  const apiRoute = routes.ReconciliationBalanceHistory()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}

export const viewAccountStatement = async (data) => {
  const apiRoute = routes.ReconciliationAccountStatement()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}
