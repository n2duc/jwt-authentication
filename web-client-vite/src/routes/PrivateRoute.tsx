import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROLE } from "../types";

const PrivateRoute = ({ children, roles }: {
  children: JSX.Element;
  roles: Array<ROLE>;
}) => {
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('userInfo') as string)

  const userHasRequiredRole = user && roles.includes(user.role) ? true : false;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }
  return <Outlet />;
}

export default PrivateRoute;