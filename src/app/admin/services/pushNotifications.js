import { routes } from "./apiRoutes"
import HttpService from "./httpService"

export const getPushNotificationsData = async (data) => {
  const apiRoute = routes.PushNotificationsList()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { ...data, apiRoute }
  }
}

export const sendPushNotification = async (data) => {
  const apiRoute = routes.SendPushNotification()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { success: false, apiRoute }
  }
}

export const sendBatchPushNotification = async (data) => {
  const apiRoute = routes.SendBatchPushNotification()
  try {
    const http = new HttpService()
    const response = await http.postData(data, apiRoute)
    return response?.data ?? data
  } catch {
    return { success: false, apiRoute }
  }
}
