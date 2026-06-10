import axios from "axios";
import { getAccessToken } from "../utils";

class HttpService {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  }

  postData = async (payload, url) => {
    const AuthStr = "Bearer ".concat(getAccessToken());
    return axios.post(this.baseUrl + url, payload, {
      headers: {
        Authorization: AuthStr,
      },
    });
  };

  postFormData = async (formData, url) => {
    const AuthStr = "Bearer ".concat(getAccessToken());
    return axios.post(this.baseUrl + url, formData, {
      headers: {
        Authorization: AuthStr,
        'Content-Type': 'multipart/form-data',
      },
    });
  };

  postDataNull = async (
    payload,
    url,
  ) => {
    const AuthStr = "Bearer ".concat(getAccessToken());
    return axios.post(this.baseUrl + url, payload, {
      headers: {
        Authorization: AuthStr,
      },

    });
  };

  postDataWithoutToken = async (payload, url, headers) => {
    return axios.post(
      this.baseUrl + url,
      payload,
      headers && {
        headers,
      }
    );
  };

  getData = async (
    url,
  ) => {
    const AuthStr = "Bearer ".concat(getAccessToken());
    return axios.get(this.baseUrl + url, {
      headers: {
        Authorization: AuthStr,
      },
    });
  };

  getDataWithoutToken = async (url) => {
    return axios.get(this.baseUrl + url);
  };

  getDataWithParam = async (
    url,
    data,
  ) => {
    const AuthStr = "Bearer ".concat(getAccessToken());
    return axios.get(this.baseUrl + url, data, {
      headers: {
        Authorization: AuthStr,
      },
    });
  };

  putData = async (formData, url) => {
    const AuthStr = "Bearer ".concat(getAccessToken());
    return axios.put(this.baseUrl + url, formData, {
      headers: {
        Authorization: AuthStr,
      },
    });
  };

  putDataWithoutToken = async (formData, url) => {
    return axios.put(this.baseUrl + url, formData);
  };

  deleteData = async (url) => {
    const AuthStr = "Bearer ".concat(getAccessToken());
    return axios.delete(this.baseUrl + url, {
      headers: {
        Authorization: AuthStr,
      },
    });
  };
}
export default HttpService;
