import { Link } from "react-router-dom";

function DoctorSidebar() {
    return (
        <aside>
            <h3>Doctor Menu</h3>

            <Link to="/doctor/dashboard">Dashboard</Link>
            <br />

            <Link to="/doctor/appointments">Appointments</Link>
            <br />

            <Link to="/doctor/availability">Availability</Link>
            <br />

            <Link to="/doctor/medical-records">Medical Records</Link>
            <br />

            <Link to="/doctor/profile">Profile</Link>
        </aside>
    );
}

export default DoctorSidebar;