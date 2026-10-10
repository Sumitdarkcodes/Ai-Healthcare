import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function AdminDashboard() {
    // numbers shown on the stat cards
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        medicalRecords: 0
    });

    const [loading, setLoading] = useState(true);         // shows loading text
    const [error, setError] = useState("");               // shows error on page

    // runs once when the page loads
    useEffect(() => {
        // fetch users, appointments, records in one go
        const loadDashboardData = async () => {
            try {
                setLoading(true);

                const usersResponse = await api.get("/admin/users");                     // all users
                const appointmentsResponse = await api.get("/admin/appointments");       // all appointments
                const medicalRecordsResponse = await api.get("/admin/medical-records");  // all records

                const users = usersResponse.data.users || [];
                const appointments = appointmentsResponse.data.appointments || [];
                const medicalRecords = medicalRecordsResponse.data.medicalRecords || [];

                // count how many doctors
                const totalDoctors = users.filter(
                    (user) => user.role === "doctor"
                ).length;

                // count how many patients
                const totalPatients = users.filter(
                    (user) => user.role === "patient"
                ).length;

                // count how many are still pending
                const pendingAppointments = appointments.filter(
                    (appointment) => appointment.status === "PENDING"
                ).length;

                setStats({
                    totalUsers: users.length,
                    totalDoctors: totalDoctors,
                    totalPatients: totalPatients,
                    totalAppointments: appointments.length,
                    pendingAppointments: pendingAppointments,
                    medicalRecords: medicalRecords.length
                });
            } catch (error) {
                setError(
                    error.response?.data?.message || "Failed to load dashboard data"    // fallback
                );
            } finally {
                setLoading(false);                            // done either way
            }
        };

        loadDashboardData();
    }, []);

    return (
        <div>
            <AdminSidebar />                                  {/* left menu for admins */}

            <main>

                {/* page title + logout button */}
                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">ADMIN PORTAL</p>
                        <h1>Admin Dashboard</h1>
                        <p>Welcome to AI Healthcare Admin Panel</p>
                    </div>

                    <LogoutButton />
                </div>

                <section className="dashboardSection">
                    <h2>Overview</h2>

                    {/* error message (if any) */}
                    {error && <p className="error">{error}</p>}

                    {loading ? (
                        // loading state
                        <div className="adminDashboardLoading">
                            <p>Loading dashboard data...</p>
                        </div>
                    ) : (
                        <div className="adminDashboardStats">

                            {/* total users card */}
                            <div className="adminStatCard">
                                <div className="adminStatIcon">👥</div>          {/* people icon */}
                                <div className="adminStatContent">
                                    <h3>Total Users</h3>
                                    <p>{stats.totalUsers}</p>
                                </div>
                            </div>

                            {/* total doctors card */}
                            <div className="adminStatCard">
                                <div className="adminStatIcon">🩺</div>          {/* stethoscope icon */}
                                <div className="adminStatContent">
                                    <h3>Total Doctors</h3>
                                    <p>{stats.totalDoctors}</p>
                                </div>
                            </div>

                            {/* total patients card */}
                            <div className="adminStatCard">
                                <div className="adminStatIcon">👤</div>          {/* person icon */}
                                <div className="adminStatContent">
                                    <h3>Total Patients</h3>
                                    <p>{stats.totalPatients}</p>
                                </div>
                            </div>

                            {/* total appointments card */}
                            <div className="adminStatCard">
                                <div className="adminStatIcon">📅</div>          {/* calendar icon */}
                                <div className="adminStatContent">
                                    <h3>Total Appointments</h3>
                                    <p>{stats.totalAppointments}</p>
                                </div>
                            </div>

                            {/* pending appointments card */}
                            <div className="adminStatCard">
                                <div className="adminStatIcon">⏳</div>          {/* hourglass icon */}
                                <div className="adminStatContent">
                                    <h3>Pending Appointments</h3>
                                    <p>{stats.pendingAppointments}</p>
                                </div>
                            </div>

                            {/* medical records card */}
                            <div className="adminStatCard">
                                <div className="adminStatIcon">📋</div>          {/* clipboard icon */}
                                <div className="adminStatContent">
                                    <h3>Medical Records</h3>
                                    <p>{stats.medicalRecords}</p>
                                </div>
                            </div>

                        </div>
                    )}
                </section>

                <section className="dashboardSection">
                    <h2>Admin Features</h2>

                    <div className="adminFeatureGrid">

                        {/* manage users feature card */}
                        <div className="adminFeatureCard">
                            <span className="adminFeatureIcon">👥</span>          {/* people icon */}
                            <div>
                                <h3>Manage Users</h3>
                                <p>View all registered users in the system.</p>
                            </div>
                        </div>

                        {/* manage doctors feature card */}
                        <div className="adminFeatureCard">
                            <span className="adminFeatureIcon">🩺</span>          {/* stethoscope icon */}
                            <div>
                                <h3>Manage Doctors</h3>
                                <p>Monitor doctors registered in the system.</p>
                            </div>
                        </div>

                        {/* view appointments feature card */}
                        <div className="adminFeatureCard">
                            <span className="adminFeatureIcon">📅</span>          {/* calendar icon */}
                            <div>
                                <h3>View Appointments</h3>
                                <p>Monitor patient appointments and statuses.</p>
                            </div>
                        </div>

                        {/* view medical records feature card */}
                        <div className="adminFeatureCard">
                            <span className="adminFeatureIcon">📋</span>          {/* clipboard icon */}
                            <div>
                                <h3>View Medical Records</h3>
                                <p>Monitor medical records created by doctors.</p>
                            </div>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
}

export default AdminDashboard;