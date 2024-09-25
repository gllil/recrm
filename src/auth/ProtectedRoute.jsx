import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthProvider";
import Navigation from "../components/Navigation";

const ProtectedRoute = () => {
  const { userLoggedIn } = useContext(AuthContext);
  return userLoggedIn ? (
    <Navigation>
      <Outlet />{" "}
    </Navigation>
  ) : (
    <Navigate to={"/"} />
  );
};
export default ProtectedRoute;
