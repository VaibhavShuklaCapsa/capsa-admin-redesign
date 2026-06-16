import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getAnchorDetail = async (panNumber) => {
  const apiRoute = routes.AnchorDetails()
  const http = new HttpService()
  const response = await http.postData({ panNumber }, apiRoute)
  return response.data  // { res, data: { anchor, company_docs }, messg }
}

export const editAnchorGrade = async ({ panNumber, grade }) => {
  const apiRoute = routes.AnchorEditGrade()
  const http = new HttpService()
  const response = await http.postData({ panNumber, grade }, apiRoute)
  return response.data  // { res, data: { grade }, messg }
}

export const changeAnchorRate = async ({ panNumber, rate }) => {
  const apiRoute = routes.AnchorChangeRate()
  const http = new HttpService()
  const response = await http.postData({ panNumber, rate }, apiRoute)
  return response.data  // { res, data: { rate }, messg }
}

export const toggleAnchorRF = async ({ panNumber, enabled }) => {
  const apiRoute = routes.AnchorToggleRF()
  const http = new HttpService()
  const response = await http.postData({ panNumber, enabled }, apiRoute)
  return response.data  // { res, data: { rf_enabled }, messg }
}

export const editAnchorEmail = async ({ panNumber, email }) => {
  const apiRoute = routes.AnchorEditEmail()
  const http = new HttpService()
  const response = await http.postData({ panNumber, email }, apiRoute)
  return response.data  // { res, data: { email }, messg }
}

export const editAnchorSubAdmin = async (payload) => {
  const apiRoute = routes.AnchorSubAdminEdit()
  const http = new HttpService()
  const response = await http.postData(payload, apiRoute)
  return response.data  // { res, data, messg }
}

export const deleteAnchorSubAdmin = async (sub_anchor_admin) => {
  const apiRoute = routes.AnchorSubAdminDelete()
  const http = new HttpService()
  const response = await http.postData({ sub_anchor_admin }, apiRoute)
  return response.data  // { res, data, messg }
}

export const addAnchorSubAdmin = async (payload) => {
  const apiRoute = routes.AnchorSubAdminAdd()
  const http = new HttpService()
  const response = await http.postData(payload, apiRoute)
  return response.data  // { res, data, messg }
}

export const getAnchorSubAdmins = async ({ panNumber, search = "" }) => {
  const apiRoute = routes.AnchorSubAdminList()
  const http = new HttpService()
  const payload = { panNumber }
  if (search) payload.search = search
  const response = await http.postData(payload, apiRoute)
  return response.data  // { res, data: { sub_admins, total, search }, messg }
}
