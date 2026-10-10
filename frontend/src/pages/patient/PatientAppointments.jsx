import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function MyAppointments() {
    const [appointments, setAppointments] = useState([]);   // list from backend
    const [loading, setLoading] = useState(true);           // shows loading text
    const [error, setError] = useState("");                 // shows error on page

    // runs once when the page loads
    useEffect(() => {
        // fetch patient's appointments from backend
        const fetchAppointments = async () => {
            try {
                const response = await api.get("/appointments/my");
                setAppointments(response.data.appointments || []);
            } catch (error) {
                setError(
                    error.response?.data?.message || "Failed to load appointments"
                );
            } finally {
                setLoading(false);                          // done either way
            }
        };

        fetchAppointments();
    }, []);

    // runs when the "Cancel" button is clicked
    const handleCancelAppointment = async (appointmentId) => {
        // ask user to confirm before cancelling
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this appointment?"
        );

        if (!confirmCancel) {
            return;
        }

        try {
            await api.patch(`/appointments/${appointmentId}/cancel`);

            // update that one appointment in the list (no need to refetch)
            setAppointments((currentAppointments) =>
                currentAppointments.map((appointment) =>
                    appointment._id === appointmentId
                        ? { ...appointment, status: "CANCELLED" }
                        : appointment
                )
            );
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to cancel appointment"
            );
        }
    };

    // show loading screen while fetching
    if (loading) {
        return (
            <>
                <Sidebar />
                <main>
                    <p>Loading appointments...</p>
                </main>
            </>
        );
    }

    // show error screen if fetch failed
    if (error) {
        return (
            <>
                <Sidebar />
                <main>
                    <p className="error">{error}</p>
                </main>
            </>
        );
    }

    return (
        <div>
            <Sidebar />

            <main>

                {/* page title + logout button */}
                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">PATIENT PORTAL</p>
                        <h1>My Appointments</h1>
                        <p>View and manage your upcoming and past appointments.</p>
                    </div>

                    <LogoutButton />
                </div>

                <section className="appointmentSection">
                    <h2>Your Appointments</h2>

                    {appointments.length === 0 ? (
                        // empty state - no appointments yet
                        <div className="emptyAppointment">
                            <span>📅</span>
                            <h3>No appointments found</h3>
                            <p>You don't have any appointments yet.</p>
                        </div>
                    ) : (
                        <div className="appointmentGrid">

                            {appointments.map((appointment) => (
                                <div className="appointmentCard" key={appointment._id}>

                                    {/* doctor avatar + name */}
                                    <div className="appointmentHeader">
                                        <div className="doctorAvatar">
                                            {appointment.doctorId?.userId?.name?.charAt(0) || "D"}
                                        </div>

                                        <div>
                                            <h3> {appointment.doctorId?.userId?.name || "Doctor"}</h3>
                                            <span>Doctor Consultation</span>
                                        </div>
                                    </div>

                                    {/* date, time, reason */}
                                    <div className="appointmentInfo">

                                        <p>
                                            <strong>Date</strong>
                                            <span>
                                                {new Date(appointment.appointmentDate).toLocaleDateString()}
                                            </span>
                                        </p>

                                        <p>
                                            <strong>Time</strong>
                                            <span>
                                                {new Date(appointment.appointmentDate).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </span>
                                        </p>

                                        <p>
                                            <strong>Reason</strong>
                                            <span>{appointment.reason}</span>
                                        </p>
                                    </div>

                                    {/* status + cancel button */}
                                    <div className="appointmentFooter">
                                     <span className={`appointmentStatus ${appointment.status.        toLowerCase()}`}>
                                         ● {appointment.status}
                                            </span>

                                        {/* can only cancel pending or confirmed */}
                                        {(appointment.status === "PENDING" ||
                                          appointment.status === "CONFIRMED") && (
                                            <button
                                                className="cancelAppointmentButton"
                                                onClick={() => handleCancelAppointment(appointment._id)}
                                            >
                                                Cancel Appointment
                                            </button>
                                        )}
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default MyAppointments;