import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function PatientDashboard() {
    // numbers shown on the four stat cards
    const [stats, setStats] = useState({
        upcomingAppointments: 0,
        completedAppointments: 0,
        medicalRecords: 0,
        availableDoctors: 0
    });

    const [loading, setLoading] = useState(true);        // shows loading text

    // runs once when the page loads
    useEffect(() => {
        // fetch all data needed for the dashboard
        const loadDashboardData = async () => {
            try {
                setLoading(true);

                const appointmentsResponse = await api.get("/appointments/my");       // patient's appointments
                const medicalRecordsResponse = await api.get("/medical-records");     // patient's records
                const doctorsResponse = await api.get("/doctors");                    // available doctors

                const appointments = appointmentsResponse.data.appointments || [];
                const medicalRecords = medicalRecordsResponse.data.medicalRecords || [];
                const doctors = doctorsResponse.data.doctors || [];

                // count upcoming (pending + confirmed)
                const upcomingAppointments = appointments.filter(
                    (appointment) =>
                        appointment.status === "PENDING" ||
                        appointment.status === "CONFIRMED"
                ).length;

                // count completed appointments
                const completedAppointments = appointments.filter(
                    (appointment) => appointment.status === "COMPLETED"
                ).length;

                setStats({
                    upcomingAppointments,
                    completedAppointments,
                    medicalRecords: medicalRecords.length,
                    availableDoctors: doctors.length
                });
            } catch (error) {
                console.log("Dashboard error:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    return (
        <div>
            <Sidebar />

            <main>

                {/* page title + logout button */}
                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">PATIENT PORTAL</p>
                        <h1>Welcome back 👋</h1>
                        <p>Manage your healthcare and stay on top of your appointments.</p>
                    </div>

                    <LogoutButton />
                </div>

                {/* overview section - 4 stat cards */}
                <section className="dashboardSection">
                    <h2>Overview</h2>

                    {loading ? (
                        <p>Loading dashboard data...</p>
                    ) : (
                        <div className="dashboardStats">

                            <div className="statCard">
                                <span className="statIcon">📅</span>
                                <h3>Upcoming Appointments</h3>
                                <p>{stats.upcomingAppointments}</p>
                            </div>

                            <div className="statCard">
                                <span className="statIcon">✓</span>
                                <h3>Completed Appointments</h3>
                                <p>{stats.completedAppointments}</p>
                            </div>

                            <div className="statCard">
                                <span className="statIcon">📋</span>
                                <h3>Medical Records</h3>
                                <p>{stats.medicalRecords}</p>
                            </div>

                            <div className="statCard">
                                <span className="statIcon">🩺</span>
                                <h3>Available Doctors</h3>
                                <p>{stats.availableDoctors}</p>
                            </div>

                        </div>
                    )}
                </section>

                {/* quick actions section - 4 shortcut cards */}
                <section className="dashboardSection">
                    <h2>Quick Actions</h2>

                    <div className="quickActions">

                        <Link to="/patient/doctors" className="actionCard">
                            <span>🩺</span>
                            <h3>Find a Doctor</h3>
                            <p>Browse available doctors.</p>
                        </Link>

                        <Link to="/patient/appointments" className="actionCard">
                            <span>📅</span>
                            <h3>Book Appointment</h3>
                            <p>Schedule a consultation.</p>
                        </Link>

                        <Link to="/patient/symptom-checker" className="actionCard">
                            <span>🤖</span>
                            <h3>AI Symptom Checker</h3>
                            <p>Get AI-powered health guidance.</p>
                        </Link>

                        <Link to="/patient/medical-records" className="actionCard">
                            <span>📋</span>
                            <h3>Medical Records</h3>
                            <p>View your health records.</p>
                        </Link>

                    </div>
                </section>
            </main>
        </div>
    );
}

export default PatientDashboard;