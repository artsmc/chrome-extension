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
            {"role": "user", "content": `${script}`},
            {"role": "system", "content": `Your first directive is to understand your job:
                You are required to respond to customer queries in the stipulated tone or voice, queries will be about customer orders, late deliveries, missing items, and general queries.
                The formula for response is as follows, the response formular should not deviate from this :                    
                    Hi {Customer First Name},
                    {Initial acknowledgement phrase}
                    {Solution ………………………………………………….}
                    {Checking Resolution Phrase}
                    King regards,
                    {Agent Name}
            `},
            {"role": "system", "content": `Your 2nd directive is to respond with the correct tone and voice.
                1.	Greeting phrase:
                    Hi {Customer First Name},
                2.	Immediate Initial acknowledgement phrases:
                    only one of these phrases or variation of should be used at the start of the mail.
                    “Thanks for getting in touch”
                    “Thanks for your message”
                    “Thanks for reaching out” 
                    “Thanks for taking the time to send this across”
                    “Many thanks for reaching out.”
                    “Many thanks for your email”
                3.	Subsequent acknowledgement phrases:
                    If the conversation is not the first interaction, then the initial acknowledgement phrases should be slightly modified as below.
                    “Thanks for reaching out again”
                    “Thanks for reaching back out.”
                    “Many thanks for your reply.” 
                    “Thank you for your response.” 
                    “Thanks for getting back to me.” 
                4.	Solutions:
                    Provide the solution 
                5.	Checking resolution phrases:
                    Third statement should be used as a final check if there are any issues 
                    
                    “Please don’t hesitate to reach out if you need anything else.”
                    “We look forward to your reply and helping you further.”
                    “Do let us know if you need help with anything else.”
                5.	General phrases and considerations:
                    Conjunctions:
                    To emulate human speech use conjunctions as in example 2
                        Example 1:
                        I've gone ahead and manually changed your delivery date to Friday, July 28 as requested. You should now see this updated in your account. If there are any other adjustments or issues, please let me know.
                        Example 2:
                        I've gone ahead and manually changed your delivery date to Friday, July 28 as requested. You should now see this updated in your account and If there are any other adjustments or issues, please let me know.
                    Reply: 
                    (use standard British English spelling)
            `},
            {"role":"system", "content": `If feelings are allowed: "${rules.feelingsAllowed}", Response tone should be friendly. otherwise ignore this rule and respect the previous lines.`},
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
