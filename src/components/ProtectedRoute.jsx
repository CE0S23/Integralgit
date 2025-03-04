import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";


function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) return <h1>Cargando...</h1>;

  if (!user) return <Navigate to="/login" />;

  return children;
}

export default ProtectedRoute;