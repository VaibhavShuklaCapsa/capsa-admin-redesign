import { routes } from "./apiRoutes"
import HttpService from "./httpService"
import { format } from "date-fns"
import { VENDOR_DETAIL_TABS, VENDOR_DETAIL_ACTIONS } from "../constants/vendorDetail"

const fmtDate = (iso) => {
  if (!iso) return ""
  try { return format(new Date(iso), "MMM d, yyyy") } catch { return iso }
}

// Calls /redesign/admin/requestor-details
// payload: { panNumber: "<bvn>" }
// Throws on failure so the page keeps showing PageLoader
// Calls /redesign/admin/requestor-anchor-letters
// payload: { panNumber: bvn }
// Throws on failure — caller keeps showing loader
export const getVendorAnchorLetters = async (bvn) => {
  const apiRoute = routes.VendorAnchorLetters()
  const http = new HttpService()
  const response = await http.postData({ panNumber: bvn }, apiRoute)
  return response.data  // { res, data: { anchor_letters: [...] }, messg }
}

// Calls /redesign/admin/requestor-beneficiary-account
// Calls /redesign/admin/bank-codes
export const getBankCodes = async (search = "") => {
  const apiRoute = routes.BankCodes()
  const http = new HttpService()
  const response = await http.postData({ search }, apiRoute)
  return response.data.data.banks ?? []
}

// Calls /redesign/admin/requestor-update-beneficiary
export const updateVendorBeneficiary = async (payload) => {
  const apiRoute = routes.VendorUpdateBeneficiary()
  const http = new HttpService()
  const response = await http.postData(payload, apiRoute)
  return response.data  // { res, data: { beneficiary }, messg }
}

export const getVendorBeneficiaryAccount = async (bvn) => {
  const apiRoute = routes.VendorBeneficiaryAccount()
  const http = new HttpService()
  const response = await http.postData({ panNumber: bvn }, apiRoute)
  return response.data  // { res, data: { beneficiary: { bank_name, account_number, account_name } }, messg }
}

// Calls /redesign/admin/requestor-edit-contact
// payload is dynamic — only pass the field being updated:
//   email only  → { panNumber, email }
//   phone only  → { panNumber, phone }
export const editVendorContact = async (panNumber, fields) => {
  const apiRoute = routes.VendorEditContact()
  const http = new HttpService()
  const response = await http.postData({ panNumber, ...fields }, apiRoute)
  return response.data  // { res, data: { updated: [...] }, messg }
}

// Calls /redesign/admin/requestor-email-preferences
export const getVendorEmailPreferences = async (bvn) => {
  const apiRoute = routes.VendorEmailPreferences()
  const http = new HttpService()
  const response = await http.postData({ panNumber: bvn }, apiRoute)
  return response.data  // { res, data: { preferences }, messg }
}

// Calls /redesign/admin/requestor-update-email-preference
// field: "saleOfInvoice" | "creditInvoiceSale" | "overdueInvoices"
// value: 0 | 1
export const updateVendorEmailPreference = async (bvn, field, value) => {
  const apiRoute = routes.VendorUpdateEmailPreference()
  const http = new HttpService()
  const response = await http.postData({ panNumber: bvn, field, value }, apiRoute)
  return response.data  // { res, data: { field, value }, messg }
}

export const getVendorDetailData = async (bvn) => {
  const apiRoute = routes.VendorDetails()
  const http = new HttpService()
  const response = await http.postData({ panNumber: bvn }, apiRoute)
  const d = response.data.data  // { vendor, director, company_docs, director_docs }

  // Map API response → shape VendorDetailContent expects
  const vendor = {
    name:               d.vendor?.name               ?? "",
    status:             d.vendor?.status             ?? "",
    bvn:                d.vendor?.bvn                ?? "",
    email:              d.vendor?.email              ?? "",
    phone:              d.vendor?.phone              ?? "",
    rcNumber:           d.vendor?.rc_bn              ?? "",
    dateJoined:         fmtDate(d.vendor?.date_joined),
    businessEntityType: d.vendor?.business_entity_type ?? "",
    industry:           d.vendor?.industry           ?? "",
    dateFounded:        fmtDate(d.vendor?.date_founded),
    tin:                d.vendor?.tin                ?? "",
    address:            d.vendor?.address            ?? "",
    anchor:             Array.isArray(d.vendor?.anchors) && d.vendor.anchors.length > 0
                          ? d.vendor.anchors.join(", ")
                          : "",

    // Director info
    directorName:         d.director?.name                 ?? "",
    directorPhone:        d.director?.phone                ?? "",
    directorBvn:          d.director?.bvn                  ?? "",
    directorNin:          d.director?.nin                  ?? "",
    politicalAffiliation: d.director?.political_affiliation ?? "",

    // Documents — map { label, filename, url } → { title, file, url }
    companyDocuments:  (d.company_docs ?? []).map((doc) => ({
      title: doc.label    ?? "",
      file:  doc.filename ?? "",
      url:   doc.url      ?? null,
    })),
    directorDocuments: (d.director_docs ?? []).map((doc) => ({
      title: doc.label    ?? "",
      file:  doc.filename ?? "",
      url:   doc.url      ?? null,
    })),
  }

  return {
    pageTitle:   vendor.name || "Vendor Details",
    pageSubtitle:"Showing vendor information",
    tabs:        VENDOR_DETAIL_TABS,
    actions:     VENDOR_DETAIL_ACTIONS,
    vendor,
  }
}
