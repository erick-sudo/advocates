import { baseUrl } from "./apis";

export const apiCalls = {
  getRequest: ({
    endpoint = baseUrl,
    httpMethod = "GET",
    httpHeaders = {},
    successCallback = (res) => {},
    errorCallback = (res) => {},
  }) => {
    fetch(endpoint, {
      method: httpMethod,
      headers: httpHeaders,
    })
      .then((response) => {
        if (response.status < 400) {
          response.json().then((responseData) => {
            successCallback(responseData);
          });
        } else {
          response.json().then((responseData) => {
            errorCallback(responseData);
          });
        }
      })
      .catch((error) => {
        errorCallback(error);
      });
  },
  postRequest: ({
    endpoint = baseUrl,
    httpMethod = "POST",
    httpHeaders = {},
    httpBody = {},
    successCallback = (res) => {},
    errorCallback = (res) => {},
  }) => {
    fetch(endpoint, {
      method: httpMethod,
      headers: httpHeaders,
      body: JSON.stringify(httpBody),
    })
      .then((response) => {
        if (response.status < 400) {
          response.json().then((responseData) => {
            successCallback(responseData);
          });
        } else {
          response.json().then((responseData) => {
            errorCallback(responseData);
          });
        }
      })
      .catch((error) => {
        errorCallback(error);
      });
  },
  deleteRequest: ({
    endpoint = baseUrl,
    httpMethod = "DELETE",
    httpBody,
    httpHeaders = {},
    successCallback = (res) => {},
    errorCallback = (res) => {},
  }) => {
    const reqConfig = {
      method: httpMethod,
      headers: httpHeaders,
    };

    if (typeof httpBody === "object") {
      reqConfig.body = JSON.stringify(httpBody);
    }

    fetch(endpoint, reqConfig)
      .then((response) => {
        if (response.status < 400) {
          successCallback("Successfully Deleted");
        } else {
          response.json().then((responseData) => {
            errorCallback(responseData);
          });
        }
      })
      .catch((error) => {
        errorCallback(error);
      });
  },
};
