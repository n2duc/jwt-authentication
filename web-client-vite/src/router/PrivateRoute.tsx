import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks";

const PrivateRoute = ({ children, roles }: { children: JSX.Element, roles: string }) => {
  const location = useLocation()

  const { isAuthenticated, user, status } = useAppSelector((state) => state.auth);

  if (status === 'idle' || status === 'pending') {
    return <p>Checking authenticaton..</p>
  }

  const userHasRequiredRole = user && roles.includes(user.role) ? true : false;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (isAuthenticated && !userHasRequiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

export default PrivateRoute;