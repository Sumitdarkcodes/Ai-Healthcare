import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";

function ProtectedRoute({ children, allowedRoles }) {

    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {

        const checkAuth = async () => {

            try {

                const response = await api.get("/auth/profile");

                setUser(response.data.user);

            } catch (error) {

                console.log("AUTH CHECK ERROR:", error.response?.data);

                setUser(null);

            } finally {

                setLoading(false);

            }
        };

        checkAuth();

    }, []);

    if (loading) {
        return <p>Checking authentication...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;