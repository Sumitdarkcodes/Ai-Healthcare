const { recommendSpecialty, checkUrgency } = require("../services/symptom.service");
const { generateAIRecommendation } = require("../services/gemini.service");

// patient sends symptoms, we tell them which doctor to see
const symptomCheck = async (req, res) => {
    try {
        const { symptoms } = req.body;

        // symptoms must be a non-empty string
        if (typeof symptoms !== "string" || !symptoms.trim()) {
            return res.status(400).json({
                message: "Symptoms must be a non-empty string"
            });
        }

        // check if it's something serious
        const isUrgent = checkUrgency(symptoms);

        if (isUrgent) {
            return res.status(200).json({
                message: "Urgent medical attention may be required",
                symptoms,
                urgent: true,
                recommendation: "Please seek immediate medical attention."
            });
        }

        // rule-based specialty match
        const recommendedSpecialty = recommendSpecialty(symptoms);

        // ask gemini for extra explanation
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

module.exports = { symptomCheck };