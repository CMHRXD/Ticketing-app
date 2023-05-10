import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useUsers from "@/hooks/useUsers";

const PublicLayout = () => {
  const { user } = useUsers();

  if (user.id) return <Navigate to="/app/home" />;

  return (
    <div className="w-full h-full bg-[url(./assets/bubble-animated-background.svg)]">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
