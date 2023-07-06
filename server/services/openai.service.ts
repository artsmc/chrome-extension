import { IOpenAICompletion, IOpenAICompletionDefault } from './../interfaces/openai.interface';
import { UtilService } from './util.service';
import axios from 'axios';
import { string } from 'joi';

const APIKey = process.env.OPEN_AI_KEY;
const OpenAIOrg = process.env.OPEN_AI_ORG;

class OpenAIService extends UtilService {
    constructor() {
        super();
    }
    public Completion(prompt: string, options: IOpenAICompletion, quality?: string) {
        return new Promise((resolve, reject) => {
            const modelId = quality ? quality : 'davinci-codex';
            const settings: IOpenAICompletionDefault = {
                temperature: 0.3,
                max_tokens: 200,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            };
            axios.post(`https://api.openai.com/v1/engines/${modelId}/completions`, {...{prompt}, ...this.extendDefaults(options, settings)},
            {headers: {
                Authorization: `Bearer ${APIKey}`
            }}
            ).then( result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }
    public QuickSummary(prompt: string, options: IOpenAICompletion, quality?: string) {
        return new Promise((resolve, reject) => {
            const modelId = quality ? quality : 'davinci-codex';
            const settings: IOpenAICompletionDefault = {
                temperature: 0.3,
                max_tokens: 60,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            };
            axios.post(`https://api.openai.com/v1/engines/${modelId}/completions`, {...{prompt: this.promptSummary(prompt)}, ...this.extendDefaults(options, settings)},
            {headers: {
                Authorization: `Bearer ${APIKey}`
            }}
            ).then( result => {
                    resolve(result);
                }).catch(error => {
                    reject(error);
                });
        });
    }
    public ContextSummary(prompt: string, context: string, options: IOpenAICompletion, quality?: string) {
        return new Promise((resolve, reject) => {
            const modelId = quality ? quality : 'davinci-codex';
            const settings: IOpenAICompletionDefault = {
                temperature: 0.3,
                max_tokens: 60,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            };
            axios.post(`https://api.openai.com/v1/engines/${modelId}/completions`, {...{prompt: this.promptSummary(prompt)}, ...this.extendDefaults(options, settings)},
            {headers: {
                Authorization: `Bearer ${APIKey}`
            }}
            ).then( result => {
                    resolve(result);
                }).catch(error => {
                    reject(error);
                });
        });
    }
    private promptSummary(prompt): string {
        return JSON.stringify(`${prompt}\n\ntl;dr:`);
    }
    private promptSummaryContext(prompt, context): string {
        return JSON.stringify(`${prompt}\n\nSummarize text include, ${context}:`);
    }
}

export const openAIService = new OpenAIService();
