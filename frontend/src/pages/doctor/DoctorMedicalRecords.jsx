import { useEffect, useState } from "react";
import api from "../../services/api";

import DoctorSidebar from "../../components/DoctorSidebar";
import LogoutButton from "../../components/LogoutButton";

function MedicalRecords() {

    const [appointmentId, setAppointmentId] = useState("");
    const [patientId, setPatientId] = useState("");

    const [diagnosis, setDiagnosis] = useState("");
    const [symptoms, setSymptoms] = useState("");
    const [prescription, setPrescription] = useState("");
    const [notes, setNotes] = useState("");

    const [appointments, setAppointments] = useState([]);
    const [records, setRecords] = useState([]);

    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);


    // ==========================================
    // FETCH MEDICAL RECORDS + CONFIRMED APPOINTMENTS
    // ==========================================

    useEffect(() => {

        const fetchData = async () => {

            try {

                const recordsResponse = await api.get(
                    "/medical-records/doctor"
                );

                const appointmentsResponse = await api.get(
                    "/appointments/doctor/confirmed"
                );


                console.log(
                    "DOCTOR MEDICAL RECORDS:",
                    recordsResponse.data
                );


                console.log(
                    "CONFIRMED APPOINTMENTS:",
                    appointmentsResponse.data
                );


                setRecords(
                    recordsResponse.data.medicalRecords || []
                );


                setAppointments(
                    appointmentsResponse.data.appointments || []
                );


            } catch (error) {

                console.log(
                    "MEDICAL RECORDS DATA ERROR:",
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


        fetchData();

    }, []);


    // ==========================================
    // HANDLE APPOINTMENT SELECTION
    // ==========================================

    const handleAppointmentChange = (event) => {

        const selectedAppointmentId = event.target.value;

        setAppointmentId(selectedAppointmentId);


        const selectedAppointment = appointments.find(
            (appointment) =>
                appointment._id === selectedAppointmentId
        );


        if (selectedAppointment) {

            setPatientId(
                selectedAppointment.patientId?._id || ""
            );

        } else {

            setPatientId("");

        }

    };


    // ==========================================
    // CREATE MEDICAL RECORD
    // ==========================================

    const createRecord = async (event) => {

        event.preventDefault();


        if (!appointmentId) {

            alert(
                "Please select a confirmed appointment."
            );

            return;
        }


        if (!diagnosis.trim()) {

            alert(
                "Please enter diagnosis."
            );

            return;
        }


        if (!patientId) {

            alert(
                "Patient information is missing."
            );

            return;
        }


        try {

            setCreating(true);


            const response = await api.post(
                "/medical-records",
                {
                    patientId,
                    appointmentId,
                    diagnosis,
                    symptoms,
                    prescription,
                    notes
                }
            );


            console.log(
                "MEDICAL RECORD CREATED:",
                response.data
            );


            const newMedicalRecord =
                response.data.medicalRecord;


            setRecords((previousRecords) => [
                newMedicalRecord,
                ...previousRecords
            ]);


            // Clear form

            setAppointmentId("");
            setPatientId("");
            setDiagnosis("");
            setSymptoms("");
            setPrescription("");
            setNotes("");


            alert(
                "Medical record created successfully!"
            );


        } catch (error) {

            console.log(
                "CREATE MEDICAL RECORD ERROR:",
                error.response?.data
            );


            alert(
                error.response?.data?.message ||
                "Failed to create medical record"
            );


        } finally {

            setCreating(false);

        }

    };


    // ==========================================
    // VIEW MEDICAL RECORD
    // ==========================================

    const viewRecord = (record) => {

        const patientName =
            record.patientId?.name || "Patient";


        const patientEmail =
            record.patientId?.email || "N/A";


        const appointmentDate =
            record.appointmentId?.appointmentDate
                ? new Date(
                    record.appointmentId.appointmentDate
                ).toLocaleString()
                : "N/A";


        alert(
            `Patient: ${patientName}\n` +
            `Email: ${patientEmail}\n` +
            `Diagnosis: ${record.diagnosis || "N/A"}\n` +
            `Symptoms: ${record.symptoms || "N/A"}\n` +
            `Prescription: ${record.prescription || "N/A"}\n` +
            `Appointment: ${appointmentDate}\n` +
            `Notes: ${record.notes || "N/A"}`
        );

    };


    // ==========================================
    // LOADING STATE
    // ==========================================

    if (loading) {

        return (
            <div>

                <DoctorSidebar />

                <main>

                    <div className="dashboardHeader">

                        <div>

                            <p className="eyebrow">
                                DOCTOR PORTAL
                            </p>

                            <h1>
                                Medical Records
                            </h1>

                        </div>

                        <LogoutButton />

                    </div>


                    <div className="doctorEmptyRecords">

                        <span>
                            ⏳
                        </span>

                        <h3>
                            Loading medical records...
                        </h3>

                        <p>
                            Please wait.
                        </p>

                    </div>

                </main>

            </div>
        );

    }


    // ==========================================
    // MAIN PAGE
    // ==========================================

    return (

        <div>

            <DoctorSidebar />


            <main>

                {/* ================================
                    HEADER
                ================================= */}

                <div className="dashboardHeader">

                    <div>

                        <p className="eyebrow">
                            DOCTOR PORTAL
                        </p>


                        <h1>
                            Medical Records
                        </h1>


                        <p>
                            Create and manage medical records for your patients.
                        </p>

                    </div>


                    <LogoutButton />

                </div>


                <section className="medicalRecordsLayout">


                    {/* ==================================
                        CREATE MEDICAL RECORD
                    =================================== */}

                    <div className="createRecordCard">


                        <div className="medicalRecordsHeader">

                            <div className="medicalRecordsIcon">
                                📋
                            </div>


                            <div>

                                <h2>
                                    Create Medical Record
                                </h2>


                                <p>
                                    Add diagnosis and medical notes for a patient.
                                </p>

                            </div>

                        </div>



                        <form
                            className="medicalRecordForm"
                            onSubmit={createRecord}
                        >


                            {/* CONFIRMED APPOINTMENT */}

                            <div className="medicalRecordFormGroup">

                                <label>
                                    Confirmed Appointment
                                </label>


                                <select
                                    value={appointmentId}
                                    onChange={handleAppointmentChange}
                                >

                                    <option value="">
                                        Select confirmed appointment
                                    </option>


                                    {appointments.map(
                                        (appointment) => {

                                            const patientName =
                                                appointment.patientId?.name ||
                                                "Patient";


                                            const appointmentDate =
                                                new Date(
                                                    appointment.appointmentDate
                                                );


                                            return (

                                                <option
                                                    key={appointment._id}
                                                    value={appointment._id}
                                                >

                                                    {patientName}
                                                    {" - "}
                                                    {
                                                        appointmentDate.toLocaleDateString()
                                                    }
                                                    {" - "}
                                                    {
                                                        appointmentDate.toLocaleTimeString(
                                                            [],
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit"
                                                            }
                                                        )
                                                    }

                                                </option>

                                            );

                                        }
                                    )}

                                </select>


                                {appointments.length === 0 && (

                                    <small>
                                        No confirmed appointments available.
                                    </small>

                                )}

                            </div>



                            {/* PATIENT */}

                            <div className="medicalRecordFormGroup">

                                <label>
                                    Patient
                                </label>


                                <input
                                    type="text"
                                    value={
                                        appointments.find(
                                            (appointment) =>
                                                appointment._id ===
                                                appointmentId
                                        )?.patientId?.name || ""
                                    }
                                    placeholder="Patient will appear here"
                                    readOnly
                                />

                            </div>



                            {/* DIAGNOSIS */}

                            <div className="medicalRecordFormGroup">

                                <label>
                                    Diagnosis
                                </label>


                                <input
                                    type="text"
                                    placeholder="Enter diagnosis"
                                    value={diagnosis}
                                    onChange={(event) =>
                                        setDiagnosis(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>



                            {/* SYMPTOMS */}

                            <div className="medicalRecordFormGroup">

                                <label>
                                    Symptoms
                                </label>


                                <textarea
                                    placeholder="Enter patient symptoms..."
                                    rows="4"
                                    value={symptoms}
                                    onChange={(event) =>
                                        setSymptoms(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>



                            {/* PRESCRIPTION */}

                            <div className="medicalRecordFormGroup">

                                <label>
                                    Prescription
                                </label>


                                <textarea
                                    placeholder="Enter prescription..."
                                    rows="4"
                                    value={prescription}
                                    onChange={(event) =>
                                        setPrescription(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>



                            {/* NOTES */}

                            <div className="medicalRecordFormGroup">

                                <label>
                                    Medical Notes
                                </label>


                                <textarea
                                    placeholder="Enter medical notes..."
                                    rows="6"
                                    value={notes}
                                    onChange={(event) =>
                                        setNotes(
                                            event.target.value
                                        )
                                    }
                                />

                            </div>



                            {/* CREATE BUTTON */}

                            <button
                                type="submit"
                                className="createRecordButton"
                                disabled={creating}
                            >

                                {creating
                                    ? "Creating..."
                                    : "Create Medical Record"
                                }

                            </button>


                        </form>

                    </div>



                    {/* ==================================
                        MEDICAL RECORDS LIST
                    =================================== */}

                    <div className="doctorRecordsCard">


                        <div className="doctorRecordsHeader">

                            <div>

                                <h2>
                                    Medical Records
                                </h2>


                                <p>
                                    View and manage patient medical records.
                                </p>

                            </div>


                            <span className="doctorRecordCount">

                                {records.length} Records

                            </span>

                        </div>



                        {/* NO RECORDS */}

                        {records.length === 0 ? (

                            <div className="doctorEmptyRecords">

                                <span>
                                    📋
                                </span>


                                <h3>
                                    No medical records found
                                </h3>


                                <p>
                                    Create a medical record for a patient.
                                </p>

                            </div>


                        ) : (


                            /* RECORD LIST */

                            <div className="doctorRecordsList">

                                {records.map(
                                    (record) => (

                                        <div
                                            className="doctorRecordItem"
                                            key={record._id}
                                        >


                                            <div className="doctorRecordMain">


                                                <div className="doctorRecordIcon">
                                                    📋
                                                </div>


                                                <div className="doctorRecordInfo">


                                                    <h3>
                                                        {
                                                            record.diagnosis ||
                                                            "Medical Record"
                                                        }
                                                    </h3>


                                                    <p className="recordPatient">

                                                        Patient:{" "}

                                                        {
                                                            record.patientId?.name ||
                                                            "Patient"
                                                        }

                                                    </p>


                                                    <p className="recordDate">

                                                        {record.createdAt
                                                            ? new Date(
                                                                record.createdAt
                                                            ).toLocaleDateString()
                                                            : "N/A"
                                                        }

                                                    </p>


                                                    <p className="recordNotesPreview">

                                                        {
                                                            record.notes ||
                                                            "No medical notes available."
                                                        }

                                                    </p>


                                                </div>

                                            </div>



                                            <div className="doctorRecordActions">


                                                <button
                                                    type="button"
                                                    className="viewDoctorRecordButton"
                                                    onClick={() =>
                                                        viewRecord(record)
                                                    }
                                                >

                                                    View

                                                </button>


                                            </div>


                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </section>

            </main>

        </div>

    );
}


export default MedicalRecords;