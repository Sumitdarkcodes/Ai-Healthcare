import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
   

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {

            const response = await api.post("/auth/register", {
                name,
                email,
                password,
                
            });

            console.log("REGISTER RESPONSE:", response.data);

            alert("Registration successful");

            navigate("/login");

        } catch (error) {

            console.log("REGISTER ERROR:", error.response?.data);

            alert(
                error.response?.data?.message ||
                "Registration failed"
            );
        }
    };

    return (
    <div className="authPage">

        <div className="authCard">

            <div className="authHeader">
                <div className="authIcon">♥</div>

                <h1>Create Account</h1>

                <p>
                    Create your AI Healthcare account
                </p>
            </div>

            <form onSubmit={handleRegister} className="authForm">

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
                        placeholder="Create a password"
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

          

                <button type="submit" className="authButton">
                    Create Account
                </button>

            </form>

            <p className="authFooter">
                Already have an account?{" "}
                <Link to="/login">Login</Link>
            </p>

        </div>

    </div>
);
    
}

export default Register;