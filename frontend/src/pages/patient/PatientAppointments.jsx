import { useEffect, useState } from "react";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";

function MyAppointments() {

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchAppointments = async () => {

            try {

                const response = await api.get("/appointments/my");

                console.log(
                    "MY APPOINTMENTS:",
                    response.data
                );

                setAppointments(response.data.appointments || []);

            } catch (error) {

                console.log(
                    "APPOINTMENTS ERROR:",
                    error.response?.data
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load appointments"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchAppointments();

    }, []);


    const handleCancelAppointment = async (appointmentId) => {

        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this appointment?"
        );

        if (!confirmCancel) {
            return;
        }

        try {

            const response = await api.patch(
                `/appointments/${appointmentId}/cancel`
            );

            console.log(
                "CANCEL RESPONSE:",
                response.data
            );

            alert("Appointment cancelled successfully");

            setAppointments((currentAppointments) =>
                currentAppointments.map((appointment) =>
                    appointment._id === appointmentId
                        ? {
                            ...appointment,
                            status: "CANCELLED"
                        }
                        : appointment
                )
            );

        } catch (error) {

            console.log(
                "CANCEL ERROR:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Failed to cancel appointment"
            );
        }
    };


    if (loading) {
        return <p>Loading appointments...</p>;
    }


    if (error) {
        return <p>{error}</p>;
    }


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
                            My Appointments
                        </h1>

                        <p>
                            View and manage your upcoming and past appointments.
                        </p>
                    </div>

                    <LogoutButton />

                </div>


                <section className="appointmentSection">

                    <h2>
                        Your Appointments
                    </h2>


                    {appointments.length === 0 ? (

                        <div className="emptyAppointment">

                            <span>📅</span>

                            <h3>
                                No appointments found
                            </h3>

                            <p>
                                You don't have any appointments yet.
                            </p>

                        </div>

                    ) : (

                        <div className="appointmentGrid">

                            {appointments.map((appointment) => (

                                <div
                                    className="appointmentCard"
                                    key={appointment._id}
                                >

                                    <div className="appointmentHeader">

                                        <div className="doctorAvatar">

                                            {appointment.doctor?.userId?.name?.charAt(0) || "D"}

                                        </div>


                                        <div>

                                            <h3>
                                                Dr. {appointment.doctor?.userId?.name || "Doctor"}
                                            </h3>

                                            <span>
                                                Doctor Consultation
                                            </span>

                                        </div>

                                    </div>


                                    <div className="appointmentInfo">

                                        <p>

                                            <strong>
                                                Date
                                            </strong>

                                            <span>
                                                {new Date(
                                                    appointment.appointmentDate
                                                ).toLocaleDateString()}
                                            </span>

                                        </p>


                                        <p>

                                            <strong>
                                                Time
                                            </strong>

                                            <span>
                                                {new Date(
                                                    appointment.appointmentDate
                                                ).toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </span>

                                        </p>


                                        <p>

                                            <strong>
                                                Reason
                                            </strong>

                                            <span>
                                                {appointment.reason}
                                            </span>

                                        </p>

                                    </div>


                                    <div className="appointmentFooter">

                                        <span className="appointmentStatus">
                                            ● {appointment.status}
                                        </span>


                                        {(appointment.status === "PENDING" ||
                                          appointment.status === "CONFIRMED") && (

                                            <button
                                                className="cancelAppointmentButton"
                                                onClick={() =>
                                                    handleCancelAppointment(
                                                        appointment._id
                                                    )
                                                }
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