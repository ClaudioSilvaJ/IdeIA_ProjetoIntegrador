import { WhenDevelopment } from "./WhenDevelopment";

const isHttps = window.location.origin.startsWith("https");
const apiUrl = WhenDevelopment.use(
  `${window.location.origin.replace("5173", isHttps ? "4444" : "8000")}`,
  `${window.location.origin}`
);

WhenDevelopment.run(() => {
  if (isHttps) {
    process.env.NODE_TLS_REJECT_ANAUTHORIZED = "0";
    console.log(
      "Https Agent: Reject Unauthorized is disabled in development mode"
    );
  }
});

class _NetworkService {
  _isOffline = false;

  createWebSocket(path) {
    const isHttps = window.location.origin.startsWith("https");
    const wsProtocol = isHttps ? "wss" : "ws";
    const wsUrl = `${wsProtocol}://${apiUrl.replace(/^https?:\/\//, "")}/${path}`;
    return new WebSocket(wsUrl);
  }

  async request({
    alias,
    url,
    method,
    data,
    params,
    headers,
    responseType = "application/json",
    contentType = "application/json",
    ignoreUnauthorizedError = false,
  }) {
    const requestHeaders = {
      Accept: responseType,
      ...headers,
    };

    if (contentType === "multipart/form-data") {
      delete requestHeaders['Content-Type'];
    } else {
      requestHeaders['Content-Type'] = contentType;
    }

    let urlCompleted;
    if(params){
      params = new URLSearchParams(params).toString();
      urlCompleted = `${apiUrl}/${url}?${params}`
    } else {
      urlCompleted = `${apiUrl}/${url}`
    }

    try {
      const response = await fetch(urlCompleted, {
        method,
        body: contentType === "application/json" ? JSON.stringify(data) : data,
        headers: requestHeaders,
        credentials: "include",
      });

      if (!response.ok) {
        const error = new Error("Request failed: " + response.status);
        error.response = response;
        throw error;
      }

      if(responseType === "application/json"){
        let responseData;
        const responseBody = await response.text();
        try {
          responseData = JSON.parse(responseBody);
        } catch (jsonError) {
          responseData = responseBody;
        }

        this._isOffline = false;
        return responseData;
      } else {
        return response;
      }
    } catch (reason) {
      if (reason?.response?.status === 502) {
        this._isOffline = true;
      }

      console.log("Request failed", reason.response);

      throw reason;
    }
  }

  async requestMock({
    alias,
    url,
    method,
    data,
    params,
    headers,
    onUploadProgress,
  }) {
    return await new Promise((resolve) => {
      setTimeout(() => {
        resolve(response);
      }, 5000);
    });
  }

  isOffiline() {
    return this._isOffline;
  }

  async requestDownload({ url: fileUrl}) {
    try {
      const response = await fetch(`${apiUrl}/${fileUrl}`, {
        method: "GET",
        responseType: "text/csv",
      });

      if (!response.ok) {
        throw new Error("Failed to download file.");
      }

      const disposition = response.headers.get('content-disposition');
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      const filename = matches && matches[1] ? matches[1].replace(/['"]/g, '') : 'unknown.csv';

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Failed to download file:", error);
      throw error;
    }
  }

}

export const NetworkService = new _NetworkService();