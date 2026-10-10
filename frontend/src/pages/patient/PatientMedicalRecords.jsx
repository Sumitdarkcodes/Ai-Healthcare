import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function MedicalRecords() {
    const [records, setRecords] = useState([]);           // list from backend
    const [loading, setLoading] = useState(true);         // shows loading screen
    const [error, setError] = useState("");               // shows error on page

    const [expandedId, setExpandedId] = useState(null);   // which card is expanded

    // AI summary state
    const [summary, setSummary] = useState("");           // text from Gemini
    const [summaryLoading, setSummaryLoading] = useState(false);   // true while waiting
    const [selectedRecord, setSelectedRecord] = useState(null);    // which record is being summarized

    // runs once when the page loads
    useEffect(() => {
        // fetch patient's medical records from backend
        const fetchMedicalRecords = async () => {
            try {
                const response = await api.get("/medical-records");
                setRecords(response.data.medicalRecords || []);    // save list
            } catch (error) {
                setError(
                    error.response?.data?.message || "Failed to load medical records"    // fallback message
                );
            } finally {
                setLoading(false);                        // done either way
            }
        };

        fetchMedicalRecords();
    }, []);

    // toggle the expanded details of one card
    const toggleDetails = (recordId) => {
        setExpandedId(expandedId === recordId ? null : recordId);   // same card = close, other = open
    };

    // ask AI for a plain-language summary of the record
    const generateSummary = async (record) => {
        try {
            setSummaryLoading(true);
            setSummary("");                               // clear old summary
            setSelectedRecord(record);                    // mark which record

            const response = await api.get(`/ai/medical-summary/${record._id}`);
            setSummary(response.data.summary || "No summary available.");
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to generate medical summary"   // fallback
            );
            setSelectedRecord(null);                      // hide the panel
        } finally {
            setSummaryLoading(false);                     // re-enable buttons
        }
    };

    // close the AI summary panel
    const closeSummary = () => {
        setSummary("");                                   // clear text
        setSelectedRecord(null);                          // hide panel
    };

    // full-page loading screen
    if (loading) {
        return (
            <div>
                <Sidebar />

                <main>

                    {/* page title + logout */}
                    <div className="dashboardHeader">
                        <div>
                            <p className="eyebrow">PATIENT PORTAL</p>
                            <h1>Medical Records</h1>
                            <p>View your medical history, diagnoses and prescriptions.</p>
                        </div>

                        <LogoutButton />
                    </div>

                    {/* simple loading message */}
                    <section className="recordsSection">
                        <p>Loading your medical records...</p>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div>
            <Sidebar />

            <main>

                {/* page title + logout button */}
                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">PATIENT PORTAL</p>
                        <h1>Medical Records</h1>
                        <p>View your medical history, diagnoses and prescriptions.</p>
                    </div>

                    <LogoutButton />
                </div>

                <section className="recordsSection">

                    {/* section header with count */}
                    <div className="recordsHeader">
                        <div>
                            <h2>Medical History</h2>
                            <p>Your previous consultations and medical information.</p>
                        </div>

                        <span className="recordCount">
                            {records.length} Records                    {/* how many records */}
                        </span>
                    </div>

                    {/* show error if fetch failed */}
                    {error && <p className="error">{error}</p>}

                    {records.length === 0 ? (
                        // empty state
                        <div className="doctorEmptyRecords">
                            <span>📋</span>
                            <h3>No medical records found</h3>
                            <p>Your medical records will appear here after a doctor creates them.</p>
                        </div>
                    ) : (
                        <div className="recordsGrid">

                            {records.map((record) => {
                                // pick out what we need from the populated record
                                const doctorName = record.doctorId?.userId?.name || "Doctor";
                                const specialization = record.doctorId?.specialization || "Medical Specialist";
                                const appointmentDate = record.appointmentId?.appointmentDate
                                    ? new Date(record.appointmentId.appointmentDate)
                                    : null;

                                const isExpanded = expandedId === record._id;   // is this card open?

                                return (
                                    <div className="recordCard" key={record._id}>

                                        {/* card header - diagnosis + doctor */}
                                        <div className="recordCardHeader">
                                            <div className="recordIcon">📋</div>      {/* clipboard icon */}

                                            <div>
                                                <h3>{record.diagnosis || "Medical Record"}</h3>
                                                <span>Dr. {doctorName}</span>
                                                <small>{specialization}</small>
                                            </div>
                                        </div>

                                        {/* quick info - date + diagnosis + prescription */}
                                        <div className="recordInfo">
                                            <p>
                                                <strong>Date</strong>
                                                <span>
                                                    {appointmentDate
                                                        ? appointmentDate.toLocaleDateString()
                                                        : "N/A"}
                                                </span>
                                            </p>

                                            <p>
                                                <strong>Diagnosis</strong>
                                                <span>{record.diagnosis || "N/A"}</span>
                                            </p>

                                            <p>
                                                <strong>Prescription</strong>
                                                <span>{record.prescription || "No prescription"}</span>
                                            </p>
                                        </div>

                                        {/* doctor notes */}
                                        <div className="recordNotes">
                                            <strong>Doctor's Notes</strong>
                                            <p>{record.notes || "No medical notes available."}</p>
                                        </div>

                                        {/* expanded details (only when this card is expanded) */}
                                        {isExpanded && (
                                            <div className="recordDetails">
                                                <p>
                                                    <strong>Symptoms</strong>
                                                    <span>{record.symptoms || "N/A"}</span>
                                                </p>

                                                <p>
                                                    <strong>Doctor Email</strong>
                                                    <span>{record.doctorId?.userId?.email || "N/A"}</span>
                                                </p>
                                            </div>
                                        )}

                                        {/* buttons - view details + AI summary */}
                                        <div className="recordActions">

                                            <button
                                                className="viewRecordButton"
                                                onClick={() => toggleDetails(record._id)}
                                            >
                                                {isExpanded ? "Hide Details" : "View Details"}
                                            </button>

                                            <button
                                                className="aiSummaryButton"
                                                onClick={() => generateSummary(record)}
                                                disabled={summaryLoading}
                                            >
                                                {summaryLoading && selectedRecord?._id === record._id
                                                    ? "Generating..."
                                                    : "🤖 AI Summary"}
                                            </button>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}
                </section>

                {/* AI summary panel - only shows when a record is selected */}
                {selectedRecord && (
                    <section className="aiSummarySection">
                        <div className="aiSummaryCard">

                            {/* panel header + close button */}
                            <div className="aiSummaryHeader">
                                <div>
                                    <p className="eyebrow">AI HEALTH ASSISTANT</p>
                                    <h2>🤖 AI Medical Summary</h2>
                                    <p>AI-generated summary of your medical record.</p>
                                </div>

                                <button className="closeSummaryButton" onClick={closeSummary}>
                                    ✕
                                </button>
                            </div>

                            {/* which record is being summarized */}
                            <div className="aiSummaryRecordInfo">
                                <strong>Diagnosis:</strong>
                                <span>{selectedRecord.diagnosis || "N/A"}</span>
                            </div>

                            {/* summary text or loading */}
                            {summaryLoading ? (
                                <div className="aiSummaryLoading">
                                    <span>🤖</span>
                                    <p>Generating your medical summary...</p>
                                </div>
                            ) : (
                                <div className="aiSummaryContent">
                                    <p>{summary}</p>
                                </div>
                            )}

                            {/* disclaimer */}
                            <div className="symptomDisclaimer">
                                <span>ℹ️</span>
                                <p>
                                    This AI-generated summary is for informational
                                    purposes and should not replace professional
                                    medical advice.
                                </p>
                            </div>

                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}

export default MedicalRecords;