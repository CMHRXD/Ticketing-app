import { createContext, useState } from "react";
import AxiosClient from "../config/AxiosClient";
import swal from "sweetalert";
import { handleRequestErrors } from "../helpers/handleRequestErrors";
import { useNavigate } from "react-router-dom";

const TicketContext = createContext();
export const TicketContextProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const { data } = await AxiosClient.get("/tickets");
      setTickets(data.tickets);
      setIsLoading(false);
    } catch (error) {
      const errorMessage = handleRequestErrors(error);
      swal(errorMessage.errorType, errorMessage.msg, "error");
    }
  };

  const createTicket = async (ticket) => {
    
    try {
      const res = await AxiosClient.post("/tickets", ticket);
      if (res.status === 201) {
        swal("Success","Ticket Created Successfully", "success");
        setTickets([...tickets, res.data]);
        navigate("/app/home");
      }

    } catch (error) {
      const errorMessage = handleRequestErrors(error);
      swal(errorMessage.errorType, errorMessage.msg, "error");
    }
  };

  return (
    <TicketContext.Provider value={{ tickets, isLoading, createTicket, fetchTickets }}>
      {children}
    </TicketContext.Provider>
  );
};

export default TicketContext;
