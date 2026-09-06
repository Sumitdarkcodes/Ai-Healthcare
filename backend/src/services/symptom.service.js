
const urgentSymptoms = [
    "severe chest pain",
    "difficulty breathing",
    "unconscious",
    "loss of consciousness",
    "stroke symptoms",
    "severe bleeding"
];

const checkUrgency = (symptoms) => {
    const normalizedSymptoms = symptoms.toLowerCase();

    return urgentSymptoms.some(symptom =>
        normalizedSymptoms.includes(symptom)
    );
};

const symptomRules = [
    {
        keywords: ["chest pain", "heart pain", "palpitations"],
        specialty: "Cardiologist"
    },
    {
        keywords: ["skin rash", "itching", "acne", "skin infection"],
        specialty: "Dermatologist"
    },
    {
        keywords: ["headache", "migraine", "seizure", "dizziness"],
        specialty: "Neurologist"
    },
    {
        keywords: ["joint pain", "bone pain", "arthritis"],
        specialty: "Orthopedic"
    },
    {
        keywords: ["stomach pain", "abdominal pain", "vomiting", "diarrhea"],
        specialty: "Gastroenterologist"
    },
    {
        keywords: ["cough", "breathing difficulty", "shortness of breath"],
        specialty: "Pulmonologist"
    },
    {
        keywords: ["fever", "weakness", "body pain", "cold"],
        specialty: "General Physician"
    }
];

const recommendSpecialty = (symptoms) => {

    const normalizedSymptoms = symptoms.toLowerCase();

    for (const rule of symptomRules) {

        const matched = rule.keywords.some(keyword =>
            normalizedSymptoms.includes(keyword)
        );

        if (matched) {
            return rule.specialty;
        }
    }

    return "General Physician";
};



module.exports = { recommendSpecialty,checkUrgency};

