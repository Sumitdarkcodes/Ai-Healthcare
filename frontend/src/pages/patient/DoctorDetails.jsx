import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";

function DoctorDetails() {

    const { doctorId } = useParams();

    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    const [appointmentDate, setAppointmentDate] = useState("");
    const [appointmentTime, setAppointmentTime] = useState("");
    const [reason, setReason] = useState("");

    useEffect(() => {

        const fetchDoctor = async () => {

            try {

                const response = await api.get(
                    `/doctors/${doctorId}`
                );

                console.log(
                    "DOCTOR DETAILS:",
                    response.data
                );

                setDoctor(response.data.doctor);

            } catch (error) {

                console.log(
                    "DOCTOR DETAILS ERROR:",
                    error.response?.data
                );

            } finally {

                setLoading(false);
            }
        };

        fetchDoctor();

    }, [doctorId]);


    const handleBookAppointment = async () => {

        if (!appointmentDate || !appointmentTime || !reason) {
            alert("Please fill all appointment details");
            return;
        }

        try {

            const response = await api.post("/appointments", {

                doctorId,

                appointmentDate:
                    `${appointmentDate}T${appointmentTime}`,

                reason
            });

            console.log(
                "BOOKING RESPONSE:",
                response.data
            );

            alert("Appointment booked successfully");

        } catch (error) {

            console.log(
                "BOOKING ERROR:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Failed to book appointment"
            );
        }
    };


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


    if (!doctor) {
        return (
            <>
                <Sidebar />

                <main>
                    <h1>Doctor Not Found</h1>
                    <p>
                        The doctor you're looking for could not be found.
                    </p>
                </main>
            </>
        );
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

                        <h1>Doctor Details</h1>

                        <p>
                            View doctor information and book an appointment.
                        </p>
                    </div>

                    <LogoutButton />

                </div>


                <section className="doctorDetailsLayout">

                    {/* DOCTOR INFORMATION */}

                    <div className="doctorInfoCard">

                        <div className="doctorProfileHeader">

                            <div className="doctorLargeAvatar">
                                {doctor.userId?.name?.charAt(0) || "D"}
                            </div>

                            <div>

                                <h2>
                                    Dr. {doctor.userId?.name || "Doctor"}
                                </h2>

                                <p>
                                    {doctor.specialization}
                                </p>

                            </div>

                        </div>


                        <div className="doctorInfoList">

                            <div className="doctorInfoItem">
                                <span>Specialization</span>
                                <strong>
                                    {doctor.specialization}
                                </strong>
                            </div>

                            <div className="doctorInfoItem">
                                <span>Qualification</span>
                                <strong>
                                    {doctor.qualification}
                                </strong>
                            </div>

                            <div className="doctorInfoItem">
                                <span>Experience</span>
                                <strong>
                                    {doctor.experience} years
                                </strong>
                            </div>

                            <div className="doctorInfoItem">
                                <span>Consultation Fee</span>
                                <strong>
                                    ₹{doctor.consultationFee}
                                </strong>
                            </div>

                            <div className="doctorInfoItem">
                                <span>Availability</span>

                                <strong
                                    className={
                                        doctor.isAvailable
                                            ? "doctorAvailable"
                                            : "doctorUnavailable"
                                    }
                                >
                                    {doctor.isAvailable
                                        ? "Available"
                                        : "Not Available"}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* APPOINTMENT */}

                    <div className="bookingCard">

                        <div className="bookingHeader">

                            <div className="bookingIcon">
                                📅
                            </div>

                            <div>
                                <h2>Book Appointment</h2>

                                <p>
                                    Schedule a consultation with this doctor.
                                </p>
                            </div>

                        </div>


                        <div className="bookingForm">

                            <div className="bookingFormGroup">

                                <label>
                                    Appointment Date
                                </label>

                                <input
    type="date"
    value={appointmentDate}
    onChange={(e) => setAppointmentDate(e.target.value)}
/>
   
                            </div>


                            <div className="bookingFormGroup">

                                <label>
                                    Appointment Time
                                </label>

                                <input
    type="time"
    value={appointmentTime}
    onChange={(e) => setAppointmentTime(e.target.value)}
/>

 

                            </div>


                            <div className="bookingFormGroup">

                                <label>
                                    Reason for Visit
                                </label>

                                <textarea
                                    value={reason}
                                    onChange={(e) =>
                                        setReason(e.target.value)
                                    }
                                    placeholder="Describe your reason for the appointment..."
                                    rows="5"
                                />

                            </div>


                            <button
                                className="bookAppointmentButton"
                                onClick={handleBookAppointment}
                                disabled={!doctor.isAvailable}
                            >
                                {doctor.isAvailable
                                    ? "Book Appointment"
                                    : "Doctor Unavailable"}
                            </button>

                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default DoctorDetails;