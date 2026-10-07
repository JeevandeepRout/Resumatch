import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env.LLM_API_KEY || ''
});

export const analysisSchema = {
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
    required: [
        'overallScore', 'skillsScore', 'experienceScore', 'projectsScore', 'keywordsScore', 
        'strengths', 'weaknesses', 'missingSkills', 'suggestions'
    ]
};

export const jobMatchSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: { type: Type.INTEGER, description: 'Score from 0-100 indicating how well the resume matches the job description' },
        matchedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
        recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ['matchScore', 'matchedSkills', 'missingSkills', 'recommendations']
};

export const rewriteSchema = {
    type: Type.OBJECT,
    properties: {
        suggestedText: { type: Type.STRING, description: 'The rewritten resume bullet point or section' },
        explanation: { type: Type.STRING, description: 'Brief explanation of what was improved' },
    },
    required: ['suggestedText', 'explanation']
};

export async function analyzeResume(resumeText: string) {
    const prompt = `Analyze the following resume and provide structured feedback.\n\nRESUME:\n${resumeText}\n\n`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: analysisSchema
        }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error('No response from AI');
}

export async function analyzeJobMatch(resumeText: string, jobDescription: string) {
    const prompt = `Compare the following resume with the job description. Identify the match score, matched skills, missing skills, and provide recommendations.\n\nRESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}\n\n`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: jobMatchSchema
        }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error('No response from AI');
}

export async function rewriteResumeContent(originalText: string) {
    const prompt = `Rewrite the following resume bullet point or section to be more impactful, concise, and action-oriented. Do NOT invent new facts, metrics, or experiences that are not present in the original text.\n\nORIGINAL TEXT:\n${originalText}\n\n`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
            responseSchema: rewriteSchema
        }
    });

    if (response.text) {
        return JSON.parse(response.text);
    }
    throw new Error('No response from AI');
}
