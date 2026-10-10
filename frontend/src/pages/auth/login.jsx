import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");              // shows error on page
    const [loading, setLoading] = useState(false);       // disables button during request

    const { login } = useAuth();                         // login function from context
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");                                    // clear old error
        setLoading(true);

        try {
            // login() saves user to context automatically
            const user = await login(email, password);

            // send to dashboard based on role
            if (user.role === "patient") {
                navigate("/patient/dashboard");
            } else if (user.role === "doctor") {
                navigate("/doctor/dashboard");
            } else if (user.role === "admin") {
                navigate("/admin/dashboard");
            }
        } catch (error) {
            // show backend error message, or a fallback
            setError(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="authPage">
            <div className="authCard">
                <div className="authHeader">
                    <div className="authIcon">♥</div>
                    <h1>Welcome Back</h1>
                    <p>Login to your AI Healthcare account</p>
                </div>

                <form onSubmit={handleLogin} className="authForm">
                    {/* error message shows here if login fails */}
                    {error && <p className="error">{error}</p>}

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

                    {/* disable button while request is running */}
                    <button
                        type="submit"
                        className="authButton"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
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