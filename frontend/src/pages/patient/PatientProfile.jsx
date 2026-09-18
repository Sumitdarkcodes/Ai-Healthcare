import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";

function Profile() {

    const [profile, setProfile] = useState({
        name: "Rahul Sharma",
        email: "rahul@gmail.com",
        phone: "9876543210",
        age: 30,
        gender: "Male"
    });

    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState(profile);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        setProfile(formData);
        setIsEditing(false);

        alert("Profile updated successfully");
    };

    const handleCancel = () => {
        setFormData(profile);
        setIsEditing(false);
    };

    return (
        <div>

            <Sidebar />

            <main>

                <div className="dashboardHeader">

                    <div>
                        <p className="eyebrow">PATIENT PORTAL</p>

                        <h1>My Profile</h1>

                        <p>
                            Manage your personal information and account details.
                        </p>
                    </div>

                    <LogoutButton />

                </div>


                {!isEditing ? (

                    <section className="profileCard">

                        <div className="profileTop">

                            <div className="profileAvatar">
                                {profile.name.charAt(0)}
                            </div>

                            <div>
                                <h2>{profile.name}</h2>

                                <p>Patient</p>
                            </div>

                        </div>


                        <div className="profileDetails">

                            <div className="profileItem">
                                <span>Full Name</span>
                                <strong>{profile.name}</strong>
                            </div>

                            <div className="profileItem">
                                <span>Email</span>
                                <strong>{profile.email}</strong>
                            </div>

                            <div className="profileItem">
                                <span>Phone</span>
                                <strong>{profile.phone}</strong>
                            </div>

                            <div className="profileItem">
                                <span>Age</span>
                                <strong>{profile.age}</strong>
                            </div>

                            <div className="profileItem">
                                <span>Gender</span>
                                <strong>{profile.gender}</strong>
                            </div>

                            <div className="profileItem">
                                <span>Role</span>
                                <strong>Patient</strong>
                            </div>

                        </div>


                        <button
                            className="editProfileButton"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>

                    </section>

                ) : (

                    <section className="profileEditCard">

                        <div className="profileEditHeader">
                            <h2>Edit Profile</h2>

                            <p>
                                Update your personal information.
                            </p>
                        </div>


                        <div className="profileForm">

                            <div className="profileFormGroup">
                                <label>Name</label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>


                            <div className="profileFormGroup">
                                <label>Email</label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>


                            <div className="profileFormGroup">
                                <label>Phone</label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>


                            <div className="profileFormGroup">
                                <label>Age</label>

                                <input
                                    type="number"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleChange}
                                />
                            </div>


                            <div className="profileFormGroup">
                                <label>Gender</label>

                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                        </div>


                        <div className="profileActions">

                            <button
                                className="saveProfileButton"
                                onClick={handleSave}
                            >
                                Save Changes
                            </button>

                            <button
                                className="cancelProfileButton"
                                onClick={handleCancel}
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