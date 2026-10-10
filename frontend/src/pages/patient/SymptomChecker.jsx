import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function SymptomChecker() {
    const [symptoms, setSymptoms] = useState("");         // text user typed
    const [result, setResult] = useState(null);           // AI response
    const [loading, setLoading] = useState(false);        // disables form during request
    const [error, setError] = useState("");               // shows error on page

    // runs when the "Check Symptoms" button is clicked
    const checkSymptoms = async () => {
        setError("");                                     // clear old error
        setResult(null);                                  // clear old result

        // validate input before sending
        if (!symptoms.trim()) {
            setError("Please enter your symptoms.");
            return;
        }

        try {
            setLoading(true);                             // show loading state

            const response = await api.post(
                "/ai/symptom-check",
                { symptoms: symptoms.trim() }             // trim before sending
            );

            setResult(response.data);                     // save AI response
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to analyze symptoms."
            );
        } finally {
            setLoading(false);                            // re-enable form
        }
    };

    return (
        <div>
            <Sidebar />

            <main>

                {/* page title + logout button */}
                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">AI HEALTH ASSISTANT</p>
                        <h1>AI Symptom Checker</h1>
                        <p>
                            Describe your symptoms and get an initial
                            recommendation for the right medical specialty.
                        </p>
                    </div>

                    <LogoutButton />
                </div>

                <section className="symptomSection">

                    {/* input card - symptoms textarea + button */}
                    <div className="symptomCard">

                        <div className="symptomIcon">🤖</div>      {/* robot icon */}

                        <h2>How are you feeling?</h2>
                        <p>
                            Tell us about your symptoms. Our AI assistant
                            will suggest which type of doctor may be appropriate.
                        </p>

                        {/* symptoms textarea */}
                        <textarea
                            value={symptoms}
                            onChange={(e) => setSymptoms(e.target.value)}
                            placeholder="Example: I have fever, headache and cough..."
                            rows="7"
                            disabled={loading}                // disable while loading
                        />

                        {/* error message shown on page */}
                        {error && <p className="error">{error}</p>}

                        {/* submit button - shows loading text while fetching */}
                        <button
                            className="checkSymptomsButton"
                            onClick={checkSymptoms}
                            disabled={loading}
                        >
                            {loading ? "Analyzing Symptoms..." : "Check Symptoms"}
                        </button>

                        {/* disclaimer at the bottom */}
                        <div className="symptomDisclaimer">
                            <span>ℹ️</span>
                            <p>
                                This tool provides general guidance and is not
                                a substitute for professional medical advice.
                            </p>
                        </div>

                    </div>

                    {/* result card - shows only after a successful check */}
                    {result && (
                        <div className="symptomResult">

                            {/* result header with icon */}
                            <div className="resultHeader">
                                <div className="resultIcon">
                                    {result.urgent ? "⚠️" : "✓"}      {/* warning or check */}
                                </div>

                                <div>
                                    <h2>Recommendation</h2>
                                    <p>Based on the symptoms you entered</p>
                                </div>
                            </div>

                            {/* specialty + urgency details */}
                            <div className="resultDetails">

                                <div className="resultItem">
                                    <span>Recommended Specialty</span>
                                    <strong>
                                        {result.recommendedSpecialty || "Not available"}
                                    </strong>
                                </div>

                                <div className="resultItem">
                                    <span>Urgency</span>
                                    <strong className={result.urgent ? "urgencyHigh" : "urgencyLow"}>
                                        {result.urgent ? "High" : "Normal"}
                                    </strong>
                                </div>

                            </div>

                            {/* AI's main recommendation text */}
                            <div className="recommendationBox">
                                <strong>Recommendation</strong>
                                <p>
                                    {result.urgent
                                        ? result.recommendation
                                        : result.aiRecommendation ||
                                          result.recommendation ||
                                          "Please consult a doctor for proper evaluation."}
                                </p>
                            </div>

                            {/* what the user typed, echoed back */}
                            <div className="recommendationBox">
                                <strong>Symptoms Entered</strong>
                                <p>{result.symptoms || symptoms}</p>
                            </div>

                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default SymptomChecker;