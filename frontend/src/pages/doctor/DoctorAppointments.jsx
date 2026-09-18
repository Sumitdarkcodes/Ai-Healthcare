import { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function DoctorAppointments() {

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchAppointments = async () => {

            try {

                const response = await api.get("/appointments/doctor");

                console.log(
                    "DOCTOR APPOINTMENTS:",
                    response.data
                );

                setAppointments(
                    response.data.appointments || []
                );

            } catch (error) {

                console.log(
                    "DOCTOR APPOINTMENTS ERROR:",
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


    const updateStatus = async (appointmentId, newStatus) => {

        try {

            const response = await api.patch(
                `/appointments/${appointmentId}/status`,
                {
                    status: newStatus
                }
            );

            console.log(
                "UPDATE APPOINTMENT STATUS:",
                response.data
            );

            alert(
                newStatus === "CONFIRMED"
                    ? "Appointment confirmed successfully"
                    : "Appointment rejected successfully"
            );

            setAppointments((previousAppointments) =>
                previousAppointments.map((appointment) =>
                    appointment._id === appointmentId
                        ? {
                            ...appointment,
                            status: newStatus
                        }
                        : appointment
                )
            );

        } catch (error) {

            console.log(
                "UPDATE STATUS ERROR:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Failed to update appointment"
            );
        }
    };


    const viewAppointment = (appointment) => {

        alert(
            `Patient: ${appointment.patientId?.name || "Patient"}\n` +
            `Email: ${appointment.patientId?.email || "N/A"}\n` +
            `Date: ${new Date(
                appointment.appointmentDate
            ).toLocaleDateString()}\n` +
            `Time: ${new Date(
                appointment.appointmentDate
            ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            })}\n` +
            `Reason: ${appointment.reason}\n` +
            `Status: ${appointment.status}`
        );
    };


    if (loading) {

        return (
            <>
                <DoctorSidebar />

                <main>
                    <p>Loading appointments...</p>
                </main>
            </>
        );
    }


    if (error) {

        return (
            <>
                <DoctorSidebar />

                <main>
                    <h1>Appointments</h1>
                    <p>{error}</p>
                </main>
            </>
        );
    }


    return (
        <div>

            <DoctorSidebar />

            <main>

                <div className="dashboardHeader">

                    <div>
                        <p className="eyebrow">
                            DOCTOR PORTAL
                        </p>

                        <h1>Appointments</h1>

                        <p>
                            View and manage your patient appointments.
                        </p>
                    </div>

                    <LogoutButton />

                </div>


                <section className="doctorAppointmentsSection">

                    <div className="appointmentSummary">

                        <div>
                            <span>Total Appointments</span>

                            <strong>
                                {appointments.length}
                            </strong>
                        </div>

                        <div>
                            <span>Pending</span>

                            <strong>
                                {
                                    appointments.filter(
                                        (appointment) =>
                                            appointment.status === "PENDING"
                                    ).length
                                }
                            </strong>
                        </div>

                        <div>
                            <span>Confirmed</span>

                            <strong>
                                {
                                    appointments.filter(
                                        (appointment) =>
                                            appointment.status === "CONFIRMED"
                                    ).length
                                }
                            </strong>
                        </div>

                    </div>


                    <div className="doctorAppointmentsCard">

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

                            <div className="doctorEmptyAppointments">

                                <span>📅</span>

                                <h3>No appointments found</h3>

                                <p>
                                    You currently have no patient appointments.
                                </p>

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

                                        {appointments.map(
                                            (appointment) => (

                                                <tr key={appointment._id}>

                                                    <td>

                                                        <div className="patientCell">

                                                            <div className="patientAvatar">
                                                                {
                                                                    appointment.patientId?.name
                                                                        ?.charAt(0) || "P"
                                                                }
                                                            </div>

                                                            <div>
                                                                <strong>
                                                                    {
                                                                        appointment.patientId?.name ||
                                                                        "Patient"
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        appointment.patientId?.email ||
                                                                        "N/A"
                                                                    }
                                                                </span>
                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <div className="dateTimeCell">

                                                            <strong>
                                                                {
                                                                    new Date(
                                                                        appointment.appointmentDate
                                                                    ).toLocaleDateString()
                                                                }
                                                            </strong>

                                                            <span>
                                                                {
                                                                    new Date(
                                                                        appointment.appointmentDate
                                                                    ).toLocaleTimeString([], {
                                                                        hour: "2-digit",
                                                                        minute: "2-digit"
                                                                    })
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        <span className="reasonCell">
                                                            {appointment.reason}
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`appointmentStatusBadge ${appointment.status.toLowerCase()}`}
                                                        >
                                                            {appointment.status}
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <div className="appointmentActions">

                                                            <button
                                                                className="viewAppointmentButton"
                                                                onClick={() =>
                                                                    viewAppointment(
                                                                        appointment
                                                                    )
                                                                }
                                                            >
                                                                View
                                                            </button>


                                                            {appointment.status === "PENDING" && (
                                                                <>
                                                                    <button
                                                                        className="confirmAppointmentButton"
                                                                        onClick={() =>
                                                                            updateStatus(
                                                                                appointment._id,
                                                                                "CONFIRMED"
                                                                            )
                                                                        }
                                                                    >
                                                                        Confirm
                                                                    </button>

                                                                    <button
                                                                        className="rejectAppointmentButton"
                                                                        onClick={() =>
                                                                            updateStatus(
                                                                                appointment._id,
                                                                                "REJECTED"
                                                                            )
                                                                        }
                                                                    >
                                                                        Reject
                                                                    </button>
                                                                </>
                                                            )}

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )}

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