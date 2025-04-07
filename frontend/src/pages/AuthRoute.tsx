import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store";

const AuthRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  if (isAuthenticated) {
    return <Navigate to={"/"} replace />;
  }
  return <Outlet />;
};

export default AuthRoute;
