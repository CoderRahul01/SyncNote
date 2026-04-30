import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const geminiService = {
  async summarizeContent(url: string, source: string) {
    const prompt = `
      Act as an expert Knowledge Synthesis Agent on the Gemini Enterprise Agent Platform. 
      The user has provided a URL from ${source}: ${url}.
      
      Generate a structured knowledge note including:
      - title: Concise title.
      - takeaways: 3-5 items, each with 'text' and an optional 'timestamp' (e.g. "0:42").
      - actionItems: 3-5 specific strings.
      - technicalContext: Code snippet or logic.
      - fullSummary: Overview.
      - verificationStatus: One of 'verified', 'unverified', or 'caution' based on technical complexity and typical content safety.
      - executionTrace: Provide 4 steps representing the internal multi-agent reasoning flow (e.g. "Multimodal Extraction", "Logic Verification", "Semantic Mapping").
      
      Infer content realistically or provide high-quality developer-focused insights if URL is inaccessible.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              takeaways: { 
                type: Type.ARRAY,
                items: { 
                  type: Type.OBJECT,
                  properties: {
                    text: { type: Type.STRING },
                    timestamp: { type: Type.STRING }
                  },
                  required: ["text"]
                }
              },
              actionItems: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              technicalContext: { type: Type.STRING },
              fullSummary: { type: Type.STRING },
              verificationStatus: { type: Type.STRING, enum: ['verified', 'unverified', 'caution'] },
              executionTrace: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    step: { type: Type.STRING },
                    status: { type: Type.STRING, enum: ['completed', 'processing', 'verified'] },
                    timestamp: { type: Type.STRING }
                  },
                  required: ["step", "status", "timestamp"]
                }
              }
            },
            required: ["title", "takeaways", "actionItems", "technicalContext", "fullSummary", "verificationStatus", "executionTrace"]
          }
        }
      });

      return JSON.parse(response.text);
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  },

  async chatWithNote(noteTitle: string, userMessage: string, history: { role: 'user' | 'assistant', content: string }[]) {
    const formattedHistory = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...formattedHistory.map(h => ({ role: h.role as any, parts: h.parts })),
        { role: 'user', parts: [{ text: `Context: We are discussing the knowledge note titled "${noteTitle}". ${userMessage}` }] }
      ]
    });

    return response.text;
  }
};
