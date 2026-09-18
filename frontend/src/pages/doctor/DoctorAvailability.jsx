import { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function Availability() {

    const [isAvailable, setIsAvailable] = useState(false);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);


    // Fetch current doctor availability
    useEffect(() => {

        const fetchAvailability = async () => {

            try {

                const response = await api.get("/doctors/profile");

                console.log(
                    "DOCTOR PROFILE:",
                    response.data
                );

                setIsAvailable(
                    response.data.doctor.isAvailable
                );

            } catch (error) {

                console.log(
                    "AVAILABILITY FETCH ERROR:",
                    error.response?.data
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to load availability"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchAvailability();

    }, []);


    // Update doctor availability
    const updateAvailability = async () => {

        try {

            setUpdating(true);

            const newAvailability = !isAvailable;

            const response = await api.patch(
                "/doctors/availability",
                {
                    isAvailable: newAvailability
                }
            );

            console.log(
                "AVAILABILITY UPDATE:",
                response.data
            );

            setIsAvailable(
                response.data.doctor.isAvailable
            );

            alert(
                response.data.message
            );

        } catch (error) {

            console.log(
                "AVAILABILITY UPDATE ERROR:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Failed to update availability"
            );

        } finally {

            setUpdating(false);
        }
    };


    return (
        <div>

            <DoctorSidebar />

            <main>

                <div className="dashboardHeader">

                    <div>

                        <p className="eyebrow">
                            DOCTOR PORTAL
                        </p>

                        <h1>Doctor Availability</h1>

                        <p>
                            Manage your consultation availability.
                        </p>

                    </div>

                    <LogoutButton />

                </div>


                <section className="availabilityLayout">

                    {/* AVAILABILITY STATUS */}

                    <div className="availabilityFormCard">

                        <div className="availabilityHeader">

                            <div className="availabilityIcon">
                                🕐
                            </div>

                            <div>

                                <h2>
                                    Availability Status
                                </h2>

                                <p>
                                    Control whether patients can book
                                    appointments with you.
                                </p>

                            </div>

                        </div>


                        {loading ? (

                            <div className="availabilityLoading">

                                <p>
                                    Loading availability...
                                </p>

                            </div>

                        ) : (

                            <div className="availabilityStatusContent">

                                <div className="availabilityStatus">

                                    <div
                                        className={
                                            isAvailable
                                                ? "availabilityStatusDot available"
                                                : "availabilityStatusDot unavailable"
                                        }
                                    >
                                    </div>

                                    <div>

                                        <strong>
                                            {
                                                isAvailable
                                                    ? "You are Available"
                                                    : "You are Unavailable"
                                            }
                                        </strong>

                                        <span>
                                            {
                                                isAvailable
                                                    ? "Patients can book appointments with you."
                                                    : "Patients cannot book appointments with you."
                                            }
                                        </span>

                                    </div>

                                </div>


                                <button
                                    className={
                                        isAvailable
                                            ? "availabilityToggleButton unavailableButton"
                                            : "availabilityToggleButton availableButton"
                                    }
                                    onClick={updateAvailability}
                                    disabled={updating}
                                >

                                    {updating
                                        ? "Updating..."
                                        : isAvailable
                                            ? "Set Unavailable"
                                            : "Set Available"
                                    }

                                </button>

                            </div>

                        )}

                    </div>


                    {/* CURRENT STATUS */}

                    <div className="availabilityListCard">

                        <div className="availabilityListHeader">

                            <div>

                                <h2>
                                    Current Status
                                </h2>

                                <p>
                                    Your current appointment booking status.
                                </p>

                            </div>

                            <span
                                className={
                                    isAvailable
                                        ? "availabilityCount availableCount"
                                        : "availabilityCount unavailableCount"
                                }
                            >
                                {
                                    isAvailable
                                        ? "Available"
                                        : "Unavailable"
                                }
                            </span>

                        </div>


                        <div className="availabilityList">

                            <div className="availabilityItem">

                                <div className="availabilityDay">

                                    <div className="dayIcon">
                                        {
                                            isAvailable
                                                ? "✅"
                                                : "⛔"
                                        }
                                    </div>

                                    <div>

                                        <strong>
                                            Appointment Booking
                                        </strong>

                                        <span>
                                            {
                                                isAvailable
                                                    ? "Patients can currently book appointments."
                                                    : "Appointment booking is currently disabled."
                                            }
                                        </span>

                                    </div>

                                </div>


                                <span
                                    className={
                                        isAvailable
                                            ? "availabilityItemStatus availableText"
                                            : "availabilityItemStatus unavailableText"
                                    }
                                >
                                    {
                                        isAvailable
                                            ? "AVAILABLE"
                                            : "UNAVAILABLE"
                                    }
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