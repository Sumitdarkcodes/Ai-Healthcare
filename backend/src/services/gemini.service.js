const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const generateAIRecommendation = async (symptoms, specialty) => {
    const prompt = `
You are a healthcare assistant.

The patient reported these symptoms:
${symptoms}

Our rule-based system recommended:
${specialty}

Provide:
1. A brief explanation of why this medical specialty may be relevant.
2. General, non-diagnostic guidance for the patient.
3. Clear advice to consult a qualified doctor.

Do not diagnose any disease.
Do not prescribe medication.
Do not claim certainty.
Keep the response concise and easy to understand.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
    });

    return response.text;
};

module.exports = {generateAIRecommendation};