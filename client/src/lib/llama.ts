interface LlamaResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class LlamaService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_LLAMA_API_KEY || import.meta.env.VITE_TOGETHER_API_KEY || '';
    this.baseUrl = import.meta.env.VITE_LLAMA_BASE_URL || 'https://api.together.xyz/v1';
    
    if (!this.apiKey) {
      console.warn('No LLaMA API key found. Using fallback endpoint.');
      this.baseUrl = 'https://llama-api.vercel.app/api';
    }
  }

  async askQuestion(question: string, context?: string): Promise<string> {
    try {
      const prompt = context 
        ? `Context: You are an educational assistant helping a student. ${context}\n\nQuestion: ${question}\n\nAnswer:`
        : `You are an educational assistant. Please provide a clear, educational answer to this question: ${question}`;

      if (this.apiKey) {
        // Use Together AI or similar paid API
        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: 'meta-llama/Llama-2-70b-chat-hf',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful educational assistant. Provide clear, accurate, and age-appropriate answers to student questions.'
              },
              {
                role: 'user',
                content: question
              }
            ],
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }

        const data: LlamaResponse = await response.json();
        return data.choices[0]?.message?.content || 'Sorry, I could not generate an answer.';
      } else {
        // Use free fallback API
        const response = await fetch(`${this.baseUrl}/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            max_tokens: 1000,
            temperature: 0.7,
          }),
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        return data.text || data.response || 'Sorry, I could not generate an answer.';
      }
    } catch (error) {
      console.error('LLaMA API error:', error);
      
      // Provide educational fallback response
      return this.getFallbackResponse(question);
    }
  }

  private getFallbackResponse(question: string): string {
    const questionLower = question.toLowerCase();
    
    // Educational fallback responses based on common question patterns
    if (questionLower.includes('photosynthesis')) {
      return "Photosynthesis is the process by which plants convert light energy from the sun into chemical energy (glucose). It occurs in chloroplasts and involves two main stages: light-dependent reactions and the Calvin cycle. Plants take in CO₂ and water, and with sunlight, produce glucose and oxygen. The equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂.";
    }
    
    if (questionLower.includes('water cycle')) {
      return "The water cycle is the continuous movement of water through Earth's atmosphere, land, and oceans. Key processes include: evaporation (water becomes vapor), transpiration (plants release water vapor), condensation (vapor forms clouds), precipitation (rain/snow falls), and collection (water gathers in bodies of water). This cycle is powered by solar energy and gravity.";
    }
    
    if (questionLower.includes('earthquake')) {
      return "Earthquakes are caused by the sudden release of energy stored in Earth's crust. This happens when tectonic plates move against each other along fault lines. When plates get stuck due to friction, stress builds up. When the stress becomes too great, plates suddenly slip, releasing energy as seismic waves that we feel as earthquakes.";
    }
    
    // General educational response
    return `I'm having trouble connecting to the AI service right now, but I'd love to help you learn about "${question}". This is a great educational question! You might want to try researching this topic using reliable educational resources, or ask a teacher or tutor for detailed explanations. Feel free to ask another question, and I'll try again!`;
  }
}

export const llamaService = new LlamaService();
