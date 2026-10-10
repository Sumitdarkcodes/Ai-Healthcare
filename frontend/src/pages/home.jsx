import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            {/* hero section - main banner at the top */}
            <div className="hero">

                {/* left side - text + call to action */}
                <div>
                    <p className="eyebrow">SMART HEALTHCARE</p>          {/* small tagline */}

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

                    <Link to="/register" className="primary">            {/* main CTA button */}
                        Get Started
                    </Link>
                </div>

                {/* right side - decorative card with feature highlights */}
                <div className="heroCard">

                    <div className="pulse">♥</div>                        {/* animated heart icon */}

                    <h2>Smart Healthcare</h2>

                    <p>AI-powered healthcare designed around you.</p>

                    {/* small feature list inside the card */}
                    <div className="heroFeatures">

                        <div>
                            <span>🤖</span>                              {/* AI icon */}
                            <p>AI Health Assistance</p>
                        </div>

                        <div>
                            <span>📅</span>                              {/* calendar icon */}
                            <p>Easy Appointments</p>
                        </div>

                        <div>
                            <span>🩺</span>                              {/* stethoscope icon */}
                            <p>Find Doctors</p>
                        </div>

                    </div>
                </div>
            </div>

            {/* features section - three cards showing what the app does */}
            <section className="features">

                <div className="featureCard">
                    <div className="featureIcon">🩺</div>                {/* doctor icon */}
                    <h3>Find Doctors</h3>
                    <p>
                        Find the right doctor and explore healthcare
                        professionals.
                    </p>
                </div>

                <div className="featureCard">
                    <div className="featureIcon">📅</div>                {/* appointment icon */}
                    <h3>Book Appointments</h3>
                    <p>
                        Schedule and manage your doctor appointments easily.
                    </p>
                </div>

                <div className="featureCard">
                    <div className="featureIcon">🤖</div>                {/* AI icon */}
                    <h3>AI Symptom Checker</h3>
                    <p>
                        Get intelligent health guidance based on your
                        symptoms.
                    </p>
                </div>
            </section>

            {/* footer with links */}
            <footer className="footer">

                {/* brand column */}
                <div className="footerBrand">
                    <h2>AI Healthcare</h2>
                    <p>Smart healthcare powered by technology and AI.</p>
                </div>

                {/* quick links column - patients */}
                <div className="footerLinks">
                    <h3>Quick Links</h3>
                    <Link to="/patient/doctors">Find Doctors</Link>
                    <Link to="/patient/appointments">Appointments</Link>
                    <Link to="/patient/symptom-checker">AI Symptom Checker</Link>
                </div>

                {/* professional links column - doctors and admins */}
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