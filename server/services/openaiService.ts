```typescript
import axios from 'axios';
import { OpenAIPrompt, OpenAIResponse } from '../models/openai.models';

const OPENAI_API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions';

export class OpenAIService {
  private static instance: OpenAIService;

  private constructor() {}

  public static getInstance(): OpenAIService {
    if (!OpenAIService.instance) {
      OpenAIService.instance = new OpenAIService();
    }

    return OpenAIService.instance;
  }

  public async generateResponse(prompt: OpenAIPrompt): Promise<OpenAIResponse> {
    const response = await axios.post(OPENAI_API_URL, prompt, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    });

    return response.data;
  }
}
```