import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function Doctors() {

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchDoctors = async () => {

            try {

                const response = await api.get("/doctors");

                console.log("DOCTORS LIST:", response.data);

                setDoctors(response.data.doctors);

            } catch (error) {

                console.log(
                    "DOCTORS LIST ERROR:",
                    error.response?.data
                );

            } finally {

                setLoading(false);
            }
        };

        fetchDoctors();

    }, []);

    return (
        <div>

            <Sidebar />

            <main>

                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">PATIENT PORTAL</p>

                        <h1>Find a Doctor</h1>

                        <p>
                            Choose the right doctor according to your medical needs.
                        </p>
                    </div>

                    <LogoutButton />
                </div>


                <section className="doctorSection">

                    <div className="doctorTopBar">

                        <div>
                            <h2>Available Doctors</h2>
                            <p>
                                Browse healthcare professionals and book an appointment.
                            </p>
                        </div>

                        <input
                            type="text"
                            placeholder="Search doctors..."
                            className="doctorSearch"
                        />

                    </div>


                    {loading && <p>Loading doctors...</p>}

                    {!loading && doctors.length === 0 && (
                        <p>No doctors available right now.</p>
                    )}

                    <div className="doctorGrid">

                        {doctors.map((doctor) => (

                            <div className="doctorCard" key={doctor._id}>

                                <div className="doctorCardHeader">

                                    <div className="doctorAvatar">
                                        {doctor.userId?.name?.charAt(0) || "D"}
                                    </div>

                                    <div>
                                        <h3>Dr. {doctor.userId?.name || "Doctor"}</h3>

                                        <span className="doctorSpecialization">
                                            {doctor.specialization}
                                        </span>
                                    </div>

                                </div>


                                <div className="doctorInfo">

                                    <p>
                                        <strong>Qualification</strong>
                                        <span>{doctor.qualification}</span>
                                    </p>

                                    <p>
                                        <strong>Experience</strong>
                                        <span>{doctor.experience} years</span>
                                    </p>

                                    <p>
                                        <strong>Consultation Fee</strong>
                                        <span>₹{doctor.consultationFee}</span>
                                    </p>

                                </div>


                                <div className="doctorAvailability">

                                    <span
                                        className={
                                            doctor.isAvailable
                                                ? "available"
                                                : "notAvailable"
                                        }
                                    >
                                        ● {doctor.isAvailable
                                            ? "Available"
                                            : "Not Available"}
                                    </span>

                                </div>


                                <div className="doctorActions">

                                    <Link
                                        to={`/patient/doctors/${doctor._id}`}
                                        className="viewDoctor"
                                    >
                                        View Details
                                    </Link>

                                    <Link
                                        to={`/patient/doctors/${doctor._id}`}
                                        className={
                                            doctor.isAvailable
                                                ? "bookDoctor"
                                                : "bookDoctor disabled"
                                        }
                                        onClick={(e) => {
                                            if (!doctor.isAvailable) e.preventDefault();
                                        }}
                                    >
                                        {doctor.isAvailable
                                            ? "Book Appointment"
                                            : "Not Available"}
                                    </Link>

                                </div>

                            </div>

                        ))}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Doctors;