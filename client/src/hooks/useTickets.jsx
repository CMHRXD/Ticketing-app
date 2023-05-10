import { useContext } from "react";
import TicketContext from "@/context/TicketContextProvider";


const useTickets = () => {
  return useContext(TicketContext)
}

export default useTickets;