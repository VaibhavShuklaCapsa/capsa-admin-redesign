import { routes } from "./apiRoutes"
import HttpService from "./httpService"

// Calls /redesign/admin/guarantor-list
// payload: { page_number, page_size, search, from_date, to_date }
// Throws on failure so page keeps showing PageLoader
export const getGuarantorList = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.GuarantorList()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { guarantor_list, pagination, filters }, messg }
}

// Calls /redesign/admin/guarantor-details
// payload: { rc_number } — rc_number comes from the selected row in the list
// Throws on failure so page keeps showing PageLoader
export const getGuarantorDetails = async (rcNumber) => {
  const apiRoute = routes.GuarantorDetails()
  const http = new HttpService()
  const response = await http.postData({ rc_number: rcNumber }, apiRoute)
  return response.data  // { res, data: { guarantor, verification_docs }, messg }
}

// Calls /redesign/admin/add-guarantor
// Multipart: name, rc_number, financial_report (file)
// Throws on failure so caller can handle toast
export const addGuarantor = async (formData) => {
  const apiRoute = routes.AddGuarantor()
  const http = new HttpService()
  const response = await http.postFormData(formData, apiRoute)
  return response.data  // { res, data, messg }
}
