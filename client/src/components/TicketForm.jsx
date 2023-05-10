import React, { useState } from "react";
import useTickets from "../hooks/useTickets";

const TicketForm = () => {
  const [ticket, setTicket] = useState({
    title: "",
    price: "",
  });

  const { createTicket} = useTickets()

  const handleSubmit = (e) => {
    e.preventDefault();
    createTicket(ticket)
  };

  return (
    <div className="flex justify-center mt-20 items-center">
      <form method="POST"  className="shadow-lg p-8 rounded-sm sm:rounded-lg w-full max-w-[600px] bg-white  border-blue-200 h-auto">
        <div className="mb-5">
          <h1 className="text-center text-4xl font-bold text-blue-400">
            Ticket Form
          </h1>
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="p-2 w-full rounded-lg focus:outline-none shadow-lg shadow-blue-200 focus:shadow-blue-300 transition-shadow"
            placeholder="Title"
            name="title"
            value={ticket.title}
            onChange={(e) =>
              setTicket({ ...ticket, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="p-2 w-full rounded-lg focus:outline-none shadow-lg shadow-blue-200 focus:shadow-blue-300 transition-shadow"
            placeholder="Price"
            name="price"
            value={ticket.price}
            onChange={(e) =>
              setTicket({ ...ticket, [e.target.name]: e.target.value })
            }
          />
        </div>
        <div>
          <input
            type="submit"
            value="Create"
            className="bg-blue-400 text-2xl w-full text-white font-bold rounded-lg p-2 shadow-lg shadow-blue-300 hover:shadow-blue-400 transition-shadow hover:cursor-pointer"
            onClick={handleSubmit}
          />
        </div>
      </form>
    </div>
  );
};

export default TicketForm;
