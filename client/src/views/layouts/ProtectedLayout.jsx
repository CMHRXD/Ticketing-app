import { Navigate, Outlet } from "react-router-dom";
import useUsers from "@/hooks/useUsers";
import Spinner from "../../components/Spinner";
import Nav from "../../components/Nav";

const ProtectedLayout = () => {
  const { isLoading, user } = useUsers();

  if (isLoading) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-200 h-screen">
      <Nav />
      <div className="">
        {user.id ? <Outlet />   : <Navigate to="/sign-in" />}
      </div>
    </div>
  );
};

export default ProtectedLayout;
