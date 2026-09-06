const MedicalRecord = require("../models/medicalrecord.model");

const {generateMedicalSummary} = require("../services/medicialsummaryreport.service");

const summarizeMedicalRecord = async (req, res) => {
    try {
        const { recordId } = req.params;

        const medicalRecord = await MedicalRecord.findById(recordId);

        if (!medicalRecord) {
            return res.status(404).json({
                message: "Medical record not found"
            });
        }

        // Make sure the patient can only summarize their own record
        if (req.user.role === "patient" &&
            medicalRecord.patientId.toString() !== req.user.userId) {

            return res.status(403).json({
                message: "Access denied"
            });
        }

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

module.exports = { summarizeMedicalRecord};