import React, { useEffect, useState } from "react";
import useOrders from "../hooks/useOrders";
import { StatusStyles } from "./OrderStatusStyles/StatusStyles";
import useUsers from "../hooks/useUsers";
import StripeCheckout from "react-stripe-checkout";

const OrderDetail = () => {
  const { order, setOrder, payOrder } = useOrders();
  const { user } = useUsers();

  const [timeLeft, setTimeLeft] = useState(0);
  const startInterval = () => {
    let interval = true;
    const id = setInterval(function () {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));

      if (msLeft < 0) {
        interval = !interval;
        if (interval == false) {
          clearInterval(id);
        } else startInterval(id);
      }
    }, 1000);
  };

  useEffect(() => {
    if (!order) {
      const localOrder = JSON.parse(localStorage.getItem("order"));
      if (localOrder) {
        setOrder(localOrder);
      } else {
        navigate("/app/orders-list");
      }
    }
    startInterval();
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col gap-2 items-start justify-center mt-20 md:mt-56 max-w-[700px] p-10 shadow-lg shadow-slate-300 bg-white rounded-lg">
        <h1 className="text-4xl text-blue-400 font-bold border-b-2 border-blue-400 mb-5">
          Order Detail
        </h1>
        <p className="text-3xl font-bold text-gray-600">
          <span>{order.ticket.title}</span>
        </p>
        <p className="text-lg font-bold text-gray-600">
          Price: <span>{order.ticket.price}</span>
        </p>
        <p className="text-lg font-bold text-gray-600">
          Status:{" "}
          <span className={StatusStyles[order.status]}>{order.status}</span>
        </p>
        {order.status !== "complete" ? (
          <p className="text-lg font-bold text-gray-600">
            Expires At:{" "}
            {timeLeft > 0 ? (
              <span>{timeLeft} Seconds Until the order expires</span>
            ) : (
              <span className="text-red-600">The order has expired</span>
            )}
          </p>
        ) : null}
        <div className="flex w-full justify-center mt-5">
          {order.status !== "complete" ? (
            <StripeCheckout
              token={(token) => payOrder(order.id, token.id)}
              stripeKey={process.env.STRIPE_TEST}
              amount={order.ticket.price * 100}
              email={user.email}
            >
              <button className="bg-blue-400 text-2xl min-w-[300px] text-white font-bold rounded-lg p-2 shadow-lg shadow-blue-300 hover:shadow-blue-400 transition-shadow">
                Pay order
              </button>
            </StripeCheckout>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
