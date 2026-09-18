import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <div className="hero">

                <div>
                    <p className="eyebrow">SMART HEALTHCARE</p>

                    <h1>
                        Your Health,
                        <br />
                        <span>Smarter with AI</span>
                    </h1>

                    <p className="lead">
                        Modern healthcare made simple for patients and doctors.
                        Manage appointments, medical records and get intelligent
                        health assistance in one place.
                    </p>

                    <Link to="/register" className="primary">
                        Get Started
                    </Link>
                </div>

                <div className="heroCard">

                    <div className="pulse">♥</div>

                    <h2>Smart Healthcare</h2>

                    <p>
                        AI-powered healthcare designed around you.
                    </p>

                    <div className="heroFeatures">

                        <div>
                            <span>🤖</span>
                            <p>AI Health Assistance</p>
                        </div>

                        <div>
                            <span>📅</span>
                            <p>Easy Appointments</p>
                        </div>

                        <div>
                            <span>🩺</span>
                            <p>Find Doctors</p>
                        </div>

                    </div>

                </div>

            </div>

            <section className="features">

                <div className="featureCard">
                    <div className="featureIcon">🩺</div>

                    <h3>Find Doctors</h3>

                    <p>
                        Find the right doctor and explore healthcare
                        professionals.
                    </p>
                </div>

                <div className="featureCard">
                    <div className="featureIcon">📅</div>

                    <h3>Book Appointments</h3>

                    <p>
                        Schedule and manage your doctor appointments easily.
                    </p>
                </div>

                <div className="featureCard">
                    <div className="featureIcon">🤖</div>

                    <h3>AI Symptom Checker</h3>

                    <p>
                        Get intelligent health guidance based on your
                        symptoms.
                    </p>
                </div>

            </section>

            <footer className="footer">

    <div className="footerBrand">
        <h2>AI Healthcare</h2>
        <p>
            Smart healthcare powered by technology and AI.
        </p>
    </div>

    <div className="footerLinks">
        <h3>Quick Links</h3>

        <Link to="/patient/doctors">Find Doctors</Link>
        <Link to="/patient/appointments">Appointments</Link>
        <Link to="/patient/symptom-checker">AI Symptom Checker</Link>
    </div>

    <div className="footerLinks">
        <h3>For Professionals</h3>

        <Link to="/doctor/dashboard">Doctor Portal</Link>
        <Link to="/admin/dashboard">Admin Portal</Link>
    </div>

</footer>
        </>
    );
}

export default Home;