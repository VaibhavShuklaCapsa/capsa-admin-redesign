import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getDeletedVendors = async (data) => {
  const apiRoute = routes.DeletedVendors()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}

export const getDeletedInvestors = async (data) => {
  const apiRoute = routes.DeletedInvestors()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}

export const getDeletedAnchors = async (data) => {
  const apiRoute = routes.DeletedAnchors()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}

export const getDeletedGrowthPartners = async (data) => {
  const apiRoute = routes.DeletedGrowthPartners()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}
