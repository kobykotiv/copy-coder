// Fallback import with type assertions
import { GoogleGenerativeAI } from '@google/generative-ai';

export class Gemini {
  private static genAI: GoogleGenerativeAI | null = null;

  private static initializeGenAI(): GoogleGenerativeAI {
    if (!this.genAI) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not set in environment variables');
      }
      this.genAI = new GoogleGenerativeAI(apiKey);
    }
    return this.genAI;
  }

  static async call(prompt: string, currentModel: string = 'gemini-pro'): Promise<string> {
    try {
      // Initialize GenAI
      const genAI = this.initializeGenAI();

      // Validate model
      const supportedModels = ['gemini-pro', 'gemini-pro-vision'];
      if (!supportedModels.includes(currentModel)) {
        throw new Error(`Unsupported Gemini model: ${currentModel}`);
      }

      // Get generative model
      const model = genAI.getGenerativeModel({ model: currentModel });

      // Generate content
      const result = await model.generateContent(prompt);
      
      // Return text response or default message
      return result.response.text() || 'No response from Gemini';
    } catch (error) {
      console.error('Gemini API Error:', error);
      
      // Provide more specific error messages
      if (error instanceof Error) {
        if (error.message.includes('API_KEY')) {
          throw new Error('Invalid or missing Gemini API key');
        }
        throw new Error(`Gemini interaction failed: ${error.message}`);
      }
      
      throw new Error('Unexpected error in Gemini interaction');
    }
  }
}