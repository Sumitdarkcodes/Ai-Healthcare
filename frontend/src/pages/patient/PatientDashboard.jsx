
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";
import { Link } from "react-router-dom";
import api from "../../services/api";

function PatientDashboard() {

    const [stats, setStats] = useState({
        upcomingAppointments: 0,
        completedAppointments: 0,
        medicalRecords: 0,
        availableDoctors: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(function () {

        async function loadDashboardData() {

            try {
                setLoading(true);

                // Get patient's appointments
                const appointmentsResponse =
                    await api.get("/appointments/my");

                // Get patient's medical records
                const medicalRecordsResponse =
                    await api.get("/medical-records");

                // Get available doctors
                const doctorsResponse =
                    await api.get("/doctors");

                const appointments =
                    appointmentsResponse.data.appointments || [];

                const medicalRecords =
                    medicalRecordsResponse.data.medicalRecords || [];

                const doctors =
                    doctorsResponse.data.doctors || [];

                // Upcoming appointments
                const upcomingAppointments = appointments.filter(
                    function (appointment) {
                        return (
                            appointment.status === "PENDING" ||
                            appointment.status === "CONFIRMED"
                        );
                    }
                ).length;

                // Completed appointments
                const completedAppointments = appointments.filter(
                    function (appointment) {
                        return appointment.status === "COMPLETED";
                    }
                ).length;

                // Available doctors
                const availableDoctors = doctors.filter(
                    function (doctor) {
                        return doctor.isAvailable === true;
                    }
                ).length;

                setStats({
                    upcomingAppointments: upcomingAppointments,
                    completedAppointments: completedAppointments,
                    medicalRecords: medicalRecords.length,
                    availableDoctors: availableDoctors
                });

            } catch (error) {

                console.error(
                    "PATIENT DASHBOARD ERROR:",
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

            <Sidebar />

            <main>

                <div className="dashboardHeader">

                    <div>

                        <p className="eyebrow">
                            PATIENT PORTAL
                        </p>

                        <h1>
                            Welcome back 👋
                        </h1>

                        <p>
                            Manage your healthcare and stay on top of your appointments.
                        </p>

                    </div>

                    <LogoutButton />

                </div>


                <section className="dashboardSection">

                    <h2>
                        Overview
                    </h2>

                    {loading ? (

                        <p>
                            Loading dashboard data...
                        </p>

                    ) : (

                        <div className="dashboardStats">

                            <div className="statCard">

                                <span className="statIcon">
                                    📅
                                </span>

                                <h3>
                                    Upcoming Appointments
                                </h3>

                                <p>
                                    {stats.upcomingAppointments}
                                </p>

                            </div>


                            <div className="statCard">

                                <span className="statIcon">
                                    ✓
                                </span>

                                <h3>
                                    Completed Appointments
                                </h3>

                                <p>
                                    {stats.completedAppointments}
                                </p>

                            </div>


                            <div className="statCard">

                                <span className="statIcon">
                                    📋
                                </span>

                                <h3>
                                    Medical Records
                                </h3>

                                <p>
                                    {stats.medicalRecords}
                                </p>

                            </div>


                            <div className="statCard">

                                <span className="statIcon">
                                    🩺
                                </span>

                                <h3>
                                    Available Doctors
                                </h3>

                                <p>
                                    {stats.availableDoctors}
                                </p>

                            </div>

                        </div>

                    )}

                </section>


                <section className="dashboardSection">

                    <h2>
                        Quick Actions
                    </h2>

                    <div className="quickActions">

                        <Link
                            to="/patient/doctors"
                            className="actionCard"
                        >

                            <span>
                                🩺
                            </span>

                            <h3>
                                Find a Doctor
                            </h3>

                            <p>
                                Browse available doctors.
                            </p>

                        </Link>


                        <Link
                            to="/patient/appointments"
                            className="actionCard"
                        >

                            <span>
                                📅
                            </span>

                            <h3>
                                Book Appointment
                            </h3>

                            <p>
                                Schedule a consultation.
                            </p>

                        </Link>


                        <Link
                            to="/patient/symptom-checker"
                            className="actionCard"
                        >

                            <span>
                                🤖
                            </span>

                            <h3>
                                AI Symptom Checker
                            </h3>

                            <p>
                                Get AI-powered health guidance.
                            </p>

                        </Link>


                        <Link
                            to="/patient/medical-records"
                            className="actionCard"
                        >

                            <span>
                                📋
                            </span>

                            <h3>
                                Medical Records
                            </h3>

                            <p>
                                View your health records.
                            </p>

                        </Link>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default PatientDashboard;
