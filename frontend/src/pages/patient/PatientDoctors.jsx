import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function Doctors() {
    const [doctors, setDoctors] = useState([]);           // list from backend
    const [loading, setLoading] = useState(true);         // shows loading text
    const [search, setSearch] = useState("");             // search box value

    // runs once when the page loads
    useEffect(() => {
        // fetch available doctors from backend
        const fetchDoctors = async () => {
            try {
                const response = await api.get("/doctors");
                setDoctors(response.data.doctors || []);  // save list
            } catch (error) {
                console.log("Doctors error:", error.response?.data || error.message);
            } finally {
                setLoading(false);                        // done either way
            }
        };

        fetchDoctors();
    }, []);

    // filter doctors by search text (name or specialization)
    const filteredDoctors = doctors.filter((doctor) => {
        const text = search.toLowerCase();
        const name = (doctor.userId?.name || "").toLowerCase();
        const specialization = (doctor.specialization || "").toLowerCase();

        return name.includes(text) || specialization.includes(text);
    });

    return (
        <div>
            <Sidebar />

            <main>

                {/* page title + logout button */}
                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">PATIENT PORTAL</p>
                        <h1>Find a Doctor</h1>
                        <p>Choose the right doctor according to your medical needs.</p>
                    </div>

                    <LogoutButton />
                </div>

                <section className="doctorSection">

                    {/* section title + search box */}
                    <div className="doctorTopBar">
                        <div>
                            <h2>Available Doctors</h2>
                            <p>Browse healthcare professionals and book an appointment.</p>
                        </div>

                        <input
                            type="text"
                            placeholder="Search doctors..."
                            className="doctorSearch"
                            value={search}                    // controls input value
                            onChange={(e) => setSearch(e.target.value)}   // updates search state
                        />
                    </div>

                    {/* show loading, empty, or doctor list */}
                    {loading && <p>Loading doctors...</p>}

                    {!loading && filteredDoctors.length === 0 && (
                        <p>No doctors found.</p>
                    )}

                    <div className="doctorGrid">

                        {filteredDoctors.map((doctor) => (
                            <div className="doctorCard" key={doctor._id}>

                                {/* avatar + name + specialization */}
                                <div className="doctorCardHeader">
                                    <div className="doctorAvatar">
                                        {doctor.userId?.name?.charAt(0) || "D"}   {/* first letter of name */}
                                    </div>

                                    <div>
                                        <h3> {doctor.userId?.name || "Doctor"}</h3>
                                        <span className="doctorSpecialization">
                                            {doctor.specialization}
                                        </span>
                                    </div>
                                </div>

                                {/* qualification, experience, fee */}
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

                                {/* availability dot */}
                                <div className="doctorAvailability">
                                    <span className={doctor.isAvailable ? "available" : "notAvailable"}>
                                        ● {doctor.isAvailable ? "Available" : "Not Available"}
                                    </span>
                                </div>

                                {/* view details + book buttons */}
                                <div className="doctorActions">
                                    <Link to={`/patient/doctors/${doctor._id}`} className="viewDoctor">
                                        View Details
                                    </Link>

                                    <Link to={`/patient/doctors/${doctor._id}`} className="bookDoctor">
                                        Book Appointment
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