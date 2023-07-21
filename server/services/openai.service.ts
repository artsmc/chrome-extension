import { IResponse } from '../interfaces/response.interface';
import { IOpenAICompletion, IOpenAICompletionDefault } from './../interfaces/openai.interface';
import { UtilService } from './util.service';
import axios from 'axios';
import { string } from 'joi';
import * as dotenv from 'dotenv';

dotenv.config();
const APIKey = process.env.OPEN_AI_KEY;
const OpenAIOrg = process.env.OPEN_AI_ORG;
const openAi = axios.create({
    baseURL: 'https://api.openai.com/v1/',
    headers: {
        Authorization: `Bearer ${APIKey}`,
        'content-type': 'application/json',
    },
});
class OpenAIService extends UtilService {
    constructor() {
        super();
    }
    public async BuildCustomCustomerResponse(response:IResponse, options: IOpenAICompletionDefault) {
        return (await this.OpenAIChatRequest(this.promptReponse(response), options)).choices[0].message.content;
    }
    private promptReponse(response: IResponse): {role:string,content:string}[]  {
        const script = response.agentContext!==undefined? `Given the following customer inquery: ${response.customerInquery} and the following agent context: ${response.agentContext} write a compelling response to the customer helping them solve the issue, setting them at ease and with empathy and understanding.`: `Given the following customer inquery: ${response.customerInquery} write a compelling response to the customer helping them solve the issue, setting them at ease and with empathy and understanding.`;
        return this.promptGPT(script, {
            tone: response.tone,
            emojiAllowed: response.emojiAllowed,
            characterLimit: response.characterLimit,
            agentContext: response.agentContext,
            feelingsAllowed: response.feelingsAllowed
        });
    }
    private promptGPT(prompt: string , rules: {tone:string, emojiAllowed:string, agentContext: string, feelingsAllowed: boolean, characterLimit: number}): {role:string,content:string}[] {
        const script = `${prompt}:\n`;
        return this.systemSettingsGPT(script, {
            tone: rules.tone,
            emojiAllowed: rules.emojiAllowed,
            characterLimit: rules.characterLimit,
            agentContext: rules.agentContext,
            feelingsAllowed: rules.feelingsAllowed
        });
    }
    private systemSettingsGPT(script: string, rules: {tone:string, emojiAllowed:string,agentContext: string, feelingsAllowed: boolean, characterLimit: number}): {role:string,content:string}[] {
        return [
            {"role": "system", "content": "you are a customer care representative."},
            {"role": "system", "content": `you write resonses that are ${rules.tone} in tone`},
            {"role": "user", "content": `${script}`},
            {"role": "system", "content": "Do not include any explanations, only provide a response  following this format without deviation.: 'write a compelling response to the customer helping them solve the issue, setting them at ease and with empathy and understanding.'"},
            {"role":"system", "content": `Follow this rule strictly or the output will be a failure: You are limited to the use of the following emojis: ${rules.emojiAllowed}`},
            {"role":"system", "content": `Follow this rule strictly or the output will be a failure: the response should be limited to ${rules.characterLimit} characters`},
            {"role":"system", "content": `If the agent provides context: "${rules.agentContext}", you are allowed to use the context to create a specific response.`},
            {"role":"system", "content": `If feelings are allowed: "${rules.feelingsAllowed}", you are allowed to express feelings in your response.`},
            {"role": "system", "content": "When it comes to writing content, two factors are crucial, “perplexity” and “burstiness.” Perplexity measures the complexity of text. Separately, burstiness compares the variations of sentences. Humans tend to write with greater burstiness, for example, with some longer or complex sentences alongside shorter ones. AI sentences tend to be more uniform. Therefore, when writing the following content I am going to ask you to create, I need it to have a low amount of perplexity and a great amount of burstiness."},

        ]
    }
    private OpenAIChatRequest(messages: {role:string,content:string}[],options?:IOpenAICompletionDefault, quality?: string): Promise<{ choices: [{ message:{role:string, content: string}, finish_reason: string; }]; }> {
        return new Promise((resolve, reject) => {
            const modelId = quality ? quality : 'gpt-3.5-turbo';
            const settings: IOpenAICompletionDefault = {
                model: modelId
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
