// import { logOut } from "../services/auth"

import { logOut } from "../services/auth"

export const ErrorHandler = (error, useMessage = false) => {
  if (!error) return
  let message = ""
  let defaultMessage = "Something went wrong, try again please."
  if (error?.response) {
    if (error?.response?.status >= 500 && error?.response?.status < 600) {
      message = defaultMessage
    }
    if (error.response.status === 401) {
      //log user out
      // logOut()
    } else {
      message = error?.response?.data?.errors
        ? Object.values(error?.response?.data?.errors)?.[0]?.[0]
        : error?.response?.data?.validationMessages?.[0] ||
          error?.response?.data?.userMessage ||
          error?.response?.data?.message ||
          error?.response?.data.Message ||
          error?.response?.data.error ||
          error?.response?.data.title ||
          error?.response?.result?.message ||
          error?.response?.result?.error ||
          defaultMessage
      if (useMessage) {
        message = error.response.data.message || error.response.data.Message
      }
    }
  } else if (error?.request) {
    message = error?.message
  } else {
    message = error?.message
  }
  return message
}

export const handleErrorWithReason = (error) => {
  if (!error) return
  let message
  let defaultMessage = "Something went wrong, try again please."
  if (error?.response) {
    if (error?.response?.status === 403)
      message = "You do not have the required permission"
    else if (error?.response?.status >= 500 && error?.response?.status < 600) {
      message = defaultMessage
    } else {
      let Errormessage =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data?.Message ||
        error?.response?.data?.title ||
        defaultMessage
      let Reasons = error?.response?.data?.validationMessages || []
      let ReasonForError = ""
      if (Reasons?.length > 0) {
        ReasonForError = `\n Reasons :  ${Reasons.join(", ")} `
      }
      message = `${Errormessage} ${ReasonForError}`
    }
  } else if (error?.request) {
    message = error?.message
  } else {
    message = error?.message
  }
  return message
}

export const newErrorhandler = (error, useMessage = false) => {
  if (!error) return
  const { response, message } = error
  let defaultMessage = "Something went wrong, try again please."

  if (!useMessage) return defaultMessage

  if (!response) return message

  if (response?.status >= 500 && response?.status < 600) {
    return defaultMessage
  }
  if (response?.status === 401) {
    //log user out
    logOut(true)
  }

  return response?.data?.message || response?.data?.error
}
