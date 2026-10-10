import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
    const { user, logout } = useAuth();                     // get user + logout from context
    const navigate = useNavigate();

    // logout then go to login page
    const handleLogout = async () => {
        try {
            await logout();
            navigate("/login");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <header>
            <Link to="/" className="brand">
                AI <span>Healthcare</span>
            </Link>

            <nav>
                <Link to="/">Home</Link>

                {/* show only when NOT logged in */}
                {!user && (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

                {/* patient links */}
                {user && user.role === "patient" && (
                    <>
                        <Link to="/patient/dashboard">Dashboard</Link>
                        <Link to="/patient/doctors">Doctors</Link>
                        <Link to="/patient/appointments">My Appointments</Link>
                        <Link to="/patient/symptom-checker">Symptom Check</Link>
                    </>
                )}

                {/* doctor links */}
                {user && user.role === "doctor" && (
                    <>
                        <Link to="/doctor/dashboard">Dashboard</Link>
                        <Link to="/doctor/appointments">Appointments</Link>
                        <Link to="/doctor/availability">Availability</Link>
                        <Link to="/doctor/profile">Profile</Link>
                    </>
                )}

                {/* admin links */}
                {user && user.role === "admin" && (
                    <>
                        <Link to="/admin/dashboard">Dashboard</Link>
                        <Link to="/admin/users">Users</Link>
                        <Link to="/admin/appointments">Appointments</Link>
                    </>
                )}

                {/* greeting + logout when logged in */}
                {user && (
                    <>
                        <span>Hi, {user.name}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            </nav>
        </header>
    );
}

export default Navbar;