
import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function SymptomChecker() {

    const [symptoms, setSymptoms] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const checkSymptoms = async () => {

        if (!symptoms.trim()) {
            alert("Please enter your symptoms.");
            return;
        }

        try {

            setLoading(true);
            setResult(null);

            const response = await api.post(
                "/ai/symptom-check",
                {
                    symptoms: symptoms.trim()
                }
            );

            console.log(
                "AI SYMPTOM CHECK:",
                response.data
            );

            setResult(response.data);

        } catch (error) {

            console.log(
                "AI SYMPTOM CHECK ERROR:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Failed to analyze symptoms."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div>

            <Sidebar />

            <main>

                <div className="dashboardHeader">

                    <div>

                        <p className="eyebrow">
                            AI HEALTH ASSISTANT
                        </p>

                        <h1>
                            AI Symptom Checker
                        </h1>

                        <p>
                            Describe your symptoms and get an initial
                            recommendation for the right medical specialty.
                        </p>

                    </div>

                    <LogoutButton />

                </div>


                <section className="symptomSection">

                    <div className="symptomCard">

                        <div className="symptomIcon">
                            🤖
                        </div>

                        <h2>
                            How are you feeling?
                        </h2>

                        <p>
                            Tell us about your symptoms. Our AI assistant
                            will suggest which type of doctor may be appropriate.
                        </p>

                        <textarea
                            value={symptoms}
                            onChange={(e) =>
                                setSymptoms(e.target.value)
                            }
                            placeholder="Example: I have fever, headache and cough..."
                            rows="7"
                            disabled={loading}
                        />

                        <button
                            className="checkSymptomsButton"
                            onClick={checkSymptoms}
                            disabled={loading}
                        >
                            {loading
                                ? "Analyzing Symptoms..."
                                : "Check Symptoms"
                            }
                        </button>

                        <div className="symptomDisclaimer">

                            <span>
                                ℹ️
                            </span>

                            <p>
                                This tool provides general guidance and is not
                                a substitute for professional medical advice.
                            </p>

                        </div>

                    </div>


                    {result && (

                        <div className="symptomResult">

                            <div className="resultHeader">

                                <div className="resultIcon">
                                    {result.urgent ? "⚠️" : "✓"}
                                </div>

                                <div>

                                    <h2>
                                        Recommendation
                                    </h2>

                                    <p>
                                        Based on the symptoms you entered
                                    </p>

                                </div>

                            </div>


                            <div className="resultDetails">

                                <div className="resultItem">

                                    <span>
                                        Recommended Specialty
                                    </span>

                                    <strong>
                                        {result.recommendedSpecialty ||
                                            "Not available"
                                        }
                                    </strong>

                                </div>


                                <div className="resultItem">

                                    <span>
                                        Urgency
                                    </span>

                                    <strong
                                        className={
                                            result.urgent
                                                ? "urgencyHigh"
                                                : "urgencyLow"
                                        }
                                    >
                                        {result.urgent
                                            ? "High"
                                            : "Normal"
                                        }
                                    </strong>

                                </div>

                            </div>


                            <div className="recommendationBox">

                                <strong>
                                    Recommendation
                                </strong>

                                <p>
                                    {
                                        result.urgent
                                            ? result.recommendation
                                            : result.aiRecommendation ||
                                              result.recommendation ||
                                              "Please consult a doctor for proper evaluation."
                                    }
                                </p>

                            </div>


                            <div className="recommendationBox">

                                <strong>
                                    Symptoms Entered
                                </strong>

                                <p>
                                    {result.symptoms || symptoms}
                                </p>

                            </div>

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default SymptomChecker;

