
import { ICompanies } from '../../interfaces/companies.interface';
import { UtilController } from '../util.controller';
import {  responseCreateController } from './response.create.controller';
import {  responseFindController } from './response.find.controller';

class ResponseController extends UtilController {
    constructor() {
        super();
    }
    create(body): Promise<ICompanies> {
        return responseCreateController.create(body);
    }
    find(body): Promise<ICompanies[]> {
        return responseFindController.findAll(body);
    }
    findByName(body): Promise<ICompanies> {
        return responseFindController.findByName(body);
    }
}
export const responseController = new ResponseController();