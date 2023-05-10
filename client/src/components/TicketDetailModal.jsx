import { useState } from "react";
import useOrders from "../hooks/useOrders";

const TicketDetailModal = ({ ticket }) => {
  const [openModal, setOpenModal] = useState(false);
  const { createOrder } = useOrders();
  const handleSubmit = async (e) => {
    e.preventDefault();
    await createOrder(ticket.id);
    console.log(ticket);
  };

  return (
    <>
      {openModal ? (
        <div
          className={`${
            openModal ? "" : "hidden"
          }  bg-black absolute bg-opacity-50 inset-0 flex justify-center items-center`}
        >
          <div className="bg-gray-200 flex  flex-col justify-center items-center p-10 rounded-lg gap-5">
            <div className="flex flex-row justify-center items-center gap-5">
              <h2 className="text-3xl font-extrabold text-blue-500">
                Ticket Detail
              </h2>
              <button
                className="text-red-500 hover:cursor-pointer font-bold text-lg px-2 m-2 shadow-md rounded-lg hover:bg-red-500 hover:text-white duration-300 border-red-500 border-2"
                onClick={() => setOpenModal(!openModal)}
              >
                X
              </button>
            </div>
            <div className="flex flex-col w-full items-start">
              <p className="text-xl font-extrabold text-gray-600">
                Title: <span className="text-lg font-bold">{ticket.title}</span>
              </p>
              <p className="text-xl font-extrabold  text-gray-600">
                Price: <span className="text-lg font-bold">{ticket.price}$</span>
              </p>
            </div>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-xl w-full text-white font-bold rounded-lg p-2 shadow-lg shadow-blue-300 hover:shadow-blue-500 transition-shadow hover:cursor-pointer"
            >
              Purchase
            </button>
          </div>
        </div>
      ) : (
        <p
          className="ml-7 text-white font-semibold hover:cursor-pointer"
          onClick={() => setOpenModal(true)}
        >
          Detail
        </p>
      )}
    </>
  );
};

export default TicketDetailModal;
