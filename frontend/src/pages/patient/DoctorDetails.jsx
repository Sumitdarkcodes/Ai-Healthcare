import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function DoctorDetails() {
    const { doctorId } = useParams();                     // doctor ID from the URL

    const [doctor, setDoctor] = useState(null);           // doctor data from backend
    const [loading, setLoading] = useState(true);         // shows loading text

    // booking form fields
    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [reason, setReason] = useState("");

    // booking feedback
    const [booking, setBooking] = useState(false);        // disables button during request
    const [error, setError] = useState("");               // shows error on page
    const [success, setSuccess] = useState("");           // shows success message

    // runs when doctorId changes (page load or URL change)
    useEffect(() => {
        // fetch doctor info from backend
        const fetchDoctor = async () => {
            try {
                const response = await api.get(`/doctors/${doctorId}`);
                setDoctor(response.data.doctor);
            } catch (error) {
                console.log("Doctor error:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [doctorId]);

    // runs when the "Book Appointment" button is clicked
    const handleBookAppointment = async () => {
        setError("");                                    // clear old messages
        setSuccess("");

        // check all fields are filled
        if (!appointmentDate || !appointmentTime || !reason) {
            setError("Please fill all appointment details");
            return;
        }

        setBooking(true);                                // disable button

        try {
            await api.post("/appointments", {
                doctorId,
                appointmentDate: `${appointmentDate}T${appointmentTime}`,   // combine date + time
                reason
            });

            setSuccess("Appointment booked successfully");     // show success message
            setAppointmentDate("");                            // clear form
            setAppointmentTime("");
            setReason("");
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to book appointment"
            );
        } finally {
            setBooking(false);                           // re-enable button
        }
    };

    // show loading screen while fetching doctor
    if (loading) {
        return (
            <>
                <Sidebar />
                <main>
                    <p>Loading doctor...</p>
                </main>
            </>
        );
    }

    // show message if doctor does not exist
    if (!doctor) {
        return (
            <>
                <Sidebar />
                <main>
                    <h1>Doctor Not Found</h1>
                    <p>The doctor you're looking for could not be found.</p>
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
                        <h1>Doctor Details</h1>
                        <p>View doctor information and book an appointment.</p>
                    </div>

                    <LogoutButton />
                </div>

                <section className="doctorDetailsLayout">

                    {/* left side - doctor information */}
                    <div className="doctorInfoCard">

                        {/* avatar + name + specialization */}
                        <div className="doctorProfileHeader">
                            <div className="doctorLargeAvatar">
                                {doctor.userId?.name?.charAt(0) || "D"}
                            </div>

                            <div>
                                <h2>{doctor.userId?.name || "Doctor"}</h2>
                                <p>{doctor.specialization}</p>
                            </div>
                        </div>

                        {/* detailed info list */}
                        <div className="doctorInfoList">

                            <div className="doctorInfoItem">
                                <span>Specialization</span>
                                <strong>{doctor.specialization}</strong>
                            </div>

                            <div className="doctorInfoItem">
                                <span>Qualification</span>
                                <strong>{doctor.qualification}</strong>
                            </div>

                            <div className="doctorInfoItem">
                                <span>Experience</span>
                                <strong>{doctor.experience} years</strong>
                            </div>

                            <div className="doctorInfoItem">
                                <span>Consultation Fee</span>
                                <strong>₹{doctor.consultationFee}</strong>
                            </div>

                            <div className="doctorInfoItem">
                                <span>Availability</span>
                                <strong className={doctor.isAvailable ? "doctorAvailable" : "doctorUnavailable"}>
                                    {doctor.isAvailable ? "Available" : "Not Available"}
                                </strong>
                            </div>

                        </div>
                    </div>

                    {/* right side - booking form */}
                    <div className="bookingCard">

                        {/* card header */}
                        <div className="bookingHeader">
                            <div className="bookingIcon">📅</div>
                            <div>
                                <h2>Book Appointment</h2>
                                <p>Schedule a consultation with this doctor.</p>
                            </div>
                        </div>

                        <div className="bookingForm">

                            {/* show error if booking failed */}
                            {error && <p className="error">{error}</p>}

                            {/* show success message if booking worked */}
                            {success && <p className="success">{success}</p>}

                            {/* date picker */}
                            <div className="bookingFormGroup">
                                <label>Appointment Date</label>
                                <input
                                    type="date"
                                    value={appointmentDate}
                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                />
                            </div>

                            {/* time picker */}
                            <div className="bookingFormGroup">
                                <label>Appointment Time</label>
                                <input
                                    type="time"
                                    value={appointmentTime}
                                    onChange={(e) => setAppointmentTime(e.target.value)}
                                />
                            </div>

                            {/* reason textarea */}
                            <div className="bookingFormGroup">
                                <label>Reason for Visit</label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Describe your reason for the appointment..."
                                    rows="5"
                                />
                            </div>

                            {/* submit button - disabled when doctor unavailable or booking */}
                            <button
                                className="bookAppointmentButton"
                                onClick={handleBookAppointment}
                                disabled={!doctor.isAvailable || booking}
                            >
                                {booking ? "Booking..." : doctor.isAvailable ? "Book Appointment" : "Doctor Unavailable"}
                            </button>

                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default DoctorDetails;