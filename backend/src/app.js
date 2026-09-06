const express = require("express")

const cookieParser = require ("cookie-parser")

const doctorRoutes = require ("./routes/doctor.routes")

const appointmentRoutes = require ("./routes/appointment.routes")

const app = express ();

app.use(express.json());

app.use(cookieParser());

app.use("/api/doctors",doctorRoutes);

app.use("/api/appointments", appointmentRoutes);







module.exports = app;
