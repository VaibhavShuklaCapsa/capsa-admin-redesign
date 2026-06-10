import Storage from "./storageUtil"
// import jwt from 'jsonwebtoken'
import CryptoJS from 'crypto-js'
import { jwtDecode } from "jwt-decode";

export const decodeToken = (token, secretKey = 'EMAIL_OF_USER') => {
    try {
        // Step 1: Verify and decode JWT
        const decoded = jwtDecode(token);

        // Step 2: Decrypt the AES data
        const bytes = CryptoJS.AES.decrypt(decoded.encdata, secretKey);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        return decryptedData;

    } catch (err) {
        console.error("Token decode error:", err.message);
        return null;
    }
};

export const getAccessToken = () => {
  try {
    const accessToken = Storage.getObject(
      "auth"
    )?.token
    return accessToken
  } catch (err) {
    return null
  }
}

export const getAccessTokenData = () => {
  try {
    const accessToken = Storage.getObject(
      "auth"
    )?.data
    return accessToken
  } catch (err) {
    return null
  }
}

export const isAnEmptyObject = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false
  }
  return true
}

export const isNotEmptyObject = (obj) => {
  if (!obj) return false
  return Object.keys(obj)?.some((key) => Boolean(key))
}

export const isEmpty = (value) => {
  if (value == null) return true // Covers undefined and null
  if (typeof value === "string" && value.trim() === "") return true // Empty string
  if (Array.isArray(value) && value.length === 0) return true // Empty array
  if (typeof value === "object" && Object.keys(value).length === 0) return true // Empty object
  return false // Non-empty value
}

export const stringifyData = (obj) => {
  if (!obj) return ""

  return JSON.stringify(obj)
}

export const parseData = (str) => {
  if (!str) return {}

  return JSON.parse(str)
}

export const textEllipsis = (str, count = 7) => {
  const longStr = str?.length > count
  const newStr = longStr ? `${str?.slice(0, count)}...` : str

  return newStr
}

export const networksItemObj = (item) => {
  if (!item) {
    return { name: "", img: "" }
  }

  const nameOnly = item?.toLowerCase()?.split("data")?.[0]

  switch (nameOnly) {
    case "airtel":
    case "airtel ":
      return {
        name: "Airtel",
        img: "/assets/img/AIRTEL.png",
      }
    case "mtn":
    case "mtn ":
      return {
        name: "MTN",
        img: "/assets/img/MTN.png",
      }
    case "9mobile":
    case "9mobile ":
      return {
        name: "9mobile",
        img: "/assets/img/9mobile.svg",
      }
    case "glo":
    case "glo ":
      return {
        name: "GLO",
        img: "/assets/img/GLO.png",
      }
    default:
      return { name: "", img: "" }
  }
}

export const arrayRange = (start, stop, step) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (value, index) => start + index * step
  )

export const GetTotalPages = (totalCount, pageSize) => {
  totalCount = String(totalCount).replace(/,/g, "")
  return Math.ceil(Number(totalCount) / Number(pageSize))
}

export const isIOS = () => {
  if (navigator?.userAgentData?.platform && navigator?.userAgent) {
    return (
      [
        "iPad Simulator",
        "iPhone Simulator",
        "iPod Simulator",
        "iPad",
        "iPhone",
        "iPod",
      ].includes(navigator.userAgentData.platform) ||
      (navigator.userAgent.includes("Mac") && "ontouchend" in document)
    )
  } else {
    return true
  }
}

// export const messageHandler = (msg) => {
//   console.log("messageHandler func out", msg)

//   if (typeof window !== "undefined" && msg) {
//     console.log("messageHandler func in", msg)
//     window.parent.postMessage(
//       `${msg} from parent`,
//       // "https://asp-vulteretail-prod-southuk-01-qa.azurewebsites.net/"
//       "*"
//     )
//     window.top.postMessage(`${msg} from top`, "*")
//   }
// }
