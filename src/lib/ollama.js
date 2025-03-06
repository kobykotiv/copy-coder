import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OLLAMA_API_URL = 'https://localhost:11434';

async function sendRequestToOllama(prompt) {
  try {
    const response = await axios.post(
      `${OLLAMA_API_URL}/generate`,
      {
        prompt: prompt,
      },

    );
    return response.data;
  } catch (error) {
    console.error('Error sending request to Ollama:', error);
    throw error;
  }
}

async function getResponseFromOllama(prompt) {
  const response = await sendRequestToOllama(prompt);
  return response.choices[0].text;
}

export { getResponseFromOllama };
