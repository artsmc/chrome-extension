import { IOpenAICompletion, IOpenAICompletionDefault } from './../interfaces/openai.interface';
import { UtilService } from './util.service';
import axios from 'axios';
import { string } from 'joi';

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
    public async BuildCustomCustomerResponse(prompt: string, options: IOpenAICompletionDefault, topic: string, quality?: string) {
        const summary = (await this.OpenAIChatRequest(this.promptCustomSummary(prompt, topic), options, quality)).choices[0].message.content;
        return `${summary}`;
    }
    private promptCustomSummary(customAsk: string, memory: string): {role:string,content:string}[]  {
        const script = customAsk!==undefined? `Using the information below Generate a promotion of the episode with the following criteria "${customAsk}"`:`Generate a promotion of the episode with the following:`;
        return this.promptGPT(script, memory, 'PROMO');
    }
    private OpenAIChatRequest(messages: {role:string,content:string}[],options?:IOpenAICompletionDefault, quality?: string): Promise<{ choices: [{ message:{role:string, content: string}, finish_reason: string; }]; }> {
        return new Promise((resolve, reject) => {
            const modelId = quality ? quality : 'gpt-3.5-turbo-16k';
            const settings: IOpenAICompletionDefault = {
                model: modelId
            };
            openAi.post(`/chat/completions`, { ...this.extendDefaults(options, settings), ...{ messages } }
            ).then(result => {
                resolve(result.data);
            }).catch(error => {
                console.log({ error: error.response['data'] });
                logger.info({ openAI: 'error in openAI' });
                logger.error(JSON.stringify({ error }));
                reject({ error });
            });
        });
    }
    private promptGPT(prompt: string, memory:string, ask?:string): {role:string,content:string}[] {
        const script = ask===undefined? `${prompt}:\n ${memory}\n`: `${prompt}:\n ${memory}\n${ask}:\n`;
        return this.systemSettingsGPT(script);
    }
    private systemSettingsGPT(script: string, settings?:any): {role:string,content:string}[] {
        return [
            {"role": "system", "content": "You are a RFC8259 compliant JSON response bot"},
            {"role": "user", "content": `${script}`},
            {"role": "system", "content": "Do not include any explanations, only provide a  RFC8259 compliant JSON response  following this format without deviation.: {meesage:'write a compelling response to the customer helping them solve the issue, setting them at ease and with empathy and understanding.'}"},
            {"role": "system", "content": "When it comes to writing content, two factors are crucial, “perplexity” and “burstiness.” Perplexity measures the complexity of text. Separately, burstiness compares the variations of sentences. Humans tend to write with greater burstiness, for example, with some longer or complex sentences alongside shorter ones. AI sentences tend to be more uniform. Therefore, when writing the following content I am going to ask you to create, I need it to have a low amount of perplexity and a great amount of burstiness."},

        ]
    }
}

export const openAIService = new OpenAIService();
