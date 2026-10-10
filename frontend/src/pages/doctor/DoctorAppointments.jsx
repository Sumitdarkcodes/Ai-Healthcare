import { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);   // pending + confirmed combined
    const [loading, setLoading] = useState(true);           // shows loading screen
    const [error, setError] = useState("");                 // shows error on page

    // runs once when the page loads
    useEffect(() => {
        // fetch both pending and confirmed appointments, then combine
        const fetchAppointments = async () => {
            try {
                const pendingRes = await api.get("/appointments/doctor");            // PENDING
                const confirmedRes = await api.get("/appointments/doctor/confirmed"); // CONFIRMED

                const pending = pendingRes.data.appointments || [];
                const confirmed = confirmedRes.data.appointments || [];

                setAppointments([...pending, ...confirmed]);    // merge into one list
            } catch (error) {
                setError(
                    error.response?.data?.message || "Failed to load appointments"
                );
            } finally {
                setLoading(false);                              // done either way
            }
        };

        fetchAppointments();
    }, []);

    // confirm or reject a pending appointment
    const updateStatus = async (appointmentId, newStatus) => {
        try {
            await api.patch(`/appointments/${appointmentId}/status`, {
                status: newStatus
            });

            // update just this appointment in the list (no refetch needed)
            setAppointments((previousAppointments) =>
                previousAppointments.map((appointment) =>
                    appointment._id === appointmentId
                        ? { ...appointment, status: newStatus }  // update status
                        : appointment                            // leave others alone
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to update appointment"
            );
        }
    };

    // show loading screen while fetching
    if (loading) {
        return (
            <div>
                <DoctorSidebar />
                <main>
                    <p>Loading appointments...</p>
                </main>
            </div>
        );
    }

    // show error screen if fetch failed
    if (error) {
        return (
            <div>
                <DoctorSidebar />

                <main>
                    {/* page title + logout button */}
                    <div className="dashboardHeader">
                        <div>
                            <p className="eyebrow">DOCTOR PORTAL</p>
                            <h1>Appointments</h1>
                            <p>View and manage your patient appointments.</p>
                        </div>

                        <LogoutButton />
                    </div>

                    <p className="error">{error}</p>             {/* error message */}
                </main>
            </div>
        );
    }

    return (
        <div>
            <DoctorSidebar />

            <main>

                {/* page title + logout button */}
                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">DOCTOR PORTAL</p>
                        <h1>Appointments</h1>
                        <p>View and manage your patient appointments.</p>
                    </div>

                    <LogoutButton />
                </div>

                <section className="doctorAppointmentsSection">

                    {/* summary - total, pending, confirmed counts */}
                    <div className="appointmentSummary">

                        <div>
                            <span>Total Appointments</span>
                            <strong>{appointments.length}</strong>
                        </div>

                        <div>
                            <span>Pending</span>
                            <strong>
                                {appointments.filter(
                                    (appointment) => appointment.status === "PENDING"
                                ).length}
                            </strong>
                        </div>

                        <div>
                            <span>Confirmed</span>
                            <strong>
                                {appointments.filter(
                                    (appointment) => appointment.status === "CONFIRMED"
                                ).length}
                            </strong>
                        </div>

                    </div>

                    <div className="doctorAppointmentsCard">

                        {/* section header */}
                        <div className="doctorAppointmentsHeader">
                            <div>
                                <h2>Patient Appointments</h2>
                                <p>
                                    Manage appointment requests and
                                    consultation schedules.
                                </p>
                            </div>
                        </div>

                        {appointments.length === 0 ? (
                            // empty state
                            <div className="doctorEmptyAppointments">
                                <span>📅</span>
                                <h3>No appointments found</h3>
                                <p>You currently have no patient appointments.</p>
                            </div>
                        ) : (
                            <div className="appointmentTableWrapper">
                                <table className="doctorAppointmentTable">

                                    <thead>
                                        <tr>
                                            <th>Patient</th>
                                            <th>Date & Time</th>
                                            <th>Reason</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {appointments.map((appointment) => (
                                            <tr key={appointment._id}>

                                                {/* patient avatar + name + email */}
                                                <td>
                                                    <div className="patientCell">
                                                        <div className="patientAvatar">
                                                            {appointment.patientId?.name?.charAt(0) || "P"}
                                                        </div>

                                                        <div>
                                                            <strong>
                                                                {appointment.patientId?.name || "Patient"}
                                                            </strong>
                                                            <span>
                                                                {appointment.patientId?.email || "N/A"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* date + time */}
                                                <td>
                                                    <div className="dateTimeCell">
                                                        <strong>
                                                            {new Date(appointment.appointmentDate).toLocaleDateString()}
                                                        </strong>
                                                        <span>
                                                            {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            })}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* reason */}
                                                <td>
                                                    <span className="reasonCell">
                                                        {appointment.reason}
                                                    </span>
                                                </td>

                                                {/* status badge */}
                                                <td>
                                                    <span
                                                        className={`appointmentStatusBadge ${appointment.status.toLowerCase()}`}
                                                    >
                                                        {appointment.status}
                                                    </span>
                                                </td>

                                                {/* actions - only pending shows buttons */}
                                                <td>
                                                    <div className="appointmentActions">

                                                        {appointment.status === "PENDING" && (
                                                            <>
                                                                <button
                                                                    className="confirmAppointmentButton"
                                                                    onClick={() => updateStatus(appointment._id, "CONFIRMED")}
                                                                >
                                                                    Confirm
                                                                </button>

                                                                <button
                                                                    className="rejectAppointmentButton"
                                                                    onClick={() => updateStatus(appointment._id, "REJECTED")}
                                                                >
                                                                    Reject
                                                                </button>
                                                            </>
                                                        )}

                                                        {appointment.status !== "PENDING" && (
                                                            <span className="noActionText">
                                                                No action needed
                                                            </span>
                                                        )}

                                                    </div>
                                                </td>

                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default DoctorAppointments;