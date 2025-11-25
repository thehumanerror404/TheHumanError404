'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';
import roastsData from '@/data/roasts.json';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getGeminiMatch(userInput: string) {
    if (!process.env.GEMINI_API_KEY) {
        console.warn('GEMINI_API_KEY is not set');
        return 'Default';
    }

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const jobKeys = Object.keys(roastsData).filter(key => key !== 'Default');

        const prompt = `
        You are an AI designed to match a user's input profession to the closest matching profession from a predefined list.
        
        User Input: "${userInput}"
        
        Predefined List:
        ${JSON.stringify(jobKeys)}
        
        Task:
        1. Analyze the User Input and find the semantically closest match in the Predefined List.
        2. If the input is a specific role (e.g., "React Developer"), match it to the broader category (e.g., "Frontend Engineer" or "Software Engineer").
        3. If the input is completely unrelated or gibberish, return "Default".
        4. Return ONLY the exact string from the Predefined List (or "Default"). Do not add any explanation or extra characters.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        // Verify the returned text is actually in our list
        if (jobKeys.includes(text)) {
            return text;
        }

        return 'Default';
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return 'Default';
    }
}
