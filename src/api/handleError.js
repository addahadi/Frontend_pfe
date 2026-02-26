export const handleApiError = (error) => {
  if (!error.response) {
    return "Network error. Please check your connection.";
  }

  const status = error.response.status;

  switch (status) {
    case 400:
      return "Bad request.";
    case 401:
      return "Unauthorized. Please login again.";
    case 403:
      return "Access forbidden.";
    case 404:
      return "Resource not found.";
    case 500:
      return "Server error. Try again later.";
    default:
      return "Something went wrong.";
  }
};