export const handleRequestErrors = (error) => {
  if (error.response.status === 400) {
    const errors = error.response.data.errors;
    let errorString = "";
    errors.forEach((err) => {
      errorString += "-" + err.message + "\n";
    });
    return { errorType: "Bad Request", msg: errorString };
  } else if (error.response.status === 401) {
    return {
      errorType: "Unauthorized",
      msg: "You are not authorized to perform this action",
    };
  } else if (error.response.status === 404) {
    return { errorType: "Not Found", msg: "Resource Not Found" };
  } else {
    return { errorType: "Internal Server Error", msg: "Server Error" };
  }
};
