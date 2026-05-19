/**
 * This file is provided you as part of the interview kit.
 * Feel free to modify it as needed.
 * Do not remove this comment.
 */

import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./page/Login.tsx";
import { SharedComponents } from "./page/SharedComponents.tsx";
import Home from "./page/Home.tsx";
import Catalogue from "./page/Catalogue.tsx";
import ConfirmAppointment from "./page/ConfirmAppointment.tsx";
import { useAuth } from "../context/AuthContext.tsx";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/home" replace /> : <Login />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/home" replace /> : <Login />}
      />
      <Route
        path="/home"
        element={user ? <Home /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/catalogue"
        element={
          user?.role === "patient" ? (
            <Catalogue />
          ) : user ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/confirm-appointment"
        element={
          user?.role === "patient" ? (
            <ConfirmAppointment />
          ) : user ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/shared-components"
        element={user ? <SharedComponents /> : <Navigate to="/login" replace />}
      />
      <Route path="*" element={<Navigate to={user ? "/home" : "/login"} replace />} />
    </Routes>
  );
};

export default AppRoutes;
