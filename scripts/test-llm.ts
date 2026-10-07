import { GoogleGenAI, Type } from '@google/genai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const ai = new GoogleGenAI({
    apiKey: process.env.LLM_API_KEY
});

const schema = {
    type: Type.OBJECT,
    properties: {
        overallScore: { type: Type.INTEGER, description: 'Score from 0-100' },
        skillsScore: { type: Type.INTEGER },
        experienceScore: { type: Type.INTEGER },
        projectsScore: { type: Type.INTEGER },
        keywordsScore: { type: Type.INTEGER },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['overallScore', 'skillsScore', 'experienceScore', 'projectsScore', 'keywordsScore', 'strengths', 'weaknesses', 'missingSkills', 'suggestions']
};

async function main() {
    if (!process.env.LLM_API_KEY || process.env.LLM_API_KEY === 'your_llm_api_key_here') {
        console.log('Skipping LLM test: No valid LLM_API_KEY provided.');
        console.log('Please add a valid LLM_API_KEY to .env.local to test.');
        return;
    }

    const dummyResumeText = "John Doe. Software Engineer. Experienced in React, Node.js, and TypeScript. Developed web apps for 3 years.";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze this resume and provide feedback in JSON: \n\n${dummyResumeText}`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema
            }
        });
        
        console.log("LLM Structured Output:");
        console.log(response.text);
    } catch (e) {
        console.error("LLM Error:", e);
    }
}

main();
