
const APIKey = process.env.OPEN_AI_KEY;
const OpenAIOrg = process.env.OPEN_AI_ORG;

export class UtilService {
    constructor() {}
    public extendDefaults(source, properties) {
    let property;
    for (property in properties) {
      if (properties.hasOwnProperty(property)) {
        source[property] = properties[property];
      }
    }
    return source;
  }
}

export const utilService = new UtilService();
