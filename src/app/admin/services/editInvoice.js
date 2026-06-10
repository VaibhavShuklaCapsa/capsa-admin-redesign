import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getEditInvoiceList = async (data) => {
  const apiRoute = routes.AdminEditInvoiceList()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}

export const getEditInvoiceDetails = async (data) => {
  const apiRoute = routes.AdminEditInvoiceDetails()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}

export const saveEditedInvoice = async (data) => {
  const apiRoute = routes.AdminSaveEditedInvoice()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { success: false, apiRoute }
  }
}

export const getAnchorOptions = async () => {
  const apiRoute = routes.GetAnchors()
  try {
    const http = new HttpService()
    const response = await http.getData(apiRoute)
    // expects array of { id, name } or array of strings
    return response?.data ?? []
  } catch {
    return [
      { id: "1", name: "International Breweries" },
      { id: "2", name: "Stanbic IBTC Bank Plc" },
      { id: "3", name: "Shell PLC" },
      { id: "4", name: "Delloite Nigeria" },
    ]
  }
}

export const deleteInvoice = async (data) => {
  const apiRoute = routes.AdminDeleteInvoice()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { success: false, apiRoute }
  }
}
