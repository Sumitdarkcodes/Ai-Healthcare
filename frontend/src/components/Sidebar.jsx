import { NavLink } from "react-router-dom";

function Sidebar() {
    return (
        <aside className="sidebar">

            {/* logo section */}
            <div className="sidebarLogo">

                <div className="sidebarLogoIcon">
                    +                                        {/* plus icon */}
                </div>

                <div>
                    <h2>MediConnect</h2>
                    <span>AI Healthcare</span>               {/* tagline */}
                </div>

            </div>

            {/* navigation menu */}
            <nav className="sidebarNav">

                {/* dashboard link */}
                <NavLink to="/patient/dashboard" className="sidebarLink">
                    <span className="sidebarLinkIcon">⌂</span>     {/* home icon */}
                    <span>Dashboard</span>
                </NavLink>

                {/* doctors link */}
                <NavLink to="/patient/doctors" className="sidebarLink">
                    <span className="sidebarLinkIcon">⚕</span>     {/* medical icon */}
                    <span>Doctors</span>
                </NavLink>

                {/* appointments link */}
                <NavLink to="/patient/appointments" className="sidebarLink">
                    <span className="sidebarLinkIcon">📅</span>    {/* calendar icon */}
                    <span>Appointments</span>
                </NavLink>

                {/* medical records link */}
                <NavLink to="/patient/medical-records" className="sidebarLink">
                    <span className="sidebarLinkIcon">📋</span>    {/* clipboard icon */}
                    <span>Medical Records</span>
                </NavLink>

                {/* AI symptom checker link */}
                <NavLink to="/patient/symptom-checker" className="sidebarLink">
                    <span className="sidebarLinkIcon">🤖</span>    {/* robot icon */}
                    <span>AI Symptom Checker</span>
                </NavLink>

                {/* profile link */}
                <NavLink to="/patient/profile" className="sidebarLink">
                    <span className="sidebarLinkIcon">👤</span>    {/* person icon */}
                    <span>Profile</span>
                </NavLink>

            </nav>

            {/* bottom section - help */}
            <div className="sidebarBottom">

                <div className="sidebarHelp">
                    <div className="sidebarHelpIcon">
                        ?                                    {/* question mark */}
                    </div>

                    <div>
                        <strong>Need Help?</strong>
                        <p>Contact support</p>
                    </div>
                </div>

            </div>

        </aside>
    );
}

export default Sidebar;