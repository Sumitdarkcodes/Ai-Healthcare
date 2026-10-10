import { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function Availability() {
    const [isAvailable, setIsAvailable] = useState(false);   // doctor's current status
    const [loading, setLoading] = useState(true);            // shows loading screen
    const [updating, setUpdating] = useState(false);         // disables button during request
    const [error, setError] = useState("");                  // shows error on page
    const [success, setSuccess] = useState("");              // shows success message

    // runs once when the page loads
    useEffect(() => {
        // fetch current doctor availability from backend
        const fetchAvailability = async () => {
            try {
                const response = await api.get("/doctors/profile");
                setIsAvailable(response.data.doctor.isAvailable);    // save boolean
            } catch (error) {
                setError(
                    error.response?.data?.message || "Failed to load availability"    // fallback
                );
            } finally {
                setLoading(false);                            // done either way
            }
        };

        fetchAvailability();
    }, []);

    // runs when the toggle button is clicked
    const updateAvailability = async () => {
        setError("");                                        // clear old messages
        setSuccess("");
        setUpdating(true);                                   // disable button

        // flip the current value (true -> false, false -> true)
        const newAvailability = !isAvailable;

        try {
            const response = await api.patch("/doctors/availability", {
                isAvailable: newAvailability                 // send new value
            });

            setIsAvailable(response.data.doctor.isAvailable);    // update local state
            setSuccess(response.data.message);                   // show success
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to update availability"    // fallback
            );
        } finally {
            setUpdating(false);                              // re-enable button
        }
    };

    return (
        <div>
            <DoctorSidebar />

            <main>

                {/* page title + logout button */}
                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">DOCTOR PORTAL</p>
                        <h1>Doctor Availability</h1>
                        <p>Manage your consultation availability.</p>
                    </div>

                    <LogoutButton />
                </div>

                <section className="availabilityLayout">

                    {/* left card - toggle availability */}
                    <div className="availabilityFormCard">

                        {/* card header */}
                        <div className="availabilityHeader">
                            <div className="availabilityIcon">🕐</div>
                            <div>
                                <h2>Availability Status</h2>
                                <p>Control whether patients can book appointments with you.</p>
                            </div>
                        </div>

                        {/* messages shown on page */}
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}

                        {loading ? (
                            // loading state
                            <div className="availabilityLoading">
                                <p>Loading availability...</p>
                            </div>
                        ) : (
                            <div className="availabilityStatusContent">

                                {/* current status with colored dot */}
                                <div className="availabilityStatus">
                                    <div
                                        className={isAvailable ? "availabilityStatusDot available" : "availabilityStatusDot unavailable"}
                                    ></div>

                                    <div>
                                        <strong>
                                            {isAvailable ? "You are Available" : "You are Unavailable"}
                                        </strong>
                                        <span>
                                            {isAvailable
                                                ? "Patients can book appointments with you."
                                                : "Patients cannot book appointments with you."}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    className={isAvailable ? "availabilityToggleButton unavailableButton" : "availabilityToggleButton availableButton"}
                                    onClick={updateAvailability}
                                    disabled={updating}
                                >
                                    {updating
                                        ? "Updating..."
                                        : isAvailable
                                            ? "Set Unavailable"
                                            : "Set Available"}
                                </button>

                            </div>
                        )}

                    </div>

                    {/* right card - current status summary */}
                    <div className="availabilityListCard">

                        {/* card header with status badge */}
                        <div className="availabilityListHeader">
                            <div>
                                <h2>Current Status</h2>
                                <p>Your current appointment booking status.</p>
                            </div>

                            <span
                                className={isAvailable ? "availabilityCount availableCount" : "availabilityCount unavailableCount"}
                            >
                                {isAvailable ? "Available" : "Unavailable"}
                            </span>
                        </div>

                        {/* single-row list with icon */}
                        <div className="availabilityList">

                            <div className="availabilityItem">

                                <div className="availabilityDay">
                                    <div className="dayIcon">
                                        {isAvailable ? "✅" : "⛔"}
                                    </div>

                                    <div>
                                        <strong>Appointment Booking</strong>
                                        <span>
                                            {isAvailable
                                                ? "Patients can currently book appointments."
                                                : "Appointment booking is currently disabled."}
                                        </span>
                                    </div>
                                </div>

                                <span
                                    className={isAvailable ? "availabilityItemStatus availableText" : "availabilityItemStatus unavailableText"}
                                >
                                    {isAvailable ? "AVAILABLE" : "UNAVAILABLE"}
                                </span>

                            </div>

                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
}

export default Availability;