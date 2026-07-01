import { routes } from "./apiRoutes"
import HttpService from "./httpService"
import { format } from "date-fns"
import { INVESTOR_DETAIL_TABS, INVESTOR_DETAIL_ACTIONS } from "../constants/investorDetail"

const fmtDate = (iso) => {
  if (!iso) return ""
  try { return format(new Date(iso), "MMM d, yyyy") } catch { return iso }
}

// Calls /redesign/admin/investor-edit-contact
// fields: { email } or { phone } or { email, phone }
export const editInvestorContact = async (bvn, fields) => {
  const apiRoute = routes.InvestorEditContact()
  const http = new HttpService()
  const response = await http.postData({ panNumber: bvn, ...fields }, apiRoute)
  return response.data  // { res, data: { updated: [...] }, messg }
}

// Calls /redesign/admin/investor-update-beneficiary
export const updateInvestorBeneficiary = async (payload) => {
  const apiRoute = routes.InvestorUpdateBeneficiary()
  const http = new HttpService()
  const response = await http.postData(payload, apiRoute)
  return response.data  // { res, data, messg }
}

// Calls /redesign/admin/investor-email-preferences
export const getInvestorEmailPreferences = async (bvn) => {
  const apiRoute = routes.InvestorEmailPreferences()
  const http = new HttpService()
  const response = await http.postData({ panNumber: bvn }, apiRoute)
  return response.data  // { res, data: { preferences }, messg }
}

// Calls /redesign/admin/investor-update-email-preference
// field: "newDeals" | "purchaseOfInvoice" | "debitInvoicePurchase"
// value: 0 | 1
export const updateInvestorEmailPreference = async (bvn, field, value) => {
  const apiRoute = routes.InvestorUpdateEmailPreference()
  const http = new HttpService()
  const response = await http.postData({ panNumber: bvn, field, value }, apiRoute)
  return response.data  // { res, data: { field, value }, messg }
}

// Calls /redesign/admin/investor-beneficiary-account
// payload: { panNumber: bvn }
export const getInvestorBeneficiaryAccount = async (bvn) => {
  const apiRoute = routes.InvestorBeneficiaryAccount()
  const http = new HttpService()
  const response = await http.postData({ panNumber: bvn }, apiRoute)
  return response.data  // { res, data: { beneficiary }, messg }
}

// Calls /redesign/admin/investor-details
// payload: { panNumber: bvn }
// Throws on failure so the page keeps showing PageLoader
export const getInvestorDetailData = async (bvn) => {
  const apiRoute = routes.InvestorDetails()
  const http = new HttpService()
  const response = await http.postData({ panNumber: bvn }, apiRoute)
  const d = response.data  // full { res, data: { investor, director, company_docs, director_docs }, messg }

  const inv = d.data?.investor ?? {}
  const dir = d.data?.director ?? {}

  const investor = {
    name:               inv.name               ?? "",
    status:             inv.status             ?? "",
    bvn:                inv.bvn                ?? "",
    email:              inv.email              ?? "",
    phone:              inv.phone              ?? "",
    rcNumber:           inv.rc_bn              ?? "",
    dateJoined:         fmtDate(inv.date_joined),
    type:               inv.type               ?? "",
    businessEntityType: inv.business_entity_type ?? "",
    industry:           inv.industry           ?? "",
    dateFounded:        fmtDate(inv.date_founded),
    tin:                inv.tin                ?? "",
    address:            inv.address            ?? "",
    city:               inv.city               ?? "",
    state:              inv.state              ?? "",
    anchor:             "",

    // Director info
    directorName:         dir.name                  ?? "",
    directorPhone:        dir.phone                 ?? "",
    directorBvn:          dir.bvn                   ?? "",
    directorNin:          dir.nin                   ?? "",
    politicalAffiliation: dir.political_affiliation ?? "",

    // Documents
    companyDocuments:  (d.data?.company_docs ?? []).map((doc) => ({
      title: doc.label    ?? "",
      file:  doc.filename ?? "",
      url:   doc.url      ?? null,
      ext:   doc.ext      ?? "",
    })),
    directorDocuments: (d.data?.director_docs ?? []).map((doc) => ({
      title: doc.label    ?? "",
      file:  doc.filename ?? "",
      url:   doc.url      ?? null,
      ext:   doc.ext      ?? "",
    })),
    verificationDocuments: (d.data?.verification_docs ?? []).map((doc) => ({
      title: doc.label    ?? "",
      file:  doc.filename ?? "",
      url:   doc.url      ?? null,
      ext:   doc.ext      ?? "",
    })),
  }

  return {
    res:         d.res,
    messg:       d.messg,
    pageTitle:   investor.name || "User Details",
    pageSubtitle:"Showing user information",
    tabs:        INVESTOR_DETAIL_TABS,
    actions:     INVESTOR_DETAIL_ACTIONS,
    investor,
  }
}
