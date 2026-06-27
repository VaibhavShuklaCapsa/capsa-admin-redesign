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

export const verifyVendorNin = async ({ vendor_id, nin }) => {
  const apiRoute = routes.VerifyVendorNin()
  const http = new HttpService()
  const response = await http.postData({ user_id: Number(vendor_id), nin }, apiRoute)
  return response.data  // { res, data: { verified, nin, verification_response }, messg }
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

export const createVendorAccount = async (user_id) => {
  const apiRoute = routes.CreateVendorAccount()
  const http = new HttpService()
  const response = await http.postData({ user_id }, apiRoute)
  return response.data  // { res, data, messg }
}

export const vendorAccountLetterAction = async ({ user_id, anchor_pan, action, reason }) => {
  const apiRoute = routes.VendorAccountLetterAction()
  const http = new HttpService()
  const payload = { user_id, anchor_pan, action }
  if (reason) payload.reason = reason
  try {
    const response = await http.postData(payload, apiRoute)
    return response.data
  } catch (err) {
    if (err?.response?.data) return err.response.data
    throw err
  }
}

export const vendorKycDocAction = async ({ user_id, field_name, action, reason }) => {
  const apiRoute = routes.VendorKycDocAction()
  const http = new HttpService()
  const payload = { user_id, field_name, action }
  if (reason) payload.reason = reason
  const response = await http.postData(payload, apiRoute)
  return response.data  // { res: "success"|"failed", data: [], messg }
}
