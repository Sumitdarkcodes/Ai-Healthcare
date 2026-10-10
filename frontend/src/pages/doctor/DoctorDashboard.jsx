import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DoctorSidebar from "../../components/DoctorSidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function DoctorDashboard() {
    // numbers shown on the stat cards
    const [stats, setStats] = useState({
        totalAppointments: 0,
        pendingAppointments: 0,
        confirmedAppointments: 0,
        completedAppointments: 0
    });

    const [recordCount, setRecordCount] = useState(0);    // how many records doctor wrote
    const [loading, setLoading] = useState(true);         // shows "..." while loading

    // runs once when the page loads
    useEffect(() => {
        // fetch all data needed for the dashboard
        const fetchDashboardData = async () => {
            try {
                setLoading(true);

                // get appointment stats from backend
                const statsResponse = await api.get("/appointments/doctor/stats");
                setStats(statsResponse.data.stats);

                // get medical records to count how many the doctor wrote
                const recordsResponse = await api.get("/medical-records/doctor");
                const records = recordsResponse.data.medicalRecords || [];
                setRecordCount(records.length);
            } catch (error) {
                console.log("Dashboard error:", error.response?.data || error.message);
            } finally {
                setLoading(false);                        // done either way
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div>
            <DoctorSidebar />                                 {/* left side menu for doctors */}

            <main>

                {/* page title + logout button */}
                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">DOCTOR PORTAL</p>
                        <h1>Welcome back, Doctor 👋</h1>
                        <p>
                            Manage your appointments, patients and
                            healthcare activities from one place.
                        </p>
                    </div>

                    <LogoutButton />
                </div>

                {/* overview section - 5 stat cards */}
                <section className="dashboardSection">
                    <h2>Overview</h2>

                    <div className="dashboardStats">

                        <div className="statCard">
                            <span className="statIcon">📅</span>      {/* calendar icon */}
                            <h3>Total Appointments</h3>
                            <p>{loading ? "..." : stats.totalAppointments}</p>
                        </div>

                        <div className="statCard">
                            <span className="statIcon">⏳</span>      {/* hourglass icon */}
                            <h3>Pending Appointments</h3>
                            <p>{loading ? "..." : stats.pendingAppointments}</p>
                        </div>

                        <div className="statCard">
                            <span className="statIcon">✓</span>       {/* checkmark icon */}
                            <h3>Confirmed Appointments</h3>
                            <p>{loading ? "..." : stats.confirmedAppointments}</p>
                        </div>

                        <div className="statCard">
                            <span className="statIcon">✓</span>       {/* checkmark icon */}
                            <h3>Completed Appointments</h3>
                            <p>{loading ? "..." : stats.completedAppointments}</p>
                        </div>

                        <div className="statCard">
                            <span className="statIcon">📋</span>      {/* clipboard icon */}
                            <h3>Medical Records</h3>
                            <p>{loading ? "..." : recordCount}</p>    {/* real count now */}
                        </div>

                    </div>
                </section>

                {/* quick actions section - 4 shortcut cards */}
                <section className="dashboardSection">
                    <h2>Quick Actions</h2>

                    <div className="quickActions">

                        <Link to="/doctor/appointments" className="actionCard">
                            <span>📅</span>
                            <h3>Appointments</h3>
                            <p>View and manage patient appointments.</p>
                        </Link>

                        <Link to="/doctor/availability" className="actionCard">
                            <span>🕐</span>
                            <h3>Manage Availability</h3>
                            <p>Set your consultation availability.</p>
                        </Link>

                        <Link to="/doctor/medical-records" className="actionCard">
                            <span>📋</span>
                            <h3>Medical Records</h3>
                            <p>View and manage patient medical records.</p>
                        </Link>

                        <Link to="/doctor/profile" className="actionCard">
                            <span>👨‍⚕️</span>
                            <h3>Doctor Profile</h3>
                            <p>Manage your professional information.</p>
                        </Link>

                    </div>
                </section>

                {/* info banner at the bottom */}
                <section className="doctorFeatureSection">
                    <div className="doctorFeatureCard">

                        <div className="doctorFeatureIcon">🩺</div>   {/* stethoscope icon */}

                        <div>
                            <h2>AI Healthcare Doctor Panel</h2>
                            <p>
                                Manage patient care, appointments and
                                medical information efficiently through
                                your doctor dashboard.
                            </p>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
}

export default DoctorDashboard;