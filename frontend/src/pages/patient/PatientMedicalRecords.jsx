
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function MedicalRecords() {

    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    const [summary, setSummary] = useState("");
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    useEffect(() => {

        const fetchMedicalRecords = async () => {

            try {

                const response = await api.get(
                    "/medical-records"
                );

                console.log(
                    "PATIENT MEDICAL RECORDS:",
                    response.data
                );

                setRecords(
                    response.data.medicalRecords || []
                );

            } catch (error) {

                console.log(
                    "PATIENT MEDICAL RECORDS ERROR:",
                    error.response?.data
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to load medical records"
                );

            } finally {

                setLoading(false);
            }
        };

        fetchMedicalRecords();

    }, []);


    const viewRecord = (record) => {

        const doctorName =
            record.doctorId?.userId?.name ||
            "Doctor";

        const doctorEmail =
            record.doctorId?.userId?.email ||
            "N/A";

        const appointmentDate =
            record.appointmentId?.appointmentDate
                ? new Date(
                    record.appointmentId.appointmentDate
                ).toLocaleString()
                : "N/A";

        alert(
            `Doctor: Dr. ${doctorName}\n` +
            `Doctor Email: ${doctorEmail}\n` +
            `Date: ${appointmentDate}\n` +
            `Diagnosis: ${record.diagnosis || "N/A"}\n` +
            `Symptoms: ${record.symptoms || "N/A"}\n` +
            `Prescription: ${record.prescription || "N/A"}\n` +
            `Notes: ${record.notes || "N/A"}`
        );
    };


    const generateSummary = async (record) => {

        try {

            setSummaryLoading(true);
            setSummary("");
            setSelectedRecord(record);

            const response = await api.get(
                `/ai/medical-summary/${record._id}`
            );

            console.log(
                "AI MEDICAL SUMMARY:",
                response.data
            );

            setSummary(
                response.data.summary || "No summary available."
            );

        } catch (error) {

            console.log(
                "AI MEDICAL SUMMARY ERROR:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Failed to generate medical summary"
            );

            setSelectedRecord(null);

        } finally {

            setSummaryLoading(false);
        }
    };


    const closeSummary = () => {

        setSummary("");
        setSelectedRecord(null);
    };


    if (loading) {

        return (
            <div>

                <Sidebar />

                <main>

                    <div className="dashboardHeader">

                        <div>

                            <p className="eyebrow">
                                PATIENT PORTAL
                            </p>

                            <h1>
                                Medical Records
                            </h1>

                            <p>
                                View your medical history, diagnoses and prescriptions.
                            </p>

                        </div>

                        <LogoutButton />

                    </div>

                    <section className="recordsSection">

                        <div className="recordsHeader">

                            <div>

                                <h2>
                                    Medical History
                                </h2>

                                <p>
                                    Loading your medical records...
                                </p>

                            </div>

                        </div>

                    </section>

                </main>

            </div>
        );
    }


    return (
        <div>

            <Sidebar />

            <main>

                <div className="dashboardHeader">

                    <div>

                        <p className="eyebrow">
                            PATIENT PORTAL
                        </p>

                        <h1>
                            Medical Records
                        </h1>

                        <p>
                            View your medical history, diagnoses and prescriptions.
                        </p>

                    </div>

                    <LogoutButton />

                </div>


                <section className="recordsSection">

                    <div className="recordsHeader">

                        <div>

                            <h2>
                                Medical History
                            </h2>

                            <p>
                                Your previous consultations and medical information.
                            </p>

                        </div>

                        <span className="recordCount">
                            {records.length} Records
                        </span>

                    </div>


                    {records.length === 0 ? (

                        <div className="doctorEmptyRecords">

                            <span>
                                📋
                            </span>

                            <h3>
                                No medical records found
                            </h3>

                            <p>
                                Your medical records will appear here after a doctor creates them.
                            </p>

                        </div>

                    ) : (

                        <div className="recordsGrid">

                            {records.map((record) => {

                                const doctorName =
                                    record.doctorId?.userId?.name ||
                                    "Doctor";

                                const specialization =
                                    record.doctorId?.specialization ||
                                    "Medical Specialist";

                                const appointmentDate =
                                    record.appointmentId?.appointmentDate
                                        ? new Date(
                                            record.appointmentId.appointmentDate
                                        )
                                        : null;

                                return (

                                    <div
                                        className="recordCard"
                                        key={record._id}
                                    >

                                        <div className="recordCardHeader">

                                            <div className="recordIcon">
                                                📋
                                            </div>

                                            <div>

                                                <h3>
                                                    {
                                                        record.diagnosis ||
                                                        "Medical Record"
                                                    }
                                                </h3>

                                                <span>
                                                    Dr. {doctorName}
                                                </span>

                                                <small>
                                                    {specialization}
                                                </small>

                                            </div>

                                        </div>


                                        <div className="recordInfo">

                                            <p>

                                                <strong>
                                                    Date
                                                </strong>

                                                <span>
                                                    {appointmentDate
                                                        ? appointmentDate.toLocaleDateString()
                                                        : "N/A"
                                                    }
                                                </span>

                                            </p>


                                            <p>

                                                <strong>
                                                    Diagnosis
                                                </strong>

                                                <span>
                                                    {
                                                        record.diagnosis ||
                                                        "N/A"
                                                    }
                                                </span>

                                            </p>


                                            <p>

                                                <strong>
                                                    Prescription
                                                </strong>

                                                <span>
                                                    {
                                                        record.prescription ||
                                                        "No prescription"
                                                    }
                                                </span>

                                            </p>

                                        </div>


                                        <div className="recordNotes">

                                            <strong>
                                                Doctor's Notes
                                            </strong>

                                            <p>
                                                {
                                                    record.notes ||
                                                    "No medical notes available."
                                                }
                                            </p>

                                        </div>


                                        <div className="recordActions">

                                            <button
                                                className="viewRecordButton"
                                                onClick={() =>
                                                    viewRecord(record)
                                                }
                                            >
                                                View Details
                                            </button>


                                            <button
                                                className="aiSummaryButton"
                                                onClick={() =>
                                                    generateSummary(record)
                                                }
                                                disabled={summaryLoading}
                                            >
                                                {summaryLoading &&
                                                selectedRecord?._id === record._id
                                                    ? "Generating..."
                                                    : "🤖 AI Summary"
                                                }
                                            </button>

                                        </div>

                                    </div>
                                );
                            })}

                        </div>
                    )}

                </section>


                {selectedRecord && (

                    <section className="aiSummarySection">

                        <div className="aiSummaryCard">

                            <div className="aiSummaryHeader">

                                <div>

                                    <p className="eyebrow">
                                        AI HEALTH ASSISTANT
                                    </p>

                                    <h2>
                                        🤖 AI Medical Summary
                                    </h2>

                                    <p>
                                        AI-generated summary of your medical record.
                                    </p>

                                </div>

                                <button
                                    className="closeSummaryButton"
                                    onClick={closeSummary}
                                >
                                    ✕
                                </button>

                            </div>


                            <div className="aiSummaryRecordInfo">

                                <strong>
                                    Diagnosis:
                                </strong>

                                <span>
                                    {selectedRecord.diagnosis || "N/A"}
                                </span>

                            </div>


                            {summaryLoading ? (

                                <div className="aiSummaryLoading">

                                    <span>
                                        🤖
                                    </span>

                                    <p>
                                        Generating your medical summary...
                                    </p>

                                </div>

                            ) : (

                                <div className="aiSummaryContent">

                                    <p>
                                        {summary}
                                    </p>

                                </div>

                            )}


                            <div className="symptomDisclaimer">

                                <span>
                                    ℹ️
                                </span>

                                <p>
                                    This AI-generated summary is for
                                    informational purposes and should not
                                    replace professional medical advice.
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

