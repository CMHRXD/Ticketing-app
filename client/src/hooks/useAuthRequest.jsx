import { useState } from "react";
import AxiosClient from "@/config/AxiosClient";

const useAuthRequest = ({ url, method, body, onSuccess }) => {
  const [emailError, setEmailError] = useState(null);
  const [passError, setPassError] = useState(null);
  const [reqError, setReqError] = useState(null);

  const authRequest = async () => {
    try {
      const response = await AxiosClient[method](url, body);
      if (onSuccess) {
        onSuccess();
      }
      return response.data;
    } catch (error) {
      const errorData = error.response?.data.errors;
      if (!errorData) {
        setReqError("Error: Server Unavailable");
      }
      setReqError(errorData[0].field ? null : errorData[0].message);
      setEmailError(
        errorData[0].field == "email" ? errorData[0].message : null
      );
      setPassError(
        errorData.length > 1
          ? errorData[1].field == "password"
            ? errorData[1].message
            : null
          : errorData[0].field == "password"
          ? errorData[0].message
          : null
      );
    }
  };

  return {
    authRequest,
    emailError,
    setEmailError,
    passError,
    setPassError,
    reqError,
  };
};

export default useAuthRequest;
