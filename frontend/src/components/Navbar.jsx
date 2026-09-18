
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <header>
            <Link to="/" className="brand">
                AI <span>Healthcare</span>
            </Link>

            <nav>
                <Link to="/">Home</Link>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
                <Link to="/patient/dashboard">Patient</Link>
                <Link to="/doctor/dashboard">Doctor</Link>
                <Link to="/admin/dashboard">Admin</Link>
            </nav>
        </header>
    );
}

export default Navbar;

