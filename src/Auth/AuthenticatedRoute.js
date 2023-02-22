import { useAuth } from "./AuthProvider";
import { Route, Redirect } from "react-router-dom";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AuthenticatedRoute = ({ children }) => {
  const { authState } = useAuth();
  const { authenticated } = authState;
  
  if (!authenticated) {
    return <Navigate to="/login" />;
  }
  if (authenticated) {
    return <Outlet />;
  }

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  // return authenticated === 'true' ? <Outlet /> : <Navigate to="/login" />;
};

export default AuthenticatedRoute;
