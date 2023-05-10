import { useEffect } from "react";
import { createContext, useState } from "react";
import AxiosClient from "../config/AxiosClient";

const UserContext = createContext();
export const UsersContextProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    currentUser();
  }, []);

  const currentUser = async () => {
    try {
      const { data } = await AxiosClient.get("/users/current-user");
      setUser(data.currentUser);
    } catch (error) {
        console.log(error);
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
