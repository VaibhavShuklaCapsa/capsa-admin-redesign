import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getPushNotificationsData = async ({ page_number = 1, page_size = 10, search = "", from_date = "", to_date = "" } = {}) => {
  const apiRoute = routes.PushNotificationsList()
  const http = new HttpService()
  const response = await http.postData({ page_number, page_size, search, from_date, to_date }, apiRoute)
  return response.data  // { res, data: { user_list, pagination, filters }, messg }
}

export const sendPushNotification = async ({ email, title, body }) => {
  const apiRoute = routes.SendPushNotification()
  const http = new HttpService()
  const response = await http.postData({ email, title, body }, apiRoute)
  return response.data  // { res, data, messg }
}

export const sendBatchPushNotification = async ({ title, body, user_type = "all" }) => {
  const apiRoute = routes.SendBatchPushNotification()
  const http = new HttpService()
  const response = await http.postData({ title, body, user_type }, apiRoute)
  return response.data  // { res, data, messg }
}
