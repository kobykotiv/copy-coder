import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OLLAMA_API_URL = 'https://api.ollama.com/v1';

async function sendRequestToOllama(prompt) {
  try {
    const response = await axios.post(
      `${OLLAMA_API_URL}/generate`,
      {
        prompt: prompt,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OLLAMA_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
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
