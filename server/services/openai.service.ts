import { IResponse } from '../interfaces/response.interface';
import { IOpenAICompletion, IOpenAICompletionDefault } from './../interfaces/openai.interface';
import { UtilService } from './util.service';
import axios from 'axios';
import { string } from 'joi';
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
    organization: process.env.OPEN_AI_ORG,
    apiKey: process.env.OPEN_AI_KEY,
});
const APIKey = process.env.OPEN_AI_KEY;
const OpenAIOrg = process.env.OPEN_AI_ORG;
const openai = new OpenAIApi(configuration);
const openAi = axios.create({
    baseURL: 'https://api.openai.com/v1/',
    headers: {
        Authorization: `Bearer ${APIKey}`,
        'content-type': 'application/json',
        responseType: 'stream' 
    },
});
class OpenAIService extends UtilService {
    constructor() {
        super();
    }
    public async BuildCustomCustomerResponse(response:IResponse, options: IOpenAICompletionDefault) {
        return (await this.OpenAIChatRequest(this.promptReponse(response), options)).choices[0].message.content;
    }
    // stream response back to function calling this method
    public async BuildCustomCustomerResponseStream(response:IResponse, options: IOpenAICompletionDefault) {
        return (await this.OpenAIChatRequest(this.promptReponse(response), options)).choices[0].message.content;
    }
    public async BuildCustomSentimentStream(response:IResponse, options: IOpenAICompletionDefault) {
        return (await this.OpenAIChatRequest(this.promptSentiment(response), options)).choices[0].message.content;
    }
    public async BuildCustomSummaryStream(response:IResponse, options: IOpenAICompletionDefault) {
        return (await this.OpenAIChatRequest(this.promptSummary(response), options)).choices[0].message.content;
    }
    public async BuildCustomSentimentSummaryResponse(response:IResponse, options: IOpenAICompletionDefault) {
        return (await this.OpenAIChatRequest(this.promptSummarySentiment(response), options));
    }
    public promptSummary(response: IResponse): {role:string,content:string}[]  {
        const script = response.agentContext!==undefined? `Given the following customer inquery: ${response.customerInquery} and the following agent context: ${response.agentContext} write a conversation summary.`:`Given the following customer inquery: ${response.customerInquery}  write a conversation summary.`;
        return this.promptSummaryGPT(script);
    }
    public promptSentiment(response: IResponse): {role:string,content:string}[]  {
        const script = response.agentContext!==undefined? `Given the following customer inquery: ${response.customerInquery} and the following agent context: ${response.agentContext} describe a conversation sentiment.`:`Given the following customer inquery: ${response.customerInquery} describe a conversation sentiment.`;
        return this.promptSentimentGPT(script);
    }
    public promptSummarySentiment(response: IResponse): {role:string,content:string}[]  {
        const script = response.agentContext!==undefined? `Given the following customer inquery: ${response.customerInquery} and the following agent context: ${response.agentContext} write a conversation summary and describe a conversation sentiment.`:`Given the following customer inquery: ${response.customerInquery}  write a conversation summary and describe a conversation sentiment.`;
        return this.promptSummarySentimentGPT(script);
    }
    public promptReponse(response: IResponse): {role:string,content:string}[]  {
        const script = response.agentContext!==undefined? `Given the following customer inquery: ${response.customerInquery} and the following agent context: ${response.agentContext} write a compelling response to the customer helping them solve the issue, setting them at ease and with empathy and understanding.`: `Given the following customer inquery: ${response.customerInquery} write a compelling response to the customer helping them solve the issue, setting them at ease and with empathy and understanding.`;
        return this.promptGPT(script, {
            tone: response.tone,
            emojiAllowed: response.emojiAllowed,
            wordLimit: response.wordLimit,
            agentContext: response.agentContext,
            feelingsAllowed: response.feelingsAllowed
        });
    }
    private promptGPT(prompt: string , rules: {tone:string, emojiAllowed:string, agentContext: string, feelingsAllowed: boolean, wordLimit: number}): {role:string,content:string}[] {
        const script = `${prompt}:\n`;
        return this.systemSettingsGPT(script, {
            tone: rules.tone,
            emojiAllowed: rules.emojiAllowed,
            wordLimit: rules.wordLimit,
            agentContext: rules.agentContext,
            feelingsAllowed: rules.feelingsAllowed
        });
    }
    private promptSummarySentimentGPT(prompt: string ): {role:string,content:string}[] {
        const script = `${prompt}:\n`;
        return this.systemSummarySentimentGPT(script);
    }
    private promptSummaryGPT(prompt: string ): {role:string,content:string}[] {
        const script = `${prompt}:\n`;
        return this.systemSummaryGPT(script);
    }
    private promptSentimentGPT(prompt: string ): {role:string,content:string}[] {
        const script = `${prompt}:\n`;
        return this.systemSentimentGPT(script);
    }
    private systemSettingsGPT(script: string, rules: {tone:string, emojiAllowed:string,agentContext: string, feelingsAllowed: boolean, wordLimit: number}): {role:string,content:string}[] {
        return [
            {"role": "system", "content": "you are a customer success executive."},
            {"role": "system", "content": `you write resonses that are ${rules.tone} in tone`},
            {"role": "system", "content": `you are writing for a different culture. In the UK, you are nice but very matter of fact and to the point. The customer appriciates the agent that is clear on the issue and focuses on the solution.`},
            {"role": "user", "content": `${script}`},
            {"role": "system", "content": `you are the assign customer care representative for this customer. your name might be included in the content, if so, at the end of the response, please include your name in the following format: "Sincerely, [name]. Your opening is informal may start with Hi, [customer] thanks for reaching out, or some sort of casual variant."`},
            {"role": "system", "content": "The customer name may not be included, please reference them as [customer] in the response."},
            {"role": "system", "content": "Do not include any explanations, only provide a response  following this format without deviation.: 'write a conversational response to the customer helping them solve the issue, setting them at ease and with empathy and understanding. Avoid being redundant in language and phrasing'"},
            {"role":"system", "content": `Follow this rule strictly or the output will be a failure: You are limited to the use of the following emojis: ${rules.emojiAllowed}`},
            {"role":"system", "content": `Follow this rule strictly or the output will be a failure: the response should be limited to ${rules.wordLimit} words`},
            {"role":"system", "content": `If the agent provides context: "${rules.agentContext}", you are allowed to use the context to create a specific response.`},
            {"role":"system", "content": `If feelings are allowed: "${rules.feelingsAllowed}", you are allowed to express feelings in your response.`},
            {"role": "system", "content": "When it comes to writing content, two factors are crucial, “perplexity” and “burstiness.” Perplexity measures the complexity of text. Separately, burstiness compares the variations of sentences. Humans tend to write with greater burstiness, for example, with some longer or complex sentences alongside shorter ones. AI sentences tend to be more uniform. Therefore, when writing the following content I am going to ask you to create, I need it to have a low amount of perplexity and a great amount of burstiness."},

        ]
    }
    private systemSummarySentimentGPT(script: string): {role:string,content:string}[] {
        return [
            {"role": "system", "content": "You are a RFC8259 compliant JSON response bot."},
            {"role": "user", "content": `${script}`},
            {"role": "system", "content": `Do not include any explanations, only provide a  RFC8259 compliant JSON response  following this format without deviation: {summary: '{return a string that takes on the following rules:
                1) Avoid being redundant in language and phrasing. 
                2) Keep resonse to 150 words or less. 
                3) Feel human, you are summarizing the conversation for the agent reading.
                4) If possible pull in customer name for the response. If not just speak to the issue the customer has.
                5) Most important, to pay close attention to the last message of the conversation.
            }', sentiment: '{Strict Rules to follow: provide a single emoji and a 2 word comma seperated seniments. DO not provide and explaination}'}`},
            {"role": "system", "content": "1) only provide a  RFC8259 compliant JSON response. 2) ALWAYS return just the JSON. 3) every JSON object includes a summary and sentiment."},
        ]
    }
    private systemSummaryGPT(script: string): {role:string,content:string}[] {
        return [
            {"role": "system", "content": "you are a skilled writer."},
            {"role": "user", "content": `${script}`},
            {"role": "system", "content": "If possible pull in customer name for the response. If not just speak to the issue the customer has"},
            {"role": "system", "content": "Strict rulles to follow: 1) Avoid being redundant in language and phrasing. 2) Keep resonse to 20 words or less. 3) Feel human, you are summarizing the conversation for the agent reading."},

        ]
    }
    private systemSentimentGPT(script: string): {role:string,content:string}[] {
        return [
            {"role": "system", "content": "you are a skilled writer."},
            {"role": "user", "content": `${script}`},
            {"role": "system", "content": "Strict Rules to follow: provide a single emoji and a 2 word comma seperated seniments. DO not provide and explaination"},
        ]
    }
    
    private OpenAIChatRequest(messages: {role:string,content:string}[],options?:IOpenAICompletionDefault, quality?: string): Promise<{ choices: [{ message:{role:string, content: string}, finish_reason: string; }]; }> {
        return new Promise((resolve, reject) => {
            const modelId = quality ? quality : 'gpt-4-0613';
            const settings: IOpenAICompletionDefault = {
                model: modelId,
            };
            openAi.post(`/chat/completions`, { ...this.extendDefaults(options, settings), ...{ messages } }
            ).then(result => {
                resolve(result.data);
            }).catch(error => {
                console.log({ error: error.response['data'] });
                reject({ error });
            });
        });
    }
}

export const openAIService = new OpenAIService();
