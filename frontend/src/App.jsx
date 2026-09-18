
//imports

import Home from "./pages/home";

import Navbar from "./components/Navbar";

import ProtectedRoute from "./components/ProtectedRoute";


import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/login";

import Register from "./pages/auth/register";


// ADMIN 


import AdminDashboard from "./pages/admin/AdminDashboard";

import Users from "./pages/admin/AdminUsers";

import AdminAppointments from "./pages/admin/AdminAppointments";

import AdminMedicalRecords from "./pages/admin/AdminMedicalRecords";


// DOCTOR

import DoctorDashboard from "./pages/doctor/DoctorDashboard";

import DoctorAppointments from "./pages/doctor/DoctorAppointments";

import DoctorProfile from "./pages/doctor/DoctorProfile";

import DoctorMedicalRecords from "./pages/doctor/DoctorMedicalRecords";

import Availability from "./pages/doctor/DoctorAvailability";



// PATIENT


import PatientDashboard from "./pages/patient/PatientDashboard";

import Doctors from "./pages/patient/PatientDoctors";

import Appointments from "./pages/patient/PatientAppointments";

import MedicalRecords from "./pages/patient/PatientMedicalRecords";

import SymptomChecker from "./pages/patient/SymptomChecker";

import Profile from "./pages/patient/PatientProfile";

import DoctorDetails from "./pages/patient/DoctorDetails";




function App() {
    return (
        <BrowserRouter>

        <Navbar />

            <Routes>

               <Route path="/" element={<Home />} />

                <Route
                    path="/login"
                   element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                 />


                  {/* Patient Routes */}


                  <Route
                     path="/patient/dashboard"
                     element={
                        <ProtectedRoute allowedRoles={["patient"]}>
                       <PatientDashboard />
                       </ProtectedRoute>
                          }
                        /> 

                         <Route
                          path="/patient/doctors"
                            element={
                           <ProtectedRoute allowedRoles={["patient"]}>
                             <Doctors />
                             </ProtectedRoute>
                               }
                               />

                             <Route
                                path="/patient/appointments"
                                element={
                              <ProtectedRoute allowedRoles={["patient"]}>
                                 <Appointments />
                                 </ProtectedRoute>
                                    }
                                   />

                                  <Route
                                    path="/patient/medical-records"
                                  element={
                                    <ProtectedRoute allowedRoles={["patient"]}>
                                    <MedicalRecords />
                                </ProtectedRoute>
                                }
                              />

                              <Route
                             path="/patient/symptom-checker"
                               element={
                               <ProtectedRoute allowedRoles={["patient"]}>
                              <SymptomChecker />
                             </ProtectedRoute>
                             }
                             />

                         <Route
                         path="/patient/profile"
                          element={
                         <ProtectedRoute allowedRoles={["patient"]}>
                            <Profile />
                        </ProtectedRoute>
                       }
                      />

                      <Route
                       path="/patient/doctors/:doctorId"
                        element={
                       <ProtectedRoute allowedRoles={["patient"]}>
                        <DoctorDetails />
                        </ProtectedRoute>
                          }
                          />




                      {/* Doctor routes */}

                      <Route
    path="/doctor/dashboard"
    element={
        <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/doctor/appointments"
    element={
        <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorAppointments />
        </ProtectedRoute>
    }
/>

<Route
    path="/doctor/profile"
    element={
        <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorProfile />
        </ProtectedRoute>
    }
/>

<Route
    path="/doctor/availability"
    element={
        <ProtectedRoute allowedRoles={["doctor"]}>
            <Availability />
        </ProtectedRoute>
    }
/>

<Route
    path="/doctor/medical-records"
    element={
        <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorMedicalRecords />
        </ProtectedRoute>
    }
/>     

                  {/* Admin routes */}
              

                      <Route
    path="/admin/dashboard"
    element={
        <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/users"
    element={
        <ProtectedRoute allowedRoles={["admin"]}>
            <Users />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/appointments"
    element={
        <ProtectedRoute allowedRoles={["admin"]}>
            <AdminAppointments />
        </ProtectedRoute>
    }
/>

<Route
    path="/admin/medical-records"
    element={
        <ProtectedRoute allowedRoles={["admin"]}>
            <AdminMedicalRecords />
        </ProtectedRoute>
    }
/>

<Route
    path="/my-appointments"
    element={<Appointments />}
/>




            </Routes>

        </BrowserRouter>
    );
}

export default App;