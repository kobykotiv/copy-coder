import { getResponseFromOllama } from './ollama';
import { generatePrompt } from './gemini';

async function enhancePromptWithDumberLLM(prompt) {
  try {
    const enhancedPrompt = await getResponseFromOllama(prompt);
    return enhancedPrompt;
  } catch (error) {
    console.error('Error enhancing prompt with dumber LLM:', error);
    throw error;
  }
}

async function getEnhancedPrompt(prompt) {
  try {
    const enhancedPrompt = await enhancePromptWithDumberLLM(prompt);
    const response = await sendToSmarterModel(enhancedPrompt);
    return processResponse(response);
  } catch (error) {
    console.error('Error getting enhanced prompt:', error);
    throw error;
  }
}

async function sendToSmarterModel(enhancedPrompt) {
  try {
    const response = await generatePrompt(enhancedPrompt);
    return response;
  } catch (error) {
    console.error('Error sending to smarter model:', error);
    throw error;
  }
}

function processResponse(response) {
  try {
    // Process the response from the smarter model and format it as needed
    return response;
  } catch (error) {
    console.error('Error processing response:', error);
    throw error;
  }
}

async function fallbackMechanism(prompt) {
  try {
    const enhancedPrompt = await enhancePromptWithDumberLLM(prompt);
    const response = await sendToSmarterModel(enhancedPrompt);
    return processResponse(response);
  } catch (error) {
    console.error('Error in fallback mechanism:', error);
    throw error;
  }
}

async function useMultipleLLMsInParallel(prompt) {
  try {
    const [ollamaResponse, geminiResponse] = await Promise.all([
      getResponseFromOllama(prompt),
      generatePrompt(prompt),
    ]);
    return {
      ollamaResponse: processResponse(ollamaResponse),
      geminiResponse: processResponse(geminiResponse),
    };
  } catch (error) {
    console.error('Error using multiple LLMs in parallel:', error);
    throw error;
  }
}

export {
  enhancePromptWithDumberLLM,
  getEnhancedPrompt,
  sendToSmarterModel,
  processResponse,
  fallbackMechanism,
  useMultipleLLMsInParallel,
};
