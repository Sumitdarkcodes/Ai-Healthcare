// symptoms that need emergency care right away
const urgentSymptoms = [
    "severe chest pain",
    "difficulty breathing",
    "unconscious",
    "loss of consciousness",
    "stroke symptoms",
    "severe bleeding"
];

// check if the symptoms contain any urgent keyword
const checkUrgency = (symptoms) => {
    const text = symptoms.toLowerCase();                 // convert to lowercase for matching

    return urgentSymptoms.some((urgent) => text.includes(urgent));
};

// rules to match symptoms with the right doctor type
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

// go through rules and return the first matching specialty
const recommendSpecialty = (symptoms) => {
    const text = symptoms.toLowerCase();

    for (const rule of symptomRules) {
        const matched = rule.keywords.some((keyword) => text.includes(keyword));

        if (matched) {
            return rule.specialty;
        }
    }

    return "General Physician";                          // fallback if nothing matches
};

module.exports = { recommendSpecialty, checkUrgency };