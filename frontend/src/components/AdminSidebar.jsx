import { NavLink } from "react-router-dom";

function AdminSidebar() {
    return (
        <aside className="sidebar adminSidebar">

            {/* top logo part */}
            <div className="sidebarLogo">

                <div className="sidebarLogoIcon">
                    +                                        {/* small plus sign */}
                </div>

                <div>
                    <h2>MediConnect</h2>
                    <span>Admin Panel</span>                {/* shows this is admin side */}
                </div>

            </div>

            {/* menu links */}
            <nav className="sidebarNav">

                {/* goes to admin dashboard */}
                <NavLink to="/admin/dashboard" className="sidebarLink">
                    <span className="sidebarLinkIcon">⌂</span>     {/* home icon */}
                    <span>Dashboard</span>
                </NavLink>

                {/* goes to users page */}
                <NavLink to="/admin/users" className="sidebarLink">
                    <span className="sidebarLinkIcon">👥</span>    {/* people icon */}
                    <span>Users</span>
                </NavLink>

                {/* goes to appointments page */}
                <NavLink to="/admin/appointments" className="sidebarLink">
                    <span className="sidebarLinkIcon">📅</span>    {/* calendar icon */}
                    <span>Appointments</span>
                </NavLink>

                {/* goes to medical records page */}
                <NavLink to="/admin/medical-records" className="sidebarLink">
                    <span className="sidebarLinkIcon">📋</span>    {/* clipboard icon */}
                    <span>Medical Records</span>
                </NavLink>

            </nav>

            {/* bottom admin info box */}
            <div className="sidebarBottom">

                <div className="sidebarAdminInfo">

                    <div className="sidebarAdminAvatar">
                        A                                    {/* first letter of "Admin" */}
                    </div>

                    <div>
                        <strong>Administrator</strong>       {/* role title */}
                        <p>Admin Account</p>                 {/* small text below */}
                    </div>

                </div>

            </div>

        </aside>
    );
}

export default AdminSidebar;