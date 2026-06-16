import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getPendingVendorDetail = async (vendor_id) => {
  const apiRoute = routes.PendingVendorDetails()
  const http = new HttpService()
  const response = await http.postData({ vendor_id }, apiRoute)
  return response.data  // { res, data: { vendor_information, directors_information }, messg }
}

export const verifyVendorTin = async ({ vendor_id, tin }) => {
  const apiRoute = routes.VerifyVendorTin()
  const http = new HttpService()
  const response = await http.postData({ vendor_id, tin }, apiRoute)
  return response.data  // { res, data, messg }
}

export const verifyVendorBvn = async ({ vendor_id, bvn }) => {
  const apiRoute = routes.VerifyVendorBvn()
  const http = new HttpService()
  const response = await http.postData({ vendor_id, bvn }, apiRoute)
  return response.data  // { res, data, messg }
}

export const getVendorKycDocuments = async (vendor_id) => {
  const apiRoute = routes.PendingVendorKycDocuments()
  const http = new HttpService()
  const response = await http.postData({ vendor_id }, apiRoute)
  return response.data  // { res, data: { core_kyc, additional_kyc, business_type }, messg }
}

export const getVendorAccountLetters = async (vendor_id) => {
  const apiRoute = routes.VendorAccountLetters()
  const http = new HttpService()
  const response = await http.postData({ user_id: Number(vendor_id) }, apiRoute)
  return response.data  // { res, data: { accounts }, messg }
}

export const vendorKycDocAction = async ({ user_id, field_name, action, reason }) => {
  const apiRoute = routes.VendorKycDocAction()
  const http = new HttpService()
  const payload = { user_id, field_name, action }
  if (reason) payload.reason = reason
  const response = await http.postData(payload, apiRoute)
  return response.data  // { res: "success"|"failed", data: [], messg }
}
