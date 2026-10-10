import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function AdminAppointments() {
    const [appointments, setAppointments] = useState([]);   // full list from backend
    const [loading, setLoading] = useState(true);           // shows loading state
    const [error, setError] = useState("");                 // shows error on page

    // runs once when the page loads
    useEffect(() => {
        // fetch all appointments from backend
        const fetchAppointments = async () => {
            try {
                const response = await api.get("/admin/appointments");
                setAppointments(response.data.appointments || []);   // save list
            } catch (error) {
                setError(
                    error.response?.data?.message || "Failed to fetch appointments"    // fallback
                );
            } finally {
                setLoading(false);                              // done either way
            }
        };

        fetchAppointments();
    }, []);

    // count by status (used in the summary cards)
    const pendingAppointments = appointments.filter(
        (appointment) => appointment.status === "PENDING"
    ).length;

    const confirmedAppointments = appointments.filter(
        (appointment) => appointment.status === "CONFIRMED"
    ).length;

    const cancelledAppointments = appointments.filter(
        (appointment) => appointment.status === "CANCELLED"
    ).length;

    return (
        <div>
            <AdminSidebar />                                    {/* left menu for admins */}

            <main>

                {/* page title + logout button */}
                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">ADMIN PORTAL</p>
                        <h1>All Appointments</h1>
                        <p>View all appointments in the healthcare system.</p>
                    </div>

                    <LogoutButton />
                </div>

                <section className="adminAppointmentsSection">

                    {/* summary cards - counts by status */}
                    <div className="adminAppointmentSummary">

                        <div>
                            <span>Total Appointments</span>
                            <strong>{appointments.length}</strong>       {/* total */}
                        </div>

                        <div>
                            <span>Pending</span>
                            <strong>{pendingAppointments}</strong>       {/* pending count */}
                        </div>

                        <div>
                            <span>Confirmed</span>
                            <strong>{confirmedAppointments}</strong>     {/* confirmed count */}
                        </div>

                        <div>
                            <span>Cancelled</span>
                            <strong>{cancelledAppointments}</strong>     {/* cancelled count */}
                        </div>

                    </div>

                    {/* main card - appointment table */}
                    <div className="adminAppointmentsCard">

                        {/* card header with count */}
                        <div className="adminAppointmentsHeader">
                            <div>
                                <h2>Appointment Management</h2>
                                <p>Monitor patient appointments and their current status.</p>
                            </div>

                            <span className="adminAppointmentCount">
                                {appointments.length} Appointments         {/* count badge */}
                            </span>
                        </div>

                        {/* error message */}
                        {error && <p className="error">{error}</p>}

                        {loading ? (
                            // loading state
                            <div className="adminEmptyAppointments">
                                <span>📅</span>                       {/* calendar icon */}
                                <h3>Loading appointments...</h3>
                            </div>
                        ) : appointments.length === 0 ? (
                            // empty state
                            <div className="adminEmptyAppointments">
                                <span>📅</span>
                                <h3>No appointments found</h3>
                                <p>There are currently no appointments in the system.</p>
                            </div>
                        ) : (
                            <div className="adminAppointmentTableWrapper">
                                <table className="adminAppointmentTable">

                                    <thead>
                                        <tr>
                                            <th>Patient</th>
                                            <th>Doctor</th>
                                            <th>Date & Time</th>
                                            <th>Reason</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {appointments.map((appointment) => {
                                            const patientName =
                                                appointment.patientId?.name || "Unknown Patient";
                                            const doctorName =
                                                appointment.doctorId?.userId?.name || "Unknown Doctor";
                                            const appointmentDate = appointment.appointmentDate
                                                ? new Date(appointment.appointmentDate).toLocaleString()
                                                : "Not available";

                                            return (
                                                <tr key={appointment._id}>

                                                    {/* patient avatar + name */}
                                                    <td>
                                                        <div className="adminPatientCell">
                                                            <div className="adminPatientAvatar">
                                                                {patientName.charAt(0).toUpperCase()}    {/* first letter */}
                                                            </div>
                                                            <strong>{patientName}</strong>
                                                        </div>
                                                    </td>

                                                    {/* doctor name */}
                                                    <td>
                                                        <span className="adminDoctorName">
                                                            {doctorName}
                                                        </span>
                                                    </td>

                                                    {/* date + time */}
                                                    <td>
                                                        <div className="adminDateTimeCell">
                                                            <strong>{appointmentDate}</strong>
                                                        </div>
                                                    </td>

                                                    {/* reason */}
                                                    <td>
                                                        <span className="adminReasonCell">
                                                            {appointment.reason}
                                                        </span>
                                                    </td>

                                                    {/* status badge - class is status lowercase */}
                                                    <td>
                                                        <span
                                                            className={`adminAppointmentStatus ${appointment.status.toLowerCase()}`}
                                                        >
                                                            {appointment.status}
                                                        </span>
                                                    </td>

                                                </tr>
                                            );
                                        })}
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