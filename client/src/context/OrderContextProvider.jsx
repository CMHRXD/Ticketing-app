import { createContext, useState } from "react";
import { handleRequestErrors } from "../helpers/handleRequestErrors";
import AxiosClient from "../config/AxiosClient";
import { useNavigate } from "react-router-dom";

const OrderContext = createContext();
export const OrderContextProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState({});
  const navigate = useNavigate();

  const createOrder = async (ticketId) => {
    try {
      const { data } = await AxiosClient.post("/orders", { ticketId });
      setOrder(data);
      localStorage.setItem("order", JSON.stringify(data));
      swal("Success", "Order Created Successfully", "success");
      navigate("/app/order-detail");
    } catch (error) {
      const errorMessage = handleRequestErrors(error);
      swal(errorMessage.errorType, errorMessage.msg, "error");
    }
  };

  const payOrder = async (orderId, token) => {
    try {
      const { data } = await AxiosClient.post("/payments", { orderId, token });
      swal("Success", "Order Paid Successfully", "success");
      navigate("/app/orders-list");
      localStorage.removeItem("order");
    } catch (error) {
      const errorMessage = handleRequestErrors(error);
      swal(errorMessage.errorType, errorMessage.msg, "error");
    }
  };

  const getOrder = async (orderId) => {
    try {
      const { data } = await AxiosClient.get(`/orders/${orderId}`);
      setOrder(data);
      navigate(`/app/order-detail`);
    } catch (error) {
      const errorMessage = handleRequestErrors(error);
      swal(errorMessage.errorType, errorMessage.msg, "error");
    }
  };
  const getOrders = async () => {
    try {
      const { data } = await AxiosClient.get("/orders");
      console.log(data);
      setOrders(data);
    } catch (error) {
      const errorMessage = handleRequestErrors(error);
      swal(errorMessage.errorType, errorMessage.msg, "error");
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        order,
        createOrder,
        payOrder,
        setOrder,
        getOrders,
        getOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
