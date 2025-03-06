import { NextRequest, NextResponse } from 'next/server';
import { Ollama } from '@/lib/ollama';
import { Gemini } from '@/lib/gemini';
import { Mediator } from '@/lib/mediator';

// Define model handler type
type ModelHandler = (prompt: string, model: string) => Promise<string>;

// Define supported models with proper typing
const SUPPORTED_MODELS: Record<string, Record<string, ModelHandler>> = {
  ollama: {
    'llama2': Ollama.call,
    'mistral': Ollama.call,
    'phi': Ollama.call
  },
  gemini: {
    'gemini-pro': Gemini.call,
    'gemini-pro-vision': Gemini.call
  }
};

export async function POST(request: NextRequest) {
  try {
    const { modelType, modelName, prompt } = await request.json();

    // Validate input
    if (!modelType || !modelName || !prompt) {
      return NextResponse.json(
        { error: 'Missing required parameters' }, 
        { status: 400 }
      );
    }

    // Check if model is supported
    const modelCategory = SUPPORTED_MODELS[modelType];
    const modelHandler = modelCategory?.[modelName] as ModelHandler | undefined;

    if (!modelHandler) {
      return NextResponse.json(
        { error: 'Unsupported model' }, 
        { status: 400 }
      );
    }

    // Use mediator for processing
    const response = await Mediator.processInteraction({
      model: (p: string) => modelHandler(p, modelName),
      prompt
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error('LLM API Error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'Unexpected error processing LLM request' 
      }, 
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';