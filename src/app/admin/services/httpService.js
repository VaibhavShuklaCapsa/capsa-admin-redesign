import axios from "axios"
import { getAccessToken } from "../utils"
import { encryptPayload, decryptSigninResponse } from "../utils/encryption"

// Signin / signup URLs return an encrypted response body — all other URLs return plain JSON.
const isAuthUrl = (url) => url.includes("signin/") || url.includes("signup/")

class HttpService {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  }

  #authHeader() {
    return { Authorization: "Bearer ".concat(getAccessToken()) }
  }

  // After every axios call: decrypt the response only for auth URLs.
  // Only runs if response.data is a string — on dev (encrypt=false) axios already
  // parses the JSON response into an object, so we leave it untouched.
  async #processResponse(axiosPromise, url) {
    const response = await axiosPromise
    if (isAuthUrl(url) && typeof response.data === "string") {
      response.data = decryptSigninResponse(response.data)
    }
    return response
  }

  postData = (payload, url) =>
    this.#processResponse(
      axios.post(this.baseUrl + url, encryptPayload(payload), {
        headers: this.#authHeader(),
      }),
      url
    )

  // FormData carries files — payload encryption is skipped (binary multipart can't be
  // AES-wrapped as a whole). Response decryption still runs for auth URLs.
  postFormData = (formData, url) =>
    this.#processResponse(
      axios.post(this.baseUrl + url, formData, {
        headers: {
          ...this.#authHeader(),
          "Content-Type": "multipart/form-data",
        },
      }),
      url
    )

  postDataNull = (payload, url) =>
    this.#processResponse(
      axios.post(this.baseUrl + url, payload, {
        headers: this.#authHeader(),
      }),
      url
    )

  postDataWithoutToken = (payload, url, headers) =>
    this.#processResponse(
      axios.post(
        this.baseUrl + url,
        encryptPayload(payload),
        headers ? { headers } : undefined
      ),
      url
    )

  getData = (url) =>
    this.#processResponse(
      axios.get(this.baseUrl + url, {
        headers: this.#authHeader(),
      }),
      url
    )

  getDataWithoutToken = (url) =>
    this.#processResponse(axios.get(this.baseUrl + url), url)

  getDataWithParam = (url, data) =>
    this.#processResponse(
      axios.get(this.baseUrl + url, data, {
        headers: this.#authHeader(),
      }),
      url
    )

  putData = (formData, url) =>
    this.#processResponse(
      axios.put(this.baseUrl + url, encryptPayload(formData), {
        headers: this.#authHeader(),
      }),
      url
    )

  putDataWithoutToken = (formData, url) =>
    this.#processResponse(
      axios.put(this.baseUrl + url, encryptPayload(formData)),
      url
    )

  deleteData = (url) =>
    this.#processResponse(
      axios.delete(this.baseUrl + url, {
        headers: this.#authHeader(),
      }),
      url
    )
}

export default HttpService
