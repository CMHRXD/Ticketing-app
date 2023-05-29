import { useNavigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import useOrders from "../hooks/useOrders";

const OrderList = () => {
  const { orders, getOrders, getOrder } = useOrders();

  const handleDetail = async(id) => {
    await getOrder(id);
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className=" flex items-start mt-0 md:mt-20 justify-center w-full h-full">
      <div className="p-8 rounded-sm sm:rounded-lg w-full  h-screen sm:h-auto">
        <div className="flex flex-wrap items-center justify-center gap-5">
          {orders.length > 0 ? (
            orders.map((order) => {
              return (
                <div
                  className="flex-col p-5 shadow-lg shadow-blue-300  bg-white rounded-lg w-full md:w-[500px] bg-[url(./assets/ticket-bg-animation.svg)]"
                  key={order.id}
                >
                  <div className="">
                    <p className=" text-4xl font-bold text-gray-600">
                      {order.ticket.title}
                    </p>
                    <p className="text-lg font-bold text-gray-600">
                      Price: {order.ticket.price} $
                    </p>
                    <p className="text-lg font-bold text-gray-600">
                      Status:{" "}
                      <span className={order.statusStyle}>{order.status}</span>
                    </p>
                    <button
                      onClick={() => {handleDetail(order.id)}}
                      className="bg-blue-400 mt-5 text-xl w-full text-white font-bold rounded-lg p-2 shadow-lg shadow-blue-300 hover:shadow-blue-500 transition-shadow hover:cursor-pointer"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <h1 className="text-4xl text-gray-700 font-bold">
              You haven't ordered anything yet :(
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
