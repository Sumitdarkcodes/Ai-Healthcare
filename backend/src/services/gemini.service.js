const { GoogleGenAI } = require("@google/genai");

// create the AI client with our API key
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// send symptoms + specialty to Gemini and get a friendly explanation
const generateAIRecommendation = async (symptoms, specialty) => {
    // build the prompt we send to Gemini
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

    // call gemini and wait for the response
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",                       // latest flash model
        contents: prompt
    });

    return response.text;
};

module.exports = { generateAIRecommendation };