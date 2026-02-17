import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  route?: string;
  login?: boolean;
}

export default function ProtectedRoute({ children, route, login=true }: ProtectedRouteProps) {
  const token = useAuth();  
  if (login !== !!token.profile ) {
    return <Navigate to={route || "/"} replace />;
  }
  return <>{children}</>;
}
