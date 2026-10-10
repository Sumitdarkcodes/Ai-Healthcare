import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();                 // get user + loading from context

    // wait until AuthProvider finishes checking the cookie
    if (loading) {
        return <p>Checking authentication...</p>;
    }

    // not logged in → send to login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // logged in but wrong role → send to home page
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // everything OK → render the protected page
    return children;
}

export default ProtectedRoute;