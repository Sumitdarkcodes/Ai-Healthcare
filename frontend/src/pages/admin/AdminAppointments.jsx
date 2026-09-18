import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function AdminAppointments() {

    const [appointments, setAppointments] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(function () {

        async function fetchAppointments() {

            try {

                setLoading(true);

                const response = await api.get(
                    "/admin/appointments"
                );

                console.log(
                    "ADMIN APPOINTMENTS:",
                    response.data
                );

                setAppointments(
                    response.data.appointments || []
                );

            } catch (error) {

                console.error(
                    "ADMIN APPOINTMENTS ERROR:",
                    error.response?.data || error.message
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to fetch appointments."
                );

            } finally {

                setLoading(false);

            }

        }

        fetchAppointments();

    }, []);


    const pendingAppointments = appointments.filter(
        function (appointment) {
            return appointment.status === "PENDING";
        }
    ).length;


    const confirmedAppointments = appointments.filter(
        function (appointment) {
            return appointment.status === "CONFIRMED";
        }
    ).length;


    const cancelledAppointments = appointments.filter(
        function (appointment) {
            return appointment.status === "CANCELLED";
        }
    ).length;


    const viewAppointment = function (appointment) {

        const patientName =
            appointment.patientId?.name || "Unknown";

        const patientEmail =
            appointment.patientId?.email || "Not available";

        const doctorName =
            appointment.doctorId?.userId?.name || "Unknown";

        const specialization =
            appointment.doctorId?.specialization || "Not available";

        const appointmentDate =
            appointment.appointmentDate
                ? new Date(
                    appointment.appointmentDate
                ).toLocaleString()
                : "Not available";


        alert(
            `Patient: ${patientName}\n` +
            `Patient Email: ${patientEmail}\n` +
            `Doctor: ${doctorName}\n` +
            `Specialization: ${specialization}\n` +
            `Date & Time: ${appointmentDate}\n` +
            `Reason: ${appointment.reason}\n` +
            `Status: ${appointment.status}`
        );

    };


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
                            All Appointments
                        </h1>

                        <p>
                            View all appointments in the healthcare system.
                        </p>

                    </div>

                    <LogoutButton />

                </div>


                <section className="adminAppointmentsSection">


                    {/* Summary */}

                    <div className="adminAppointmentSummary">

                        <div>

                            <span>
                                Total Appointments
                            </span>

                            <strong>
                                {appointments.length}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Pending
                            </span>

                            <strong>
                                {pendingAppointments}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Confirmed
                            </span>

                            <strong>
                                {confirmedAppointments}
                            </strong>

                        </div>


                        <div>

                            <span>
                                Cancelled
                            </span>

                            <strong>
                                {cancelledAppointments}
                            </strong>

                        </div>

                    </div>


                    {/* Appointments */}

                    <div className="adminAppointmentsCard">

                        <div className="adminAppointmentsHeader">

                            <div>

                                <h2>
                                    Appointment Management
                                </h2>

                                <p>
                                    Monitor patient appointments and their current status.
                                </p>

                            </div>


                            <span className="adminAppointmentCount">

                                {appointments.length} Appointments

                            </span>

                        </div>


                        {loading ? (

                            <div className="adminEmptyAppointments">

                                <span>
                                    📅
                                </span>

                                <h3>
                                    Loading appointments...
                                </h3>

                            </div>

                        ) : appointments.length === 0 ? (

                            <div className="adminEmptyAppointments">

                                <span>
                                    📅
                                </span>

                                <h3>
                                    No appointments found
                                </h3>

                                <p>
                                    There are currently no appointments in the system.
                                </p>

                            </div>

                        ) : (

                            <div className="adminAppointmentTableWrapper">

                                <table className="adminAppointmentTable">

                                    <thead>

                                        <tr>

                                            <th>
                                                Patient
                                            </th>

                                            <th>
                                                Doctor
                                            </th>

                                            <th>
                                                Date & Time
                                            </th>

                                            <th>
                                                Reason
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Actions
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {appointments.map(
                                            function (appointment) {

                                                const patientName =
                                                    appointment.patientId?.name ||
                                                    "Unknown Patient";


                                                const doctorName =
                                                    appointment.doctorId?.userId?.name ||
                                                    "Unknown Doctor";


                                                const appointmentDate =
                                                    appointment.appointmentDate
                                                        ? new Date(
                                                            appointment.appointmentDate
                                                        ).toLocaleString()
                                                        : "Not available";


                                                return (

                                                    <tr
                                                        key={appointment._id}
                                                    >


                                                        {/* Patient */}

                                                        <td>

                                                            <div className="adminPatientCell">

                                                                <div className="adminPatientAvatar">

                                                                    {patientName
                                                                        .charAt(0)
                                                                        .toUpperCase()}

                                                                </div>

                                                                <strong>
                                                                    {patientName}
                                                                </strong>

                                                            </div>

                                                        </td>


                                                        {/* Doctor */}

                                                        <td>

                                                            <span className="adminDoctorName">

                                                                {doctorName}

                                                            </span>

                                                        </td>


                                                        {/* Date & Time */}

                                                        <td>

                                                            <div className="adminDateTimeCell">

                                                                <strong>
                                                                    {appointmentDate}
                                                                </strong>

                                                            </div>

                                                        </td>


                                                        {/* Reason */}

                                                        <td>

                                                            <span className="adminReasonCell">

                                                                {appointment.reason}

                                                            </span>

                                                        </td>


                                                        {/* Status */}

                                                        <td>

                                                            <span
                                                                className={
                                                                    `adminAppointmentStatus ${appointment.status.toLowerCase()}`
                                                                }
                                                            >
                                                                {appointment.status}
                                                            </span>

                                                        </td>


                                                        {/* Actions */}

                                                        <td>

                                                            <div className="adminAppointmentActions">

                                                                <button
                                                                    className="adminViewAppointmentButton"
                                                                    onClick={
                                                                        function () {
                                                                            viewAppointment(
                                                                                appointment
                                                                            );
                                                                        }
                                                                    }
                                                                >
                                                                    View
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                );

                                            }
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

export default AdminAppointments;