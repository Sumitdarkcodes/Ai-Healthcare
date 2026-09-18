import { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function DoctorProfile() {

    const [profile, setProfile] = useState(null);

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        specialization: "",
        qualification: "",
        experience: "",
        consultationFee: "",
        about: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {

        const fetchDoctorProfile = async () => {

            try {

                const response = await api.get("/doctors/profile");

                console.log("DOCTOR PROFILE:", response.data);

                const doctor = response.data.doctor;

                const profileData = {
                    name: doctor.userId?.name || "",
                    email: doctor.userId?.email || "",
                    specialization: doctor.specialization || "",
                    qualification: doctor.qualification || "",
                    experience: doctor.experience || "",
                    consultationFee: doctor.consultationFee || "",
                    about: doctor.about || ""
                };

                setProfile(profileData);
                setFormData(profileData);

            } catch (error) {

                console.log(
                    "DOCTOR PROFILE FETCH ERROR:",
                    error.response?.data
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to load doctor profile"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchDoctorProfile();

    }, []);


    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));
    };


    const saveProfile = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);

            const response = await api.patch(
                "/doctors/profile",
                {
                    name: formData.name,
                    email: formData.email,
                    specialization: formData.specialization,
                    qualification: formData.qualification,
                    experience: Number(formData.experience),
                    consultationFee: Number(formData.consultationFee),
                    about: formData.about
                }
            );

            console.log(
                "DOCTOR PROFILE UPDATE:",
                response.data
            );

            const updatedDoctor = response.data.doctor;

            const updatedProfile = {
                name: updatedDoctor.userId?.name || formData.name,
                email: updatedDoctor.userId?.email || formData.email,
                specialization: updatedDoctor.specialization,
                qualification: updatedDoctor.qualification,
                experience: updatedDoctor.experience,
                consultationFee: updatedDoctor.consultationFee,
                about: updatedDoctor.about || ""
            };

            setProfile(updatedProfile);
            setFormData(updatedProfile);
            setIsEditing(false);

            alert(response.data.message);

        } catch (error) {

            console.log(
                "DOCTOR PROFILE UPDATE ERROR:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Failed to update doctor profile"
            );

        } finally {

            setSaving(false);
        }
    };


    const cancelEdit = () => {

        setFormData(profile);
        setIsEditing(false);
    };


    if (loading) {

        return (
            <div>
                <DoctorSidebar />

                <main>
                    <div className="dashboardHeader">

                        <div>
                            <p className="eyebrow">
                                DOCTOR PORTAL
                            </p>

                            <h1>Doctor Profile</h1>

                            <p>
                                Loading your profile...
                            </p>
                        </div>

                        <LogoutButton />

                    </div>
                </main>
            </div>
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

                        <h1>Doctor Profile</h1>

                        <p>
                            Manage your professional information and profile details.
                        </p>
                    </div>

                    <LogoutButton />

                </div>


                {!isEditing ? (

                    <section className="doctorProfileCard">

                        <div className="doctorProfileTop">

                            <div className="doctorProfileAvatar">
                                {profile.name
                                    ? profile.name.charAt(0).toUpperCase()
                                    : "D"}
                            </div>

                            <div>

                                <h2>
                                    {profile.name}
                                </h2>

                                <p>
                                    {profile.specialization}
                                </p>

                            </div>

                        </div>


                        <div className="doctorProfileDetails">

                            <div className="doctorProfileItem">

                                <span>Name</span>

                                <strong>
                                    {profile.name}
                                </strong>

                            </div>


                            <div className="doctorProfileItem">

                                <span>Email</span>

                                <strong>
                                    {profile.email}
                                </strong>

                            </div>


                            <div className="doctorProfileItem">

                                <span>Specialization</span>

                                <strong>
                                    {profile.specialization}
                                </strong>

                            </div>


                            <div className="doctorProfileItem">

                                <span>Qualification</span>

                                <strong>
                                    {profile.qualification}
                                </strong>

                            </div>


                            <div className="doctorProfileItem">

                                <span>Experience</span>

                                <strong>
                                    {profile.experience} years
                                </strong>

                            </div>


                            <div className="doctorProfileItem">

                                <span>Consultation Fee</span>

                                <strong>
                                    ₹{profile.consultationFee}
                                </strong>

                            </div>


                            <div className="doctorProfileItem">

                                <span>About</span>

                                <strong>
                                    {profile.about || "Not provided"}
                                </strong>

                            </div>

                        </div>


                        <button
                            className="editDoctorProfileButton"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>

                    </section>

                ) : (

                    <section className="doctorProfileEditCard">

                        <div className="doctorProfileEditHeader">

                            <h2>
                                Edit Profile
                            </h2>

                            <p>
                                Update your professional information.
                            </p>

                        </div>


                        <form
                            className="doctorProfileForm"
                            onSubmit={saveProfile}
                        >

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


                            <div className="doctorProfileActions">

                                <button
                                    type="submit"
                                    className="saveDoctorProfileButton"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}
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