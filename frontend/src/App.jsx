// page imports
import Home from "./pages/home";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

// shared components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/AdminUsers";
import AdminAppointments from "./pages/admin/AdminAppointments";
import AdminMedicalRecords from "./pages/admin/AdminMedicalRecords";

// doctor pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import DoctorMedicalRecords from "./pages/doctor/DoctorMedicalRecords";
import Availability from "./pages/doctor/DoctorAvailability";

// patient pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import Doctors from "./pages/patient/PatientDoctors";
import Appointments from "./pages/patient/PatientAppointments";
import MedicalRecords from "./pages/patient/PatientMedicalRecords";
import SymptomChecker from "./pages/patient/SymptomChecker";
import Profile from "./pages/patient/PatientProfile";
import DoctorDetails from "./pages/patient/DoctorDetails";

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Navbar />                                    {/* shows on every page */}

            <Routes>
                {/* public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* patient routes */}
                <Route path="/patient/dashboard" element={
                    <ProtectedRoute allowedRoles={["patient"]}>
                        <PatientDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/patient/doctors" element={
                    <ProtectedRoute allowedRoles={["patient"]}>
                        <Doctors />
                    </ProtectedRoute>
                } />

                <Route path="/patient/doctors/:doctorId" element={
                    <ProtectedRoute allowedRoles={["patient"]}>
                        <DoctorDetails />
                    </ProtectedRoute>
                } />

                <Route path="/patient/appointments" element={
                    <ProtectedRoute allowedRoles={["patient"]}>
                        <Appointments />
                    </ProtectedRoute>
                } />

                <Route path="/patient/medical-records" element={
                    <ProtectedRoute allowedRoles={["patient"]}>
                        <MedicalRecords />
                    </ProtectedRoute>
                } />

                <Route path="/patient/symptom-checker" element={
                    <ProtectedRoute allowedRoles={["patient"]}>
                        <SymptomChecker />
                    </ProtectedRoute>
                } />

                <Route path="/patient/profile" element={
                    <ProtectedRoute allowedRoles={["patient"]}>
                        <Profile />
                    </ProtectedRoute>
                } />

                {/* doctor routes */}
                <Route path="/doctor/dashboard" element={
                    <ProtectedRoute allowedRoles={["doctor"]}>
                        <DoctorDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/doctor/appointments" element={
                    <ProtectedRoute allowedRoles={["doctor"]}>
                        <DoctorAppointments />
                    </ProtectedRoute>
                } />

                <Route path="/doctor/profile" element={
                    <ProtectedRoute allowedRoles={["doctor"]}>
                        <DoctorProfile />
                    </ProtectedRoute>
                } />

                <Route path="/doctor/availability" element={
                    <ProtectedRoute allowedRoles={["doctor"]}>
                        <Availability />
                    </ProtectedRoute>
                } />

                <Route path="/doctor/medical-records" element={
                    <ProtectedRoute allowedRoles={["doctor"]}>
                        <DoctorMedicalRecords />
                    </ProtectedRoute>
                } />

                {/* admin routes */}
                <Route path="/admin/dashboard" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/admin/users" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <Users />
                    </ProtectedRoute>
                } />

                <Route path="/admin/appointments" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminAppointments />
                    </ProtectedRoute>
                } />

                <Route path="/admin/medical-records" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminMedicalRecords />
                    </ProtectedRoute>
                } />

                {/* 404 - page not found */}
                <Route path="*" element={<h1>404 - Page not found</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;