import { useNavigate } from "react-router-dom";
import api from "../services/api";

function LogoutButton() {

    const navigate = useNavigate();

    const handleLogout = async () => {

        try {

            const response = await api.post("/auth/logout");

            console.log("LOGOUT RESPONSE:", response.data);

            navigate("/login");

        } catch (error) {

            console.log("LOGOUT ERROR:", error.response?.data);
        }
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}

export default LogoutButton;