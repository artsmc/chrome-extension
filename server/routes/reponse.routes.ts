import * as Boom from 'boom';
import { Request, Response, Router } from 'express';
import { companyController } from '../controllers/company/company.controller';
import { responseController } from '../controllers/response/response.controller';
import { openAIService } from '../services/openai.service';
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const router: Router = Router();
router.get('/test', (req: Request, res: Response) => {
  res.status(200).json({});
});

router.post('/agent-request/', (req: Request, res: Response) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); 
  const completion = openai.createChatCompletion({
    model: "gpt-4-1106-preview",
    stream: true,
    messages: openAIService.promptReponse(req.body)
  }, {
    responseType: 'stream'
  });

  let buffer = ''; // Buffer to accumulate stream chunks
  completion.then(resp => {
    resp.data.on('data', data => {
      buffer += data.toString(); // Append new data to buffer
  
      // Process buffer line by line
      let index;
      while ((index = buffer.indexOf('\n')) >= 0) { // While there are newlines in the buffer
        let line = buffer.substring(0, index); // Get line from buffer
        buffer = buffer.substring(index + 1); // Remove processed line from buffer
        
        if (line.trim() === '') { // Skip empty lines
          continue;
        }
  
        if (line === 'data: [DONE]') {
          res.end();
          return;
        }
  
        try {
          const message = line.replace(/^data: /, '');
          const parsed = JSON.parse(message); // Parse complete line as JSON
          const word = parsed.choices[0].delta.content ?? ' '; // Use Nullish Coalescing Operator for safer fallback
          res.write(`data: ${word}\n\n`);
        } catch (error) {
          // Handle JSON parse errors without terminating the entire stream
          console.error(error);
          // Consider writing an error to the client if necessary
        }
      }
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: error.message }); // Send error response with status code
  });
});
router.post('/agent-sentiment/', (req: Request, res: Response) => {
  console.log('Sentiment',req.body);
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); 
  const completion = openai.createChatCompletion({
    "model":"gpt-4-1106-preview",
    // "model":"gpt-3.5-turbo",
    "stream": true,
    messages: openAIService.promptSentiment(req.body)
  }, {
    responseType: 'stream' 
  });
  let buffer = ''; // Buffer to accumulate stream chunks
  completion.then(resp => {
    resp.data.on('data', data => {
      buffer += data.toString(); // Append new data to buffer
  
      // Process buffer line by line
      let index;
      while ((index = buffer.indexOf('\n')) >= 0) { // While there are newlines in the buffer
        let line = buffer.substring(0, index); // Get line from buffer
        buffer = buffer.substring(index + 1); // Remove processed line from buffer
        
        if (line.trim() === '') { // Skip empty lines
          continue;
        }
  
        if (line === 'data: [DONE]') {
          res.end();
          return;
        }
  
        try {
          const message = line.replace(/^data: /, '');
          const parsed = JSON.parse(message); // Parse complete line as JSON
          const word = parsed.choices[0].delta.content ?? ' '; // Use Nullish Coalescing Operator for safer fallback
          res.write(`data: ${word}\n\n`);
        } catch (error) {
          // Handle JSON parse errors without terminating the entire stream
          console.error(error);
          // Consider writing an error to the client if necessary
        }
      }
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: error.message }); // Send error response with status code
  });
});
router.post('/agent-summary/', (req: Request, res: Response) => {
  console.log('SUMAARY',req.body);
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders(); 
  const completion = openai.createChatCompletion({
    "model":"gpt-4-1106-preview",
    // "model":"gpt-3.5-turbo",
    "stream": true,
    messages: openAIService.promptSummary(req.body)
  }, {
    responseType: 'stream' 
  });
  let buffer = ''; // Buffer to accumulate stream chunks
  completion.then(resp => {
    resp.data.on('data', data => {
      buffer += data.toString(); // Append new data to buffer
  
      // Process buffer line by line
      let index;
      while ((index = buffer.indexOf('\n')) >= 0) { // While there are newlines in the buffer
        let line = buffer.substring(0, index); // Get line from buffer
        buffer = buffer.substring(index + 1); // Remove processed line from buffer
        
        if (line.trim() === '') { // Skip empty lines
          continue;
        }
  
        if (line === 'data: [DONE]') {
          res.end();
          return;
        }
  
        try {
          const message = line.replace(/^data: /, '');
          const parsed = JSON.parse(message); // Parse complete line as JSON
          const word = parsed.choices[0].delta.content ?? ' '; // Use Nullish Coalescing Operator for safer fallback
          res.write(`data: ${word}\n\n`);
        } catch (error) {
          // Handle JSON parse errors without terminating the entire stream
          console.error(error);
          // Consider writing an error to the client if necessary
        }
      }
    });
  }).catch(error => {
    console.log(error);
    res.status(500).json({ message: error.message }); // Send error response with status code
  });
});
router.post('/agent-summary-sentiment/', (req: Request, res: Response) => {
  openAIService.BuildCustomSentimentSummaryResponse(req.body,{model:'gpt-4-1106-preview'}).then((response: any) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(400).json(error);
  })
});



export const ResponseRouter: Router = router;
