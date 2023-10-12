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
    "model":"gpt-4-0613",
    // "model":"gpt-3.5-turbo",
    "stream": true,
    messages: openAIService.promptReponse(req.body)
  }, {
    responseType: 'stream' 
  });
  completion.then(resp => {
    resp.data.on('data', data => {
        const lines = data.toString().split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
            const message = line.replace(/^data: /, ' ');
            // console.log({message})
            if (message === ' [DONE]') {
              res.end();
              return;
            }
            const parsed = JSON.parse(message);
            const word = parsed.choices[0].delta.content ? parsed.choices[0].delta.content: ' ';
            res.write(`data: ${word}\n\n`);
        }
    });
  }).catch((error) => {
    console.log(error);
    res.write(`data: ${error.message}`);
    res.end();
    // res.status(400).json(error);
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
    "model":"gpt-4-0613",
    // "model":"gpt-3.5-turbo",
    "stream": true,
    messages: openAIService.promptSentiment(req.body)
  }, {
    responseType: 'stream' 
  });
  completion.then(resp => {
    resp.data.on('data', data => {
        const lines = data.toString().split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
            const message = line.replace(/^data: /, ' ');
            // console.log({message})
            if (message === ' [DONE]') {
              res.end();
              return;
            }
            const parsed = JSON.parse(message);
            const word = parsed.choices[0].delta.content ? parsed.choices[0].delta.content: ' ';
            res.write(`data: ${word}\n\n`);
        }
    });
  }).catch((error) => {
    console.log(error);
    res.write(`data: ${error.message}`);
    res.end();
    // res.status(400).json(error);
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
    "model":"gpt-4-0613",
    // "model":"gpt-3.5-turbo",
    "stream": true,
    messages: openAIService.promptSummary(req.body)
  }, {
    responseType: 'stream' 
  });
  completion.then(resp => {
    resp.data.on('data', data => {
        const lines = data.toString().split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
            const message = line.replace(/^data: /, ' ');
            // console.log({message})
            if (message === ' [DONE]') {
              res.end();
              return;
            }
            const parsed = JSON.parse(message);
            const word = parsed.choices[0].delta.content ? parsed.choices[0].delta.content: ' ';
            res.write(`data: ${word}\n\n`);
        }
    });
  }).catch((error) => {
    console.log(error);
    res.write(`data: ${error.message}`);
    res.end();
    // res.status(400).json(error);
  });
});
router.post('/agent-summary-sentiment/', (req: Request, res: Response) => {
  openAIService.BuildCustomSentimentSummaryResponse(req.body,{model:'gpt-4-0613'}).then((response: any) => {
    res.status(200).json(response);
  }).catch((error) => {
    res.status(400).json(error);
  })
});



export const ResponseRouter: Router = router;
