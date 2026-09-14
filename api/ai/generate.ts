import { GoogleGenAI } from '@google/genai';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function handler(req: any, res: any) {
  // CORS support for Vercel Serverless Functions
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { prompt, systemInstruction, isJson, responseSchema } = req.body || {};

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid "prompt" parameter in request body.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      return res.status(200).json({
        success: false,
        isFallback: true,
        text: '',
        message: 'GEMINI_API_KEY is not configured yet. Using local intelligent template.',
      });
    }

    const ai = new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const config: any = {};
    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (isJson) {
      config.responseMimeType = 'application/json';
      if (responseSchema) {
        config.responseSchema = responseSchema;
      }
    }

    // Multi-model resilience cascade: if one experiences a temporary 503 or 429 spike, try the next
    const candidateModels = ['gemini-3.6-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let responseText = '';
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config,
        });

        if (response && response.text) {
          responseText = response.text;
          break; // Successfully generated!
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} encountered error, trying next candidate:`, err?.message || err);
        // If rate-limited or high demand, brief backoff
        await delay(500);
      }
    }

    if (responseText) {
      return res.status(200).json({
        success: true,
        text: responseText,
        isFallback: false,
      });
    }

    // If all models encountered spikes or errors, gracefully return fallback
    console.error('All Gemini candidate models exhausted:', lastError?.message || lastError);
    return res.status(200).json({
      success: false,
      isFallback: true,
      text: '',
      message: 'AI service experiencing temporary high demand. Switched to smart local templates.',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/generate handler:', error);
    return res.status(200).json({
      success: false,
      isFallback: true,
      text: '',
      error: error.message || 'An error occurred during AI generation. Switched to local fallback.',
    });
  }
}
