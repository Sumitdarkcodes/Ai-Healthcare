import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import LogoutButton from "../../components/LogoutButton";
import api from "../../services/api";

function AdminMedicalRecords() {

    const [records, setRecords] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(function () {

        async function fetchMedicalRecords() {

            try {

                setLoading(true);

                const response = await api.get(
                    "/admin/medical-records"
                );

                console.log(
                    "ADMIN MEDICAL RECORDS:",
                    response.data
                );

                setRecords(
                    response.data.medicalRecords || []
                );

            } catch (error) {

                console.error(
                    "ADMIN MEDICAL RECORDS ERROR:",
                    error.response?.data || error.message
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to fetch medical records."
                );

            } finally {

                setLoading(false);

            }

        }

        fetchMedicalRecords();

    }, []);


    const viewRecord = function (record) {

        const patientName =
            record.patientId?.name ||
            "Unknown Patient";

        const doctorName =
            record.doctorId?.userId?.name ||
            "Unknown Doctor";

        const appointmentDate =
            record.appointmentId?.appointmentDate
                ? new Date(
                    record.appointmentId.appointmentDate
                ).toLocaleString()
                : "Not available";


        alert(
            `Patient: ${patientName}\n` +
            `Doctor: ${doctorName}\n` +
            `Date: ${appointmentDate}\n` +
            `Diagnosis: ${record.diagnosis || "Not available"}\n` +
            `Symptoms: ${record.symptoms || "Not available"}\n` +
            `Notes: ${record.notes || "Not available"}\n` +
            `Prescription: ${record.prescription || "Not available"}`
        );

    };


    return (
        <div>

            <AdminSidebar />

            <main>

                <div className="dashboardHeader">

                    <div>

                        <p className="eyebrow">
                            ADMIN PORTAL
                        </p>

                        <h1>
                            All Medical Records
                        </h1>

                        <p>
                            View medical records in the healthcare system.
                        </p>

                    </div>

                    <LogoutButton />

                </div>


                <section>

                    <h2>
                        Medical Records
                    </h2>


                    <div>

                        <h3>
                            Total Records
                        </h3>

                        <p>
                            {records.length}
                        </p>

                    </div>


                    {loading ? (

                        <p>
                            Loading medical records...
                        </p>

                    ) : records.length === 0 ? (

                        <p>
                            No medical records found.
                        </p>

                    ) : (

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Patient
                                    </th>

                                    <th>
                                        Doctor
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Diagnosis
                                    </th>

                                    <th>
                                        Prescription
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {records.map(function (record) {

                                    const patientName =
                                        record.patientId?.name ||
                                        "Unknown Patient";


                                    const doctorName =
                                        record.doctorId?.userId?.name ||
                                        "Unknown Doctor";


                                    const appointmentDate =
                                        record.appointmentId?.appointmentDate
                                            ? new Date(
                                                record.appointmentId.appointmentDate
                                            ).toLocaleDateString()
                                            : "Not available";


                                    return (

                                        <tr
                                            key={record._id}
                                        >

                                            <td>
                                                {patientName}
                                            </td>


                                            <td>
                                                {doctorName}
                                            </td>


                                            <td>
                                                {appointmentDate}
                                            </td>


                                            <td>
                                                {record.diagnosis}
                                            </td>


                                            <td>
                                                {record.prescription ||
                                                    "Not available"}
                                            </td>


                                            <td>

                                                <button
                                                    onClick={function () {
                                                        viewRecord(record);
                                                    }}
                                                >
                                                    View
                                                </button>

                                            </td>

                                        </tr>

                                    );

                                })}

                            </tbody>

                        </table>

                    )}

                </section>

            </main>

        </div>
    );
}

export default AdminMedicalRecords;