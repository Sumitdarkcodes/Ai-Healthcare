const {recommendSpecialty,checkUrgency} = require("../services/symptom.service");

const { generateAIRecommendation } = require("../services/gemini.service");

const symptomCheck = async (req, res) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms) {
            return res.status(400).json({
                message: "Symptoms are required"
            });
        }

        const isUrgent = checkUrgency(symptoms);

        if (isUrgent) {
            return res.status(200).json({
                message: "Urgent medical attention may be required",
                symptoms,
                urgent: true,
                recommendation: "Please seek immediate medical attention."
            });
        }

        const recommendedSpecialty = recommendSpecialty(symptoms);


        const aiRecommendation = await generateAIRecommendation(
            symptoms,
            recommendedSpecialty
        );

        return res.status(200).json({
            message: "Specialty recommendation generated successfully",
            symptoms,
            urgent: false,
            recommendedSpecialty,
            aiRecommendation
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = { symptomCheck};