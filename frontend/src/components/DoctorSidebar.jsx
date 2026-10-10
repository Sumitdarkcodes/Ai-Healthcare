import { NavLink } from "react-router-dom";

function DoctorSidebar() {
    return (
        <aside className="sidebar">

            {/* top logo part */}
            <div className="sidebarLogo">

                <div className="sidebarLogoIcon">
                    +                                        {/* small plus sign */}
                </div>

                <div>
                    <h2>MediConnect</h2>
                    <span>Doctor Portal</span>               {/* shows this is doctor side */}
                </div>

            </div>

            {/* menu links */}
            <nav className="sidebarNav">

                {/* goes to doctor dashboard */}
                <NavLink to="/doctor/dashboard" className="sidebarLink">
                    <span className="sidebarLinkIcon">⌂</span>     {/* home icon */}
                    <span>Dashboard</span>
                </NavLink>

                {/* goes to appointments page */}
                <NavLink to="/doctor/appointments" className="sidebarLink">
                    <span className="sidebarLinkIcon">📅</span>    {/* calendar icon */}
                    <span>Appointments</span>
                </NavLink>

                {/* goes to availability page */}
                <NavLink to="/doctor/availability" className="sidebarLink">
                    <span className="sidebarLinkIcon">🕐</span>    {/* clock icon */}
                    <span>Availability</span>
                </NavLink>

                {/* goes to medical records page */}
                <NavLink to="/doctor/medical-records" className="sidebarLink">
                    <span className="sidebarLinkIcon">📋</span>    {/* clipboard icon */}
                    <span>Medical Records</span>
                </NavLink>

                {/* goes to profile page */}
                <NavLink to="/doctor/profile" className="sidebarLink">
                    <span className="sidebarLinkIcon">👤</span>    {/* person icon */}
                    <span>Profile</span>
                </NavLink>

            </nav>

            {/* bottom help box */}
            <div className="sidebarBottom">

                <div className="sidebarHelp">
                    <div className="sidebarHelpIcon">
                        ?                                    {/* question mark */}
                    </div>

                    <div>
                        <strong>Need Help?</strong>
                        <p>Contact support</p>               {/* small text below */}
                    </div>
                </div>

            </div>

        </aside>
    );
}

export default DoctorSidebar;