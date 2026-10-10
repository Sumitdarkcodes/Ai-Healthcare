import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function AdminMedicalRecords() {
    const [records, setRecords] = useState([]);           // full list from backend
    const [loading, setLoading] = useState(true);         // shows loading state
    const [error, setError] = useState("");               // shows error on page
    const [search, setSearch] = useState("");             // search box value
    const [expandedId, setExpandedId] = useState(null);   // which record is expanded

    // runs once when the page loads
    useEffect(() => {
        // fetch all medical records from backend
        const fetchMedicalRecords = async () => {
            try {
                const response = await api.get("/admin/medical-records");
                setRecords(response.data.medicalRecords || []);    // save list
            } catch (error) {
                setError(
                    error.response?.data?.message || "Failed to fetch medical records"    // fallback
                );
            } finally {
                setLoading(false);                            // done either way
            }
        };

        fetchMedicalRecords();
    }, []);

    // filter records by patient name, doctor name, or diagnosis
    const filteredRecords = records.filter((record) => {
        const patientName = (record.patientId?.name || "").toLowerCase();
        const doctorName = (record.doctorId?.userId?.name || "").toLowerCase();
        const diagnosis = (record.diagnosis || "").toLowerCase();
        const text = search.toLowerCase();

        return (
            patientName.includes(text) ||
            doctorName.includes(text) ||
            diagnosis.includes(text)
        );
    });

    // toggle expanded details for a record
    const toggleDetails = (recordId) => {
        setExpandedId(expandedId === recordId ? null : recordId);    // same = close, other = open
    };

    return (
        <div>
            <AdminSidebar />                                  {/* left menu for admins */}

            <main>

                {/* page title + logout button */}
                <div className="dashboardHeader">
                    <div>
                        <p className="eyebrow">ADMIN PORTAL</p>
                        <h1>All Medical Records</h1>
                        <p>View medical records in the healthcare system.</p>
                    </div>

                    <LogoutButton />
                </div>

                <section className="adminRecordsSection">

                    {/* section header + count */}
                    <div className="adminRecordsHeader">
                        <div>
                            <h2>Medical Records</h2>
                            <p>Monitor medical records created by doctors.</p>
                        </div>

                        <span className="adminRecordCount">
                            {records.length} Records              {/* total count */}
                        </span>
                    </div>

                    {/* error message */}
                    {error && <p className="error">{error}</p>}

                    {/* search box */}
                    <div className="adminFilters">
                        <input
                            type="text"
                            placeholder="Search by patient, doctor, or diagnosis..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}    // update search
                        />
                    </div>

                    {loading ? (
                        // loading state
                        <p>Loading medical records...</p>
                    ) : filteredRecords.length === 0 ? (
                        // empty state (no records or no search matches)
                        <p>No medical records found.</p>
                    ) : (
                        <div className="adminTableWrapper">
                            <table className="adminTable">
                                <thead>
                                    <tr>
                                        <th>Patient</th>
                                        <th>Doctor</th>
                                        <th>Date</th>
                                        <th>Diagnosis</th>
                                        <th>Prescription</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredRecords.map((record) => {
                                        const patientName =
                                            record.patientId?.name || "Unknown Patient";
                                        const doctorName =
                                            record.doctorId?.userId?.name || "Unknown Doctor";
                                        const appointmentDate = record.appointmentId?.appointmentDate
                                            ? new Date(record.appointmentId.appointmentDate).toLocaleDateString()
                                            : "Not available";

                                        const isExpanded = expandedId === record._id;    // is this row open?

                                        return (
                                            <>
                                                <tr key={record._id}>

                                                    {/* patient name */}
                                                    <td>{patientName}</td>

                                                    {/* doctor name */}
                                                    <td>{doctorName}</td>

                                                    {/* appointment date */}
                                                    <td>{appointmentDate}</td>

                                                    {/* diagnosis */}
                                                    <td>{record.diagnosis || "N/A"}</td>

                                                    {/* prescription */}
                                                    <td>{record.prescription || "Not available"}</td>

                                                    {/* toggle details button */}
                                                    <td>
                                                        <button
                                                            className="viewRecordButton"
                                                            onClick={() => toggleDetails(record._id)}
                                                        >
                                                            {isExpanded ? "Hide" : "View"}    {/* toggle text */}
                                                        </button>
                                                    </td>

                                                </tr>

                                                {/* expanded details row - only when this record is open */}
                                                {isExpanded && (
                                                    <tr className="expandedRecordRow">
                                                        <td colSpan="6">
                                                            <div className="recordDetailsGrid">

                                                                <div>
                                                                    <strong>Symptoms</strong>
                                                                    <p>{record.symptoms || "Not available"}</p>
                                                                </div>

                                                                <div>
                                                                    <strong>Medical Notes</strong>
                                                                    <p>{record.notes || "Not available"}</p>
                                                                </div>

                                                                <div>
                                                                    <strong>Patient Email</strong>
                                                                    <p>{record.patientId?.email || "N/A"}</p>
                                                                </div>

                                                                <div>
                                                                    <strong>Doctor Specialization</strong>
                                                                    <p>{record.doctorId?.specialization || "N/A"}</p>
                                                                </div>

                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

export default AdminMedicalRecords;