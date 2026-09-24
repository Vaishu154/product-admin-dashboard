export function getErrorMessage(error) {
  if (!error) {
    return "Something went wrong. Please try again.";
  }

  if (error.code === "ERR_CANCELED" || error.name === "CanceledError") {
    return "";
  }

  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return "The request timed out. Please try again.";
    }
    return "Network error. Check your internet connection and try again.";
  }

  const status = error.response.status;
  const apiMessage =
    error.response.data?.message || error.response.data?.error;

  if (status === 400) {
    return apiMessage || "Invalid request. Please check your input.";
  }

  if (status === 401) {
    return apiMessage || "Your session is invalid. Please log in again.";
  }

  if (status === 404) {
    return apiMessage || "The requested resource was not found.";
  }

  if (status >= 500) {
    return "The server is unavailable right now. Please try again later.";
  }

  return apiMessage || "Something went wrong. Please try again.";
}

export function isCanceledError(error) {
  return (
    error?.code === "ERR_CANCELED" ||
    error?.name === "CanceledError" ||
    error?.name === "AbortError"
  );
}
