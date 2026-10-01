import { GoogleGenAI } from '@google/genai';

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
  headers: Record<string, string>;
}

export const handler = async (event: NetlifyEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 503,
      body: JSON.stringify({
        error: 'GEMINI_API_KEY is not configured in Netlify environment variables.',
      }),
    };
  }

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  try {
    const { action, payload } = JSON.parse(event.body || '{}');

    // 1. ANALYZE PDF
    if (action === 'analyze_pdf') {
      const { pdfBase64, fileName, courseCode } = payload || {};
      const prompt = `You are a distinguished university engineering professor in Electrical & Electronic Engineering.
Analyze this uploaded academic document (${fileName || 'Academic Material'}) for course ${courseCode || 'Electrical Engineering'}.
Extract structured engineering knowledge: main topics, definitions, formulas with variables and units, principles, worked examples, past questions, and high-probability exam areas.
Return strict JSON matching the schema with detectedTitle, courseCode, docType, overview, topics, definitions, formulas, principles, workedExamples, pastQuestions, highProbabilityExamAreas, distinctionNotes.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: pdfBase64,
            },
          },
          { text: prompt },
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '{}';
      const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, data: parsedData }),
      };
    }

    // Handle other actions with gemini-3.8-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: JSON.stringify(payload),
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, reply: response.text }),
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Netlify function error';
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: msg }),
    };
  }
};
