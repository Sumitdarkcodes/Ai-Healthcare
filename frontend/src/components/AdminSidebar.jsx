import { NavLink } from "react-router-dom";

function AdminSidebar() {

    return (
        <aside className="sidebar adminSidebar">

            {/* Logo */}

            <div className="sidebarLogo">

                <div className="sidebarLogoIcon">
                    +
                </div>

                <div>
                    <h2>MediConnect</h2>
                    <span>Admin Panel</span>
                </div>

            </div>


            {/* Menu */}

            <nav className="sidebarNav">

                <NavLink
                    to="/admin/dashboard"
                    className="sidebarLink"
                >
                    <span className="sidebarLinkIcon">⌂</span>
                    <span>Dashboard</span>
                </NavLink>


                <NavLink
                    to="/admin/users"
                    className="sidebarLink"
                >
                    <span className="sidebarLinkIcon">👥</span>
                    <span>Users</span>
                </NavLink>


                <NavLink
                    to="/admin/appointments"
                    className="sidebarLink"
                >
                    <span className="sidebarLinkIcon">📅</span>
                    <span>Appointments</span>
                </NavLink>


                <NavLink
                    to="/admin/medical-records"
                    className="sidebarLink"
                >
                    <span className="sidebarLinkIcon">📋</span>
                    <span>Medical Records</span>
                </NavLink>

            </nav>


            {/* Bottom */}

            <div className="sidebarBottom">

                <div className="sidebarAdminInfo">

                    <div className="sidebarAdminAvatar">
                        A
                    </div>

                    <div>
                        <strong>
                            Administrator
                        </strong>

                        <p>
                            Admin Account
                        </p>
                    </div>

                </div>

            </div>

        </aside>
    );
}

export default AdminSidebar;