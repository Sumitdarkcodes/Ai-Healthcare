import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";                    // our axios instance

function Register() {
    const [name, setName] = useState("");                // name input value
    const [email, setEmail] = useState("");              // email input value
    const [password, setPassword] = useState("");        // password input value

    const [role, setRole] = useState("patient");         // "patient" or "doctor"
    const [error, setError] = useState("");              // error message shown on page
    const [loading, setLoading] = useState(false);       // disables button during request

    const navigate = useNavigate();                      // used to redirect after register

    // runs when the form is submitted
    const handleRegister = async (e) => {
        e.preventDefault();                              // stop page from reloading

        setError("");                                    // clear old error
        setLoading(true);                                // show loading state

        // pick endpoint based on role
        // patient -> /register  |  doctor -> /register-doctor
        const endpoint =
            role === "doctor" ? "/auth/register-doctor" : "/auth/register";

        try {
            await api.post(endpoint, { name, email, password });

            // registration doesn't log user in, send them to login page
            navigate("/login");
        } catch (error) {
            // show backend error message, or a fallback
            setError(
                error.response?.data?.message || "Registration failed"
            );
        } finally {
            setLoading(false);                           // done loading either way
        }
    };

    return (
        <div className="authPage">
            <div className="authCard">

                {/* header with icon and title */}
                <div className="authHeader">
                    <div className="authIcon">♥</div>
                    <h1>Create Account</h1>
                    <p>Create your AI Healthcare account</p>
                </div>

                <form onSubmit={handleRegister} className="authForm">

                    {/* show error only when it exists */}
                    {error && <p className="error">{error}</p>}

                    {/* role dropdown - patient or doctor */}
                    <div className="formGroup">
                        <label>I am a</label>
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                        </select>
                    </div>

                    {/* name input */}
                    <div className="formGroup">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* email input */}
                    <div className="formGroup">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            autoComplete="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* password input - min 8 matches backend rule */}
                    <div className="formGroup">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Create a password (min 8 characters)"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength={8}
                            required
                        />
                    </div>

                    {/* submit button - disabled while loading */}
                    <button
                        type="submit"
                        className="authButton"
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Account"}
                    </button>
                </form>

                {/* link to login page */}
                <p className="authFooter">
                    Already have an account?{" "}
                    <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;