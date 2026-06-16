import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getPendingGrowthPartnerDetail = async (gp_id) => {
  const apiRoute = routes.PendingGrowthPartnerDetails()
  const http = new HttpService()
  const response = await http.postData({ id: Number(gp_id) }, apiRoute)
  return response.data  // { res, data: { gp_information }, messg }
}

export const getGpKycDocuments = async (gp_id) => {
  const apiRoute = routes.GpKycDocuments()
  const http = new HttpService()
  const response = await http.postData({ id: Number(gp_id) }, apiRoute)
  return response.data  // { res, data: { kyc_documents: [] }, messg }
}

export const gpKycDocAction = async ({ id, field_name, action, reason }) => {
  const apiRoute = routes.GpKycDocAction()
  const http = new HttpService()
  const payload = { id, field_name, action }
  if (reason) payload.reason = reason
  const response = await http.postData(payload, apiRoute)
  return response.data  // { res: 'success'|'failed', data: [], messg }
}
