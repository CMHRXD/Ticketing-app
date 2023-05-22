import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedLayout from "./views/layouts/ProtectedLayout";

//Contexts
import { UsersContextProvider } from "./context/UsersContextProvider";

//Layouts
import PublicLayout from "./views/layouts/PublicLayout";
import Home from "./views/privateViews/Home";

//Public Routes
import ResetPassword from "./views/publicViews/ResetPassword";
import SignIn from "./views/publicViews/SignIn";
import SignOut from "./views/publicViews/SignOut";
import SignUp from "./views/publicViews/SignUp";
import Ticket from "./views/privateViews/Ticket";
import { TicketContextProvider } from "./context/TicketContextProvider";
import Order from "./views/privateViews/Orders";
import { OrderContextProvider } from "./context/OrderContextProvider";


function App() {
  return (
    <BrowserRouter>
      <UsersContextProvider>
        <TicketContextProvider>
          <OrderContextProvider>
            <Routes>
              <Route path="/" element={<PublicLayout />}>
                <Route index element={<SignUp />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-out" element={<SignOut />} />
                <Route path="/reset-password" element={<ResetPassword />} />
              </Route>

              <Route path="/app" element={<ProtectedLayout />}>
                <Route path="home" element={<Home />} />
                <Route path="ticket-form" element={<Ticket />} />
                <Route path="orders-list" element={<Order  view={"Table"} />} />
                <Route path="order-detail" element={<Order view={"Detail"} />}  />
              </Route>
            </Routes>
          </OrderContextProvider>
        </TicketContextProvider>
      </UsersContextProvider>
    </BrowserRouter>
  );
}

export default App;
