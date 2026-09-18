
import { useEffect, useState } from "react";

import api from "../../services/api";

import DoctorSidebar from "../../components/DoctorSidebar";
import LogoutButton from "../../components/LogoutButton";
import { Link } from "react-router-dom";

function DoctorDashboard() {

    const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    completedAppointments: 0
});

const [loading, setLoading] = useState(true);

useEffect(() => {

    const fetchStats = async () => {

        try {

            const response = await api.get("/appointments/doctor/stats");

            console.log("DOCTOR DASHBOARD STATS:", response.data);

            setStats(response.data.stats);

        } catch (error) {

            console.log(
                "DOCTOR DASHBOARD STATS ERROR:",
                error.response?.data
            );

        } finally {

            setLoading(false);
        }
    };

    fetchStats();

}, []);

    return (
        <div>

            <DoctorSidebar />

            <main>

                <div className="dashboardHeader">

                    <div>
                        <p className="eyebrow">
                            DOCTOR PORTAL
                        </p>

                        <h1>Welcome back, Doctor 👋</h1>

                        <p>
                            Manage your appointments, patients and
                            healthcare activities from one place.
                        </p>
                    </div>

                    <LogoutButton />

                </div>


                {/* OVERVIEW */}

                <section className="dashboardSection">

                    <h2>Overview</h2>

                    <div className="dashboardStats">

                        <div className="statCard">

                            <span className="statIcon">
                                📅
                            </span>

                            <h3>
                                Total Appointments
                            </h3>

                            <p>{loading ? "..." : stats.totalAppointments}</p>

                        </div>


                        <div className="statCard">

                            <span className="statIcon">
                                ⏳
                            </span>

                            <h3>
                                Pending Appointments
                            </h3>

                           <p>{loading ? "..." : stats.pendingAppointments}</p>
                        </div>


                        <div className="statCard">

                            <span className="statIcon">
                                ✓
                            </span>

                            <h3>
                                Confirmed Appointments
                            </h3>

                          <p>{loading ? "..." : stats.confirmedAppointments}</p>

                        </div>


                        <div className="statCard">

                            <span className="statIcon">
                                ✓
                            </span>

                            <h3>
                                Completed Appointments
                            </h3>

                          <p>{loading ? "..." : stats.completedAppointments}</p>

                        </div>


                        <div className="statCard">

                            <span className="statIcon">
                                📋
                            </span>

                            <h3>
                                Medical Records
                            </h3>

                            <p>—</p>
                        </div>

                    </div>

                </section>


                {/* QUICK ACTIONS */}

                <section className="dashboardSection">

                    <h2>Quick Actions</h2>

                    <div className="quickActions">

                        <Link
                            to="/doctor/appointments"
                            className="actionCard"
                        >
                            <span>📅</span>

                            <h3>
                                Appointments
                            </h3>

                            <p>
                                View and manage patient appointments.
                            </p>

                        </Link>


                        <Link
                            to="/doctor/availability"
                            className="actionCard"
                        >
                            <span>🕐</span>

                            <h3>
                                Manage Availability
                            </h3>

                            <p>
                                Set your consultation availability.
                            </p>

                        </Link>


                        <Link
                            to="/doctor/medical-records"
                            className="actionCard"
                        >
                            <span>📋</span>

                            <h3>
                                Medical Records
                            </h3>

                            <p>
                                View and manage patient medical records.
                            </p>

                        </Link>


                        <Link
                            to="/doctor/profile"
                            className="actionCard"
                        >
                            <span>👨‍⚕️</span>

                            <h3>
                                Doctor Profile
                            </h3>

                            <p>
                                Manage your professional information.
                            </p>

                        </Link>

                    </div>

                </section>


                {/* DOCTOR FEATURES */}

                <section className="doctorFeatureSection">

                    <div className="doctorFeatureCard">

                        <div className="doctorFeatureIcon">
                            🩺
                        </div>

                        <div>

                            <h2>
                                AI Healthcare Doctor Panel
                            </h2>

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