import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {

            const response = await api.post("/auth/login", {
                email,
                password
            });

            console.log("LOGIN RESPONSE:", response.data);

            // Get logged-in user's role
            const profileResponse = await api.get("/auth/profile");

            const user = profileResponse.data.user;

            console.log("LOGGED IN USER:", user);

            if (user.role === "patient") {
                navigate("/patient/dashboard");
            }
            else if (user.role === "doctor") {
                navigate("/doctor/dashboard");
            }
            else if (user.role === "admin") {
                navigate("/admin/dashboard");
            }

        } catch (error) {

            console.log("LOGIN ERROR:", error.response?.data);

            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        
    <div className="authPage">

        <div className="authCard">

            <div className="authHeader">
                <div className="authIcon">♥</div>

                <h1>Welcome Back</h1>

                <p>
                    Login to your AI Healthcare account
                </p>
            </div>

            <form onSubmit={handleLogin} className="authForm">

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

                <div className="formGroup">
                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="authButton">
                    Login
                </button>

            </form>

            <p className="authFooter">
                Don't have an account?{" "}
                <Link to="/register">Create an account</Link>
            </p>

        </div>

    </div>
);
    
}

export default Login;