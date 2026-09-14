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
      return res.status(500).json({
        error:
          'GEMINI_API_KEY environment variable is missing. Please set GEMINI_API_KEY in your Vercel project environment variables (Settings > Environment Variables) or local .env file.',
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

    let responseText = '';
    let attempts = 0;
    const maxAttempts = 2; // Initial attempt + 1 retry

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config,
        });

        responseText = response.text || '';
        break; // Successfully generated!
      } catch (err: any) {
        const errMessage = String(err?.message || err);
        const isRateLimit =
          errMessage.includes('429') ||
          errMessage.includes('RESOURCE_EXHAUSTED') ||
          err?.status === 429 ||
          err?.code === 429;

        if (isRateLimit && attempts < maxAttempts) {
          // Automatic 1-time retry after 1.5s delay
          await delay(1500);
          continue;
        }

        if (isRateLimit) {
          return res.status(429).json({
            error: 'AI service is rate-limited, please try again shortly.',
            isRateLimited: true,
          });
        }

        throw err;
      }
    }

    return res.status(200).json({
      success: true,
      text: responseText,
      isFallback: false,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/generate Vercel function:', error);
    return res.status(500).json({
      error: error.message || 'An error occurred during AI generation. Please try again later.',
    });
  }
}
