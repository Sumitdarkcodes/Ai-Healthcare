import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function Profile() {
    const [profile, setProfile] = useState(null);         // data from backend (null if not created yet)
    const [formData, setFormData] = useState({            // form fields for create/edit
        age: "",
        gender: "",
        phone: "",
        address: ""
    });

    const [loading, setLoading] = useState(true);         // shows loading screen
    const [saving, setSaving] = useState(false);          // disables buttons during request
    const [error, setError] = useState("");               // shows error on page
    const [success, setSuccess] = useState("");           // shows success message
    const [isEditing, setIsEditing] = useState(false);    // edit mode toggle

    // runs once when the page loads
    useEffect(() => {
        // fetch patient profile from backend
        const fetchProfile = async () => {
            try {
                const response = await api.get("/patients/profile");
                const patient = response.data.patient;

                setProfile(patient);                       // save full patient object

                // pre-fill the form
                setFormData({
                    age: patient.age || "",
                    gender: patient.gender || "",
                    phone: patient.phone || "",
                    address: patient.address || ""
                });
            } catch {
                // if profile doesn't exist yet, we'll show the create form
                // (leave profile as null - the UI handles it)
                setProfile(null);
            } finally {
                setLoading(false);                         // done either way
            }
        };

        fetchProfile();
    }, []);

    // update form state when an input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,                                   // keep other fields
            [e.target.name]: e.target.value                // update changed one
        });
    };

    // create a brand new patient profile (first time only)
    const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
        // create the profile
        await api.post("/patients/profile", formData);

        // refetch so userId is populated with name + email
        const response = await api.get("/patients/profile");
        setProfile(response.data.patient);

        setSuccess("Profile created successfully");
    } catch (err) {
        setError(err.response?.data?.message || "Failed to create profile");
    } finally {
        setSaving(false);
    }
};

    // save changes to backend (when editing existing profile)
   const handleSave = async () => {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
        // update the profile
        await api.patch("/patients/profile", formData);

        // refetch so userId is populated with name + email
        const response = await api.get("/patients/profile");
        setProfile(response.data.patient);

        setIsEditing(false);                           // close edit mode
        setSuccess("Profile updated successfully");    // show success
    } catch (err) {
        setError(err.response?.data?.message || "Failed to update profile");
    } finally {
        setSaving(false);
    }
};

    // cancel editing - reset form to current profile data
    const handleCancel = () => {
        setFormData({
            age: profile.age || "",
            gender: profile.gender || "",
            phone: profile.phone || "",
            address: profile.address || ""
        });
        setIsEditing(false);                               // close edit mode
    };

    // show loading screen while fetching
    if (loading) {
        return (
            <div>
                <Sidebar />

                <main>
                    <p>Loading profile...</p>
                </main>
            </div>
        );
    }

    // if no patient profile exists yet - show create form
    if (!profile) {
        return (
            <div>
                <Sidebar />

                <main>

                    {/* page title + logout button */}
                    <div className="dashboardHeader">
                        <div>
                            <p className="eyebrow">PATIENT PORTAL</p>
                            <h1>My Profile</h1>
                            <p>Create your profile to get started.</p>
                        </div>

                        <LogoutButton />
                    </div>

                    <section className="profileEditCard">

                        {/* form header */}
                        <div className="profileEditHeader">
                            <h2>Create Profile</h2>
                            <p>Fill in your details to complete your profile.</p>
                        </div>

                        {/* error message if any */}
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}

                        <form className="profileForm" onSubmit={handleCreate}>

                            {/* age input */}
                            <div className="profileFormGroup">
                                <label>Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="Enter your age"
                                    min="0"
                                />
                            </div>

                            {/* gender dropdown */}
                            <div className="profileFormGroup">
                                <label>Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* phone input */}
                            <div className="profileFormGroup">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            {/* address input */}
                            <div className="profileFormGroup">
                                <label>Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your address"
                                />
                            </div>

                        </form>

                        {/* create button - disabled while creating */}
                        <div className="profileActions">
                            <button
                                className="saveProfileButton"
                                onClick={handleCreate}
                                disabled={saving}
                            >
                                {saving ? "Creating..." : "Create Profile"}
                            </button>
                        </div>

                    </section>
                </main>
            </div>
        );
    }

    // profile exists - show read-only or edit view
    return (
        <div>
            <Sidebar />

            <main>

                {/* page title + logout button */}
                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">PATIENT PORTAL</p>
                        <h1>My Profile</h1>
                        <p>Manage your personal information and account details.</p>
                    </div>

                    <LogoutButton />
                </div>

                {/* messages shown on page */}
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}

                {!isEditing ? (
                    // read-only view
                    <section className="profileCard">

                        {/* avatar + name + role */}
                        <div className="profileTop">
                            <div className="profileAvatar">
                                {(profile.userId?.name || "P").charAt(0)}   {/* first letter */}
                            </div>

                            <div>
                                <h2>{profile.userId?.name || "Patient"}</h2>
                                <p>Patient</p>
                            </div>
                        </div>

                        {/* details list */}
                        <div className="profileDetails">

                            <div className="profileItem">
                                <span>Full Name</span>
                                <strong>{profile.userId?.name || "Not set"}</strong>
                            </div>

                            <div className="profileItem">
                                <span>Email</span>
                                <strong>{profile.userId?.email || "Not set"}</strong>
                            </div>

                            <div className="profileItem">
                                <span>Phone</span>
                                <strong>{profile.phone || "Not set"}</strong>
                            </div>

                            <div className="profileItem">
                                <span>Age</span>
                                <strong>{profile.age || "Not set"}</strong>
                            </div>

                            <div className="profileItem">
                                <span>Gender</span>
                                <strong>{profile.gender || "Not set"}</strong>
                            </div>

                            <div className="profileItem">
                                <span>Address</span>
                                <strong>{profile.address || "Not set"}</strong>
                            </div>

                            <div className="profileItem">
                                <span>Role</span>
                                <strong>Patient</strong>
                            </div>

                        </div>

                        {/* edit button */}
                        <button
                            className="editProfileButton"
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
                    <section className="profileEditCard">

                        {/* form header */}
                        <div className="profileEditHeader">
                            <h2>Edit Profile</h2>
                            <p>Update your personal information.</p>
                        </div>

                        <div className="profileForm">

                            {/* name - read only (backend doesn't allow updates) */}
                            <div className="profileFormGroup">
                                <label>Name (cannot be changed)</label>
                                <input
                                    type="text"
                                    value={profile.userId?.name || ""}
                                    disabled
                                />
                            </div>

                            {/* email - read only */}
                            <div className="profileFormGroup">
                                <label>Email (cannot be changed)</label>
                                <input
                                    type="email"
                                    value={profile.userId?.email || ""}
                                    disabled
                                />
                            </div>

                            {/* phone - editable */}
                            <div className="profileFormGroup">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            {/* age - editable */}
                            <div className="profileFormGroup">
                                <label>Age</label>
                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                    placeholder="Enter your age"
                                />
                            </div>

                            {/* gender - editable */}
                            <div className="profileFormGroup">
                                <label>Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            {/* address - editable */}
                            <div className="profileFormGroup">
                                <label>Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your address"
                                />
                            </div>

                        </div>

                        {/* save + cancel buttons */}
                        <div className="profileActions">

                            <button
                                className="saveProfileButton"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>

                            <button
                                className="cancelProfileButton"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                        </div>

                    </section>
                )}
            </main>
        </div>
    );
}

export default Profile;