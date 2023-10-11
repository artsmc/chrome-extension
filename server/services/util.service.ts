export class UtilService {
    extendDefaults(source: any, properties: any): any {
        return { ...source, ...properties };
    }
}

export const utilService = new UtilService();