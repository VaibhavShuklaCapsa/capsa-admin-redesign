import { routes } from "./apiRoutes"
import HttpService from "./httpService"

// Calls /redesign/admin/dashboard/overview
// Payload: { from_date: "YYYY-MM-DD", to_date: "YYYY-MM-DD" }
// Returns the data object from response, or throws so the page keeps the loader
export const getDashboardOverview = async ({ from_date, to_date }) => {
  const apiRoute = routes.DashboardOverview()
  const http = new HttpService()
  const response = await http.postData({ from_date, to_date }, apiRoute)
  // response.data.data is the actual payload per the response shape
  return response.data.data
}

// Calls /redesign/admin/dashboard/transaction-volume-chart
// Payload: { from_date: "YYYY-MM-DD", to_date: "YYYY-MM-DD" }
// Returns the data object from response, or throws so the page keeps the loader
export const getDashboardChart = async ({ from_date, to_date }) => {
  const apiRoute = routes.DashboardChart()
  const http = new HttpService()
  const response = await http.postData({ from_date, to_date }, apiRoute)
  return response.data.data
}
