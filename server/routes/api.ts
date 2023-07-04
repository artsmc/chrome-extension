```typescript
import express from 'express';
import { getOpenAIResponse } from '../services/openaiService';

const router = express.Router();

router.post('/openai', async (req, res) => {
  try {
    const message = req.body.message;
    const response = await getOpenAIResponse(message);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Error processing OpenAI request' });
  }
});

export default router;
```