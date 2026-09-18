const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI
({
    apiKey: process.env.GEMINI_API_KEY
});

const generateMedicalSummary = async (medicalRecord) => {

    const prompt = `
You are a healthcare information assistant.

Summarize the following medical record in simple, patient-friendly language.

Medical Record:
Diagnosis: ${medicalRecord.diagnosis}
Symptoms: ${medicalRecord.symptoms || "Not provided"}
Prescription: ${medicalRecord.prescription || "Not provided"}
Notes: ${medicalRecord.notes || "Not provided"}

Provide:
1. A simple explanation of the diagnosis.
2. A summary of the reported symptoms.
3. A simple explanation of the prescription, if provided.
4. Important notes from the doctor.

Do not diagnose any new condition.
Do not recommend new medication.
Do not change or interpret the doctor's prescription.
Do not claim certainty beyond the information provided.
Clearly advise the patient to consult their doctor for medical questions.

Keep the summary concise and easy to understand.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
    });

    return response.text;
};

module.exports = {generateMedicalSummary};