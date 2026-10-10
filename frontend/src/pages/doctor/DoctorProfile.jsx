import { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function DoctorProfile() {
    const [profile, setProfile] = useState(null);         // current saved data
    const [isEditing, setIsEditing] = useState(false);    // view vs edit mode
    const [saving, setSaving] = useState(false);          // disables Save during request
    const [loading, setLoading] = useState(true);         // shows loading screen
    const [error, setError] = useState("");               // shows error on page
    const [success, setSuccess] = useState("");           // shows success message

    // form fields for edit mode
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        specialization: "",
        qualification: "",
        experience: "",
        consultationFee: "",
        about: ""
    });

    // runs once when the page loads
    useEffect(() => {
        // fetch doctor profile from backend
        const fetchDoctorProfile = async () => {
            try {
                const response = await api.get("/doctors/profile");
                const doctor = response.data.doctor;

                // flatten the populated userId fields into one object
                const profileData = {
                    name: doctor.userId?.name || "",
                    email: doctor.userId?.email || "",
                    specialization: doctor.specialization || "",
                    qualification: doctor.qualification || "",
                    experience: doctor.experience || "",
                    consultationFee: doctor.consultationFee || "",
                    about: doctor.about || ""
                };

                setProfile(profileData);                  // save for view mode
                setFormData(profileData);                 // pre-fill edit form
            } catch (error) {
                setError(
                    error.response?.data?.message || "Failed to load doctor profile"
                );
            } finally {
                setLoading(false);                        // done either way
            }
        };

        fetchDoctorProfile();
    }, []);

    // update form when any input changes
    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,                              // keep other fields
            [name]: value                                 // update changed one
        }));
    };

    // save changes to backend
    const saveProfile = async (event) => {
        event.preventDefault();                           // stop page reload

        setError("");                                     // clear old messages
        setSuccess("");
        setSaving(true);

        try {
            const response = await api.patch("/doctors/profile", {
                name: formData.name,
                email: formData.email,
                specialization: formData.specialization,
                qualification: formData.qualification,
                experience: Number(formData.experience),         // cast to number
                consultationFee: Number(formData.consultationFee),
                about: formData.about
            });

            const updatedDoctor = response.data.doctor;

            // rebuild the flattened profile object
            const updatedProfile = {
                name: updatedDoctor.userId?.name || formData.name,
                email: updatedDoctor.userId?.email || formData.email,
                specialization: updatedDoctor.specialization,
                qualification: updatedDoctor.qualification,
                experience: updatedDoctor.experience,
                consultationFee: updatedDoctor.consultationFee,
                about: updatedDoctor.about || ""
            };

            setProfile(updatedProfile);                   // update view mode
            setFormData(updatedProfile);                  // update form
            setIsEditing(false);                          // close edit mode
            setSuccess("Profile updated successfully");   // show message
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to update doctor profile"
            );
        } finally {
            setSaving(false);                             // re-enable buttons
        }
    };

    // cancel editing and reset form
    const cancelEdit = () => {
        setFormData(profile);                             // restore saved values
        setIsEditing(false);                              // close edit mode
    };

    // show loading screen while fetching
    if (loading) {
        return (
            <div>
                <DoctorSidebar />

                <main>

                    {/* page title + logout button */}
                    <div className="dashboardHeader">
                        <div>
                            <p className="eyebrow">DOCTOR PORTAL</p>
                            <h1>Doctor Profile</h1>
                            <p>Loading your profile...</p>
                        </div>

                        <LogoutButton />
                    </div>
                </main>
            </div>
        );
    }

    // if profile doesn't exist or fetch failed
    if (!profile) {
        return (
            <div>
                <DoctorSidebar />

                <main>

                    {/* page title + logout button */}
                    <div className="dashboardHeader">
                        <div>
                            <p className="eyebrow">DOCTOR PORTAL</p>
                            <h1>Doctor Profile</h1>
                            <p>Manage your professional information and profile details.</p>
                        </div>

                        <LogoutButton />
                    </div>

                    {/* error message */}
                    <p className="error">{error || "Your doctor profile has not been created yet."}</p>
                </main>
            </div>
        );
    }

    return (
        <div>
            <DoctorSidebar />

            <main>

                {/* page title + logout button */}
                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">DOCTOR PORTAL</p>
                        <h1>Doctor Profile</h1>
                        <p>Manage your professional information and profile details.</p>
                    </div>

                    <LogoutButton />
                </div>

                {/* messages shown on page (not as alerts) */}
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                {!isEditing ? (
                    // view mode - read-only display
                    <section className="doctorProfileCard">

                        {/* avatar + name + specialization */}
                        <div className="doctorProfileTop">
                            <div className="doctorProfileAvatar">
                                {profile.name ? profile.name.charAt(0).toUpperCase() : "D"}
                            </div>

                            <div>
                                <h2>{profile.name}</h2>
                                <p>{profile.specialization}</p>
                            </div>
                        </div>

                        {/* details list */}
                        <div className="doctorProfileDetails">

                            <div className="doctorProfileItem">
                                <span>Name</span>
                                <strong>{profile.name}</strong>
                            </div>

                            <div className="doctorProfileItem">
                                <span>Email</span>
                                <strong>{profile.email}</strong>
                            </div>

                            <div className="doctorProfileItem">
                                <span>Specialization</span>
                                <strong>{profile.specialization}</strong>
                            </div>

                            <div className="doctorProfileItem">
                                <span>Qualification</span>
                                <strong>{profile.qualification}</strong>
                            </div>

                            <div className="doctorProfileItem">
                                <span>Experience</span>
                                <strong>{profile.experience} years</strong>
                            </div>

                            <div className="doctorProfileItem">
                                <span>Consultation Fee</span>
                                <strong>₹{profile.consultationFee}</strong>
                            </div>

                            <div className="doctorProfileItem">
                                <span>About</span>
                                <strong>{profile.about || "Not provided"}</strong>
                            </div>

                        </div>

                        {/* switch to edit mode */}
                        <button
                            className="editDoctorProfileButton"
                            onClick={() => {
                                setIsEditing(true);
                                setError("");
                                setSuccess("");
                            }}
                        >
                            Edit Profile
                        </button>

                    </section>
                ) : (
                    // edit mode - form
                    <section className="doctorProfileEditCard">

                        {/* form header */}
                        <div className="doctorProfileEditHeader">
                            <h2>Edit Profile</h2>
                            <p>Update your professional information.</p>
                        </div>

                        <form className="doctorProfileForm" onSubmit={saveProfile}>

                            <div className="doctorProfileFormGroup">
                                <label>Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>

                            <div className="doctorProfileFormGroup">
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div className="doctorProfileFormGroup">
                                <label>Specialization</label>
                                <input
                                    type="text"
                                    name="specialization"
                                    value={formData.specialization}
                                    onChange={handleChange}
                                    placeholder="Enter specialization"
                                    required
                                />
                            </div>

                            <div className="doctorProfileFormGroup">
                                <label>Qualification</label>
                                <input
                                    type="text"
                                    name="qualification"
                                    value={formData.qualification}
                                    onChange={handleChange}
                                    placeholder="Enter qualification"
                                    required
                                />
                            </div>

                            <div className="doctorProfileFormGroup">
                                <label>Experience</label>
                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    placeholder="Years of experience"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="doctorProfileFormGroup">
                                <label>Consultation Fee</label>
                                <input
                                    type="number"
                                    name="consultationFee"
                                    value={formData.consultationFee}
                                    onChange={handleChange}
                                    placeholder="Enter consultation fee"
                                    min="0"
                                    required
                                />
                            </div>

                            <div className="doctorProfileFormGroup">
                                <label>About</label>
                                <textarea
                                    name="about"
                                    value={formData.about}
                                    onChange={handleChange}
                                    placeholder="Tell patients about yourself"
                                ></textarea>
                            </div>

                            {/* save + cancel buttons */}
                            <div className="doctorProfileActions">

                                <button
                                    type="submit"
                                    className="saveDoctorProfileButton"
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>

                                <button
                                    type="button"
                                    className="cancelDoctorProfileButton"
                                    onClick={cancelEdit}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>

                    </section>
                )}
            </main>
        </div>
    );
}

export default DoctorProfile;