import { NavLink } from "react-router-dom";

function Sidebar() {

    return (
        <aside className="sidebar">

            {/* Logo */}

            <div className="sidebarLogo">

                <div className="sidebarLogoIcon">
                    +
                </div>

                <div>
                    <h2>MediConnect</h2>
                    <span>AI Healthcare</span>
                </div>

            </div>


            {/* Menu */}

            <nav className="sidebarNav">

                <NavLink
                    to="/patient/dashboard"
                    className="sidebarLink"
                >
                    <span className="sidebarLinkIcon">⌂</span>
                    <span>Dashboard</span>
                </NavLink>


                <NavLink
                    to="/patient/doctors"
                    className="sidebarLink"
                >
                    <span className="sidebarLinkIcon">⚕</span>
                    <span>Doctors</span>
                </NavLink>


                <NavLink
                    to="/patient/appointments"
                    className="sidebarLink"
                >
                    <span className="sidebarLinkIcon">📅</span>
                    <span>Appointments</span>
                </NavLink>


                <NavLink
                    to="/patient/medical-records"
                    className="sidebarLink"
                >
                    <span className="sidebarLinkIcon">📋</span>
                    <span>Medical Records</span>
                </NavLink>


                <NavLink
                    to="/patient/symptom-checker"
                    className="sidebarLink"
                >
                    <span className="sidebarLinkIcon">🤖</span>
                    <span>AI Symptom Checker</span>
                </NavLink>


                <NavLink
                    to="/patient/profile"
                    className="sidebarLink"
                >
                    <span className="sidebarLinkIcon">👤</span>
                    <span>Profile</span>
                </NavLink>

            </nav>


            {/* Bottom */}

            <div className="sidebarBottom">

                <div className="sidebarHelp">

                    <div className="sidebarHelpIcon">
                        ?
                    </div>

                    <div>
                        <strong>
                            Need Help?
                        </strong>

                        <p>
                            Contact support
                        </p>
                    </div>

                </div>

            </div>

        </aside>
    );
}

export default Sidebar;