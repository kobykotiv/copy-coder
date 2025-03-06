import axios from 'axios';

export class Ollama {
  private static BASE_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api';

  static async call(prompt: string, currentModel: string): Promise<string> {
    try {
      const response = await axios.post(`${this.BASE_URL}/generate`, {
        model: currentModel,
        prompt: prompt,
        stream: false
      });

      return response.data.response || 'No response from Ollama';
    } catch (error) {
      console.error('Ollama API Error:', error);
      throw new Error('Failed to interact with Ollama');
    }
  }
}