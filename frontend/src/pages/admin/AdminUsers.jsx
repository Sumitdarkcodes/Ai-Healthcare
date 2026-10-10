import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function AdminUsers() {
    const [users, setUsers] = useState([]);               // full list from backend
    const [loading, setLoading] = useState(true);         // shows loading state
    const [error, setError] = useState("");               // shows error on page
    const [search, setSearch] = useState("");             // search box value
    const [roleFilter, setRoleFilter] = useState("all");  // "all", "patient", "doctor", "admin"

    // runs once when the page loads
    useEffect(() => {
        // fetch all users from backend
        const fetchUsers = async () => {
            try {
                const response = await api.get("/admin/users");
                setUsers(response.data.users || []);      // save list
            } catch (error) {
                setError(
                    error.response?.data?.message || "Failed to fetch users"    // fallback
                );
            } finally {
                setLoading(false);                        // done either way
            }
        };

        fetchUsers();
    }, []);

    // filter users by search text + role
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());

        const matchesRole =
            roleFilter === "all" || user.role === roleFilter;

        return matchesSearch && matchesRole;              // both must be true
    });

    return (
        <div>
            <AdminSidebar />                              {/* left menu for admins */}

            <main>

                {/* page title + logout button */}
                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">ADMIN PORTAL</p>
                        <h1>Manage Users</h1>
                        <p>View all users in the healthcare system.</p>
                    </div>

                    <LogoutButton />
                </div>

                <section className="dashboardSection">

                    {/* header with count */}
                    <div className="recordsHeader">
                        <div>
                            <h2>All Users</h2>
                            <p>Total users in the system: {users.length}</p>
                        </div>
                    </div>

                    {/* show error if fetch failed */}
                    {error && <p className="error">{error}</p>}

                    {/* search + role filter controls */}
                    <div className="adminFilters">
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}    // update search
                        />

                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}   // update role
                        >
                            <option value="all">All Roles</option>
                            <option value="patient">Patients</option>
                            <option value="doctor">Doctors</option>
                            <option value="admin">Admins</option>
                        </select>
                    </div>

                    {loading ? (
                        // loading state
                        <p>Loading users...</p>
                    ) : filteredUsers.length === 0 ? (
                        // empty state (no users or no matches)
                        <p>No users found.</p>
                    ) : (
                        <table className="adminTable">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <span className={`roleBadge ${user.role}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td>
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString()
                                                : "N/A"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>
        </div>
    );
}

export default AdminUsers;