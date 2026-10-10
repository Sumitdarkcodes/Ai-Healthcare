const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const doctorRoutes = require("./routes/doctor.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const patientRoutes = require("./routes/patient.routes");
const medicalRecordRoutes = require("./routes/medicalrecord.routes");
const adminRoutes = require("./routes/admin.routes");
const aiRoutes = require("./routes/ai.routes");

const app = express();

// security headers
// app.use(helmet());

// log requests
app.use(morgan("dev"));

// allow requests from frontend (local + deployed)
const allowedOrigins = [
    "http://localhost:5173",
    process.env.CLIENT_URL
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/ai", aiRoutes);

// if no route matched
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;