const MedicalRecord = require("../models/medicalrecord.model");
const { generateMedicalSummary } = require("../services/medicalsummaryreport.service");

// patient asks for a simple summary of their own medical record
const summarizeMedicalRecord = async (req, res) => {
    try {
        const { recordId } = req.params;

        const medicalRecord = await MedicalRecord.findById(recordId);

        if (!medicalRecord) {
            return res.status(404).json({
                message: "Medical record not found"
            });
        }

        // patient can only view their own record, not others
        if (
            req.user.role === "patient" &&
            medicalRecord.patientId.toString() !== req.user.userId
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        // send the record to gemini for a friendly summary
        const summary = await generateMedicalSummary(medicalRecord);

        return res.status(200).json({
            message: "Medical record summary generated successfully",
            recordId,
            summary
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = { summarizeMedicalRecord };