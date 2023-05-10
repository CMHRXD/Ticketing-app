import React from "react";
import TicketForm from "@/components/TicketForm";


const Ticket = ({view}) => {
  return (
    <div className="flex flex-col gap-4 mt-20 md:mt-40 min-w-[250px] md:min-w-[600px]">
      {<TicketForm />}
    </div>
  );
};

export default Ticket;
