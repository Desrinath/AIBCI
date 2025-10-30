import { PatientNeed } from "../types";

/**
 * Generates care suggestions for a given patient need using the Gemini model.
 * @param need The patient's need (e.g., Food, Water).
 * @returns A promise that resolves to an array of string suggestions.
 */
export const getCareSuggestions = async (need: PatientNeed): Promise<string[]> => {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `You are an expert caregiver assistant for non-verbal patients using a Brain-Computer Interface.
The patient has indicated they need: "${need}".
Provide a concise, numbered list of 3-4 simple, actionable suggestions for a caregiver.
The tone should be supportive, clear, and practical. Do not include a preamble or conclusion, only the numbered list.
Example for "Water":
1. Offer a glass of water with a straw.
2. Check if their mouth appears dry.
3. Ask simple yes/no questions they can answer, like "Are you thirsty?".
4. Ensure water is within their easy reach if they have mobility.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const text = response.text;
        
        // Process the response text into a clean array of suggestions
        if (!text) {
            return ["No suggestions available at this time."];
        }

        const suggestions = text
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.replace(/^\d+\.\s*/, '')); // Remove numbering like "1. "

        return suggestions.length > 0 ? suggestions : ["Could not parse suggestions from the response."];

    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to get suggestions from AI model.");
    }
};