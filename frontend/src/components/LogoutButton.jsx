import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LogoutButton() {
    const { logout } = useAuth();                         // logout clears cookie + user state
    const navigate = useNavigate();                       // used to redirect after logout

    // runs when the button is clicked
    const handleLogout = async () => {
        try {
            await logout();                               // clear cookie + reset user state
            navigate("/login");                           // go to login page
        } catch (error) {
            console.log("Logout error:", error.message);  // rare failure — log it
        }
    };

    return (
        <button onClick={handleLogout}>
            Logout
        </button>
    );
}

export default LogoutButton;