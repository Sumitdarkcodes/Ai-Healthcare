
import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function AdminDashboard() {

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        pendingAppointments: 0,
        medicalRecords: 0
    });

    const [loading, setLoading] = useState(true);


    useEffect(function () {

        async function loadDashboardData() {

            try {

                setLoading(true);

                const usersResponse = await api.get(
                    "/admin/users"
                );

                const appointmentsResponse = await api.get(
                    "/admin/appointments"
                );

                const medicalRecordsResponse = await api.get(
                    "/admin/medical-records"
                );

                const users =
                    usersResponse.data.users || [];

                const appointments =
                    appointmentsResponse.data.appointments || [];

                const medicalRecords =
                    medicalRecordsResponse.data.medicalRecords || [];


                const totalDoctors = users.filter(
                    function (user) {
                        return user.role === "doctor";
                    }
                ).length;


                const totalPatients = users.filter(
                    function (user) {
                        return user.role === "patient";
                    }
                ).length;


                const pendingAppointments = appointments.filter(
                    function (appointment) {
                        return appointment.status === "PENDING";
                    }
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

                console.error(
                    "ADMIN DASHBOARD ERROR:",
                    error.response?.data || error.message
                );

            } finally {

                setLoading(false);

            }

        }


        loadDashboardData();

    }, []);


    return (
        <div>

            <AdminSidebar />

            <main>

                <div className="dashboardHeader">

                    <div>

                        <p className="eyebrow">
                            ADMIN PORTAL
                        </p>

                        <h1>
                            Admin Dashboard
                        </h1>

                        <p>
                            Welcome to AI Healthcare Admin Panel
                        </p>

                    </div>

                    <LogoutButton />

                </div>


                {/* DASHBOARD STATISTICS */}

                <section className="dashboardSection">

                    <h2>
                        Overview
                    </h2>


                    {loading ? (

                        <div className="adminDashboardLoading">
                            <p>
                                Loading dashboard data...
                            </p>
                        </div>

                    ) : (

                        <div className="adminDashboardStats">


                            {/* TOTAL USERS */}

                            <div className="adminStatCard">

                                <div className="adminStatIcon">
                                    👥
                                </div>

                                <div className="adminStatContent">

                                    <h3>
                                        Total Users
                                    </h3>

                                    <p>
                                        {stats.totalUsers}
                                    </p>

                                </div>

                            </div>


                            {/* TOTAL DOCTORS */}

                            <div className="adminStatCard">

                                <div className="adminStatIcon">
                                    🩺
                                </div>

                                <div className="adminStatContent">

                                    <h3>
                                        Total Doctors
                                    </h3>

                                    <p>
                                        {stats.totalDoctors}
                                    </p>

                                </div>

                            </div>


                            {/* TOTAL PATIENTS */}

                            <div className="adminStatCard">

                                <div className="adminStatIcon">
                                    👤
                                </div>

                                <div className="adminStatContent">

                                    <h3>
                                        Total Patients
                                    </h3>

                                    <p>
                                        {stats.totalPatients}
                                    </p>

                                </div>

                            </div>


                            {/* TOTAL APPOINTMENTS */}

                            <div className="adminStatCard">

                                <div className="adminStatIcon">
                                    📅
                                </div>

                                <div className="adminStatContent">

                                    <h3>
                                        Total Appointments
                                    </h3>

                                    <p>
                                        {stats.totalAppointments}
                                    </p>

                                </div>

                            </div>


                            {/* PENDING APPOINTMENTS */}

                            <div className="adminStatCard">

                                <div className="adminStatIcon">
                                    ⏳
                                </div>

                                <div className="adminStatContent">

                                    <h3>
                                        Pending Appointments
                                    </h3>

                                    <p>
                                        {stats.pendingAppointments}
                                    </p>

                                </div>

                            </div>


                            {/* MEDICAL RECORDS */}

                            <div className="adminStatCard">

                                <div className="adminStatIcon">
                                    📋
                                </div>

                                <div className="adminStatContent">

                                    <h3>
                                        Medical Records
                                    </h3>

                                    <p>
                                        {stats.medicalRecords}
                                    </p>

                                </div>

                            </div>

                        </div>

                    )}

                </section>


                {/* ADMIN FEATURES */}

                <section className="dashboardSection">

                    <h2>
                        Admin Features
                    </h2>

                    <div className="adminFeatureGrid">

                        <div className="adminFeatureCard">

                            <span className="adminFeatureIcon">
                                👥
                            </span>

                            <div>
                                <h3>
                                    Manage Users
                                </h3>

                                <p>
                                    View all registered users in the system.
                                </p>
                            </div>

                        </div>


                        <div className="adminFeatureCard">

                            <span className="adminFeatureIcon">
                                🩺
                            </span>

                            <div>
                                <h3>
                                    Manage Doctors
                                </h3>

                                <p>
                                    Monitor doctors registered in the system.
                                </p>
                            </div>

                        </div>


                        <div className="adminFeatureCard">

                            <span className="adminFeatureIcon">
                                📅
                            </span>

                            <div>
                                <h3>
                                    View Appointments
                                </h3>

                                <p>
                                    Monitor patient appointments and statuses.
                                </p>
                            </div>

                        </div>


                        <div className="adminFeatureCard">

                            <span className="adminFeatureIcon">
                                📋
                            </span>

                            <div>
                                <h3>
                                    View Medical Records
                                </h3>

                                <p>
                                    Monitor medical records created by doctors.
                                </p>
                            </div>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default AdminDashboard;

