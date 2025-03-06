'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ModelInteractionFn } from '@/lib/mediator';

export default function LLMPage() {
  const [selectedModelType, setSelectedModelType] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [localModels, setLocalModels] = useState<string[]>([]);

  useEffect(() => {
    const fetchLocalModels = async () => {
      try {
        const response = await fetch('/api/tags');
        if (!response.ok) {
          throw new Error(`Failed to fetch local models: ${response.status}`);
        }
        const data = await response.json();
        setLocalModels(data.models);
      } catch (error: any) {
        console.error("Error fetching local models:", error.message);
        setError(`Failed to fetch local models: ${error.message}`);
      }
    };

    fetchLocalModels();
  }, []);

  const llmModelTypes = [
    { 
      id: 'ollama', 
      name: 'Ollama', 
      models: localModels.map(modelName => ({ name: modelName, displayName: modelName })),
      handler: async (prompt: string, model: string) => {
        const { Ollama } = await import('@/lib/ollama');
        return Ollama.call(prompt, model);
      }
        },
        { 
      id: 'gemini', 
      name: 'Gemini', 
      models: [],
      handler: async (prompt: string, model: string) => {
        const { Gemini } = await import('@/lib/gemini');
        return Gemini.call(prompt, model);
      }
    }
  ];

  const handleModelInteraction = async () => {
    if (!selectedModelType || !selectedModel) {
      setError('Please select a model type and specific model');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse('');

    try {
      const modelType = llmModelTypes.find(type => type.id === selectedModelType);
      
      if (!modelType) {
        throw new Error('Model type not found');
      }

      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelType: selectedModelType,
          modelName: selectedModel,
          prompt
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An unexpected error occurred');
      }

      setResponse(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">LLM Interaction Interface</h1>
      
      <div className="space-y-2">
        <Select onValueChange={setSelectedModelType}>
          <SelectTrigger>
            <SelectValue placeholder="Select Model Type" />
          </SelectTrigger>
          <SelectContent>
            {llmModelTypes.map(modelType => (
              <SelectItem key={modelType.id} value={modelType.id}>
                {modelType.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedModelType && (
          <Select 
            onValueChange={setSelectedModel}
            disabled={!selectedModelType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Specific Model" />
            </SelectTrigger>
            <SelectContent>
              {llmModelTypes
                .find(type => type.id === selectedModelType)
                ?.models.map(model => (
                  <SelectItem key={model.name} value={model.name}>
                    {model.displayName}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        )}
      </div>

      <textarea 
        className="w-full p-2 border rounded"
        placeholder="Enter your prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
      />

      <Button 
        onClick={handleModelInteraction}
        disabled={!selectedModelType || !selectedModel || !prompt || isLoading}
        className="w-full"
      >
        {isLoading ? 'Processing...' : 'Process Prompt'}
      </Button>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {response && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}