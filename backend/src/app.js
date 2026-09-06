const express = require("express")

const cookieParser = require ("cookie-parser")

const doctorRoutes = require ("./routes/doctor.routes")

const appointmentRoutes = require ("./routes/appointment.routes")

const patientRoutes = require ("./routes/patient.routes")

const medicalRecordRoutes = require("./routes/medicalrecord.routes");

const adminRoutes = require ("./routes/admin.routes")

const aiRoutes = require("./routes/ai.routes");


const app = express ();

app.use(express.json());

app.use(cookieParser());

app.use("/api/admin", adminRoutes);

app.use("/api/doctors",doctorRoutes);

app.use("/api/patients", patientRoutes);

app.use("/api/medical-records", medicalRecordRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/ai", aiRoutes);


module.exports = app;
