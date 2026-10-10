import { useEffect, useState } from "react";
import DoctorSidebar from "../../components/DoctorSidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function MedicalRecords() {
    const [appointmentId, setAppointmentId] = useState("");   // selected appointment ID
    const [patientId, setPatientId] = useState("");           // auto-filled from appointment

    const [diagnosis, setDiagnosis] = useState("");           // diagnosis input
    const [symptoms, setSymptoms] = useState("");             // symptoms textarea
    const [prescription, setPrescription] = useState("");     // prescription textarea
    const [notes, setNotes] = useState("");                   // notes textarea

    const [appointments, setAppointments] = useState([]);     // confirmed appointments list
    const [records, setRecords] = useState([]);               // doctor's records list

    const [loading, setLoading] = useState(true);             // shows loading screen
    const [creating, setCreating] = useState(false);          // disables Create button
    const [error, setError] = useState("");                   // shows error on page
    const [success, setSuccess] = useState("");               // shows success message
    const [expandedId, setExpandedId] = useState(null);       // which record is expanded

    // runs once when the page loads
    useEffect(() => {
        // fetch both records + confirmed appointments
        const fetchData = async () => {
            try {
                const recordsResponse = await api.get("/medical-records/doctor");         // doctor's records
                const appointmentsResponse = await api.get("/appointments/doctor/confirmed");   // confirmed

                setRecords(recordsResponse.data.medicalRecords || []);
                setAppointments(appointmentsResponse.data.appointments || []);
            } catch (error) {
                setError(
                    error.response?.data?.message || "Failed to load medical records"    // fallback
                );
            } finally {
                setLoading(false);                            // done either way
            }
        };

        fetchData();
    }, []);

    // runs when doctor selects an appointment from dropdown
    const handleAppointmentChange = (event) => {
        const selectedId = event.target.value;
        setAppointmentId(selectedId);

        // auto-fill patientId from the selected appointment
        const selectedAppointment = appointments.find(
            (appointment) => appointment._id === selectedId
        );

        setPatientId(selectedAppointment?.patientId?._id || "");
    };

    // runs when "Create Medical Record" button is clicked
    const createRecord = async (event) => {
        event.preventDefault();                               // stop page reload

        setError("");                                         // clear old messages
        setSuccess("");

        // validation before sending
        if (!appointmentId) {
            setError("Please select a confirmed appointment.");    // no appointment selected
            return;
        }

        if (!diagnosis.trim()) {
            setError("Please enter diagnosis.");              // empty diagnosis
            return;
        }

        if (!patientId) {
            setError("Patient information is missing.");      // missing patient
            return;
        }

        setCreating(true);                                    // disable button

        try {
            const response = await api.post("/medical-records", {
                patientId,
                appointmentId,
                diagnosis,
                symptoms,
                prescription,
                notes
            });

            setRecords((previousRecords) => [
                response.data.medicalRecord,                  // new record at top
                ...previousRecords                            // keep old records
            ]);

            // clear form fields after success
            setAppointmentId("");
            setPatientId("");
            setDiagnosis("");
            setSymptoms("");
            setPrescription("");
            setNotes("");
            setSuccess("Medical record created successfully");    // show message
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to create medical record"    // fallback
            );
        } finally {
            setCreating(false);                               // re-enable button
        }
    };

    // toggle expanded details for a record
    const toggleDetails = (recordId) => {
        setExpandedId(expandedId === recordId ? null : recordId);    // same = close, other = open
    };

    // show loading screen while fetching
    if (loading) {
        return (
            <div>
                <DoctorSidebar />

                <main>

                    {/* page title + logout */}
                    <div className="dashboardHeader">
                        <div>
                            <p className="eyebrow">DOCTOR PORTAL</p>
                            <h1>Medical Records</h1>
                        </div>

                        <LogoutButton />
                    </div>

                    <div className="doctorEmptyRecords">
                        <span>⏳</span>                            {/* hourglass icon */}
                        <h3>Loading medical records...</h3>
                        <p>Please wait.</p>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div>
            <DoctorSidebar />

            <main>

                {/* page title + logout button */}
                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">DOCTOR PORTAL</p>
                        <h1>Medical Records</h1>
                        <p>Create and manage medical records for your patients.</p>
                    </div>

                    <LogoutButton />
                </div>

                <section className="medicalRecordsLayout">

                    {/* left card - create record form */}
                    <div className="createRecordCard">

                        {/* card header */}
                        <div className="medicalRecordsHeader">
                            <div className="medicalRecordsIcon">📋</div>   {/* clipboard icon */}
                            <div>
                                <h2>Create Medical Record</h2>
                                <p>Add diagnosis and medical notes for a patient.</p>
                            </div>
                        </div>

                        {/* error / success messages */}
                        {error && <p className="error">{error}</p>}
                        {success && <p className="success">{success}</p>}

                        <form className="medicalRecordForm" onSubmit={createRecord}>

                            {/* appointment dropdown */}
                            <div className="medicalRecordFormGroup">
                                <label>Confirmed Appointment</label>

                                <select
                                    value={appointmentId}
                                    onChange={handleAppointmentChange}
                                >
                                    <option value="">Select confirmed appointment</option>   {/* placeholder */}

                                    {appointments.map((appointment) => {
                                        const patientName =
                                            appointment.patientId?.name || "Patient";
                                        const appointmentDate = new Date(
                                            appointment.appointmentDate
                                        );

                                        return (
                                            <option
                                                key={appointment._id}
                                                value={appointment._id}
                                            >
                                                {patientName}
                                                {" - "}
                                                {appointmentDate.toLocaleDateString()}
                                                {" - "}
                                                {appointmentDate.toLocaleTimeString([], {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </option>
                                        );
                                    })}
                                </select>

                                {/* hint when there are no confirmed appointments */}
                                {appointments.length === 0 && (
                                    <small>No confirmed appointments available.</small>
                                )}
                            </div>

                            {/* patient name (read-only, auto-filled) */}
                            <div className="medicalRecordFormGroup">
                                <label>Patient</label>
                                <input
                                    type="text"
                                    value={
                                        appointments.find(
                                            (appointment) => appointment._id === appointmentId
                                        )?.patientId?.name || ""
                                    }
                                    placeholder="Patient will appear here"
                                    readOnly
                                />
                            </div>

                            {/* diagnosis */}
                            <div className="medicalRecordFormGroup">
                                <label>Diagnosis</label>
                                <input
                                    type="text"
                                    placeholder="Enter diagnosis"
                                    value={diagnosis}
                                    onChange={(event) => setDiagnosis(event.target.value)}
                                />
                            </div>

                            {/* symptoms */}
                            <div className="medicalRecordFormGroup">
                                <label>Symptoms</label>
                                <textarea
                                    placeholder="Enter patient symptoms..."
                                    rows="4"
                                    value={symptoms}
                                    onChange={(event) => setSymptoms(event.target.value)}
                                />
                            </div>

                            {/* prescription */}
                            <div className="medicalRecordFormGroup">
                                <label>Prescription</label>
                                <textarea
                                    placeholder="Enter prescription..."
                                    rows="4"
                                    value={prescription}
                                    onChange={(event) => setPrescription(event.target.value)}
                                />
                            </div>

                            {/* notes */}
                            <div className="medicalRecordFormGroup">
                                <label>Medical Notes</label>
                                <textarea
                                    placeholder="Enter medical notes..."
                                    rows="6"
                                    value={notes}
                                    onChange={(event) => setNotes(event.target.value)}
                                />
                            </div>

                            {/* submit button - disabled while creating */}
                            <button
                                type="submit"
                                className="createRecordButton"
                                disabled={creating}
                            >
                                {creating ? "Creating..." : "Create Medical Record"}
                            </button>

                        </form>
                    </div>

                    {/* right card - records list */}
                    <div className="doctorRecordsCard">

                        {/* card header with count */}
                        <div className="doctorRecordsHeader">
                            <div>
                                <h2>Medical Records</h2>
                                <p>View and manage patient medical records.</p>
                            </div>

                            <span className="doctorRecordCount">
                                {records.length} Records          {/* count */}
                            </span>
                        </div>

                        {records.length === 0 ? (
                            // empty state
                            <div className="doctorEmptyRecords">
                                <span>📋</span>                    {/* clipboard icon */}
                                <h3>No medical records found</h3>
                                <p>Create a medical record for a patient.</p>
                            </div>
                        ) : (
                            <div className="doctorRecordsList">

                                {records.map((record) => {
                                    const isExpanded = expandedId === record._id;    // is this card open?

                                    return (
                                        <div className="doctorRecordItem" key={record._id}>

                                            {/* record summary */}
                                            <div className="doctorRecordMain">
                                                <div className="doctorRecordIcon">📋</div>   {/* clipboard */}

                                                <div className="doctorRecordInfo">
                                                    <h3>{record.diagnosis || "Medical Record"}</h3>

                                                    <p className="recordPatient">
                                                        Patient: {record.patientId?.name || "Patient"}
                                                    </p>

                                                    <p className="recordDate">
                                                        {record.createdAt
                                                            ? new Date(record.createdAt).toLocaleDateString()
                                                            : "N/A"}
                                                    </p>

                                                    <p className="recordNotesPreview">
                                                        {record.notes || "No medical notes available."}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* expanded details */}
                                            {isExpanded && (
                                                <div className="doctorRecordDetails">
                                                    <p>
                                                        <strong>Symptoms</strong>
                                                        <span>{record.symptoms || "N/A"}</span>
                                                    </p>

                                                    <p>
                                                        <strong>Prescription</strong>
                                                        <span>{record.prescription || "N/A"}</span>
                                                    </p>

                                                    <p>
                                                        <strong>Patient Email</strong>
                                                        <span>{record.patientId?.email || "N/A"}</span>
                                                    </p>
                                                </div>
                                            )}

                                            {/* view / hide button */}
                                            <div className="doctorRecordActions">
                                                <button
                                                    type="button"
                                                    className="viewDoctorRecordButton"
                                                    onClick={() => toggleDetails(record._id)}
                                                >
                                                    {isExpanded ? "Hide" : "View"}    {/* toggle text */}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}

                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default MedicalRecords;