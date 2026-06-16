import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getPendingInvestorDetail = async (investor_id) => {
  const apiRoute = routes.PendingInvestorDetails()
  const http = new HttpService()
  const response = await http.postData({ user_id: Number(investor_id) }, apiRoute)
  return response.data  // { res, data: { investor_information, directors_information }, messg }
}

export const verifyInvestorBvn = async ({ user_id, bvn }) => {
  const apiRoute = routes.VerifyVendorBvn()
  const http = new HttpService()
  const response = await http.postData({ user_id, bvn }, apiRoute)
  return response.data
}

export const verifyInvestorNin = async ({ user_id, nin }) => {
  const apiRoute = routes.VerifyVendorNin()
  const http = new HttpService()
  const response = await http.postData({ user_id, nin }, apiRoute)
  return response.data
}

export const getInvestorKycDocuments = async (investor_id) => {
  const apiRoute = routes.InvestorKycDocuments()
  const http = new HttpService()
  const response = await http.postData({ user_id: Number(investor_id) }, apiRoute)
  return response.data  // { res, data: { investor_type, kyc_documents: [] }, messg }
}

export const investorKycDocAction = async ({ user_id, field_name, action, reason }) => {
  const apiRoute = routes.InvestorKycDocAction()
  const http = new HttpService()
  const payload = { user_id, field_name, action }
  if (reason) payload.reason = reason
  const response = await http.postData(payload, apiRoute)
  return response.data  // { res, data, messg }
}
