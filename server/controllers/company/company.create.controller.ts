import { ICompanies } from "../../interfaces/companies.interface";
import { CompanyModel } from "../../models/companies.model";
import { UtilController } from "../util.controller";



export class CompanyCreateController extends UtilController {
    constructor() {
        super();
    }
    findOrCreate(body): Promise<ICompanies> {
        return new Promise(async (resolve, reject) => {
            CompanyModel.findOne({ email: body.email }, (err, user) => {
                if (err) { reject(err); }
                if (user) {
                    resolve(user);
                } else {
                    const newDoc = new CompanyModel({
                        ...body,
                        token: this.token(7),
                    });
                    newDoc.save().then((user) => {
                        resolve(newDoc);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            });
        });
    }
    create(body): Promise<ICompanies> {
        return new Promise(async (resolve, reject) => {
            const newDoc = new CompanyModel({
                ...body,
                token: this.token(7),
            });
            newDoc.save().then((user) => {
                resolve(newDoc);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
export const companyCreateController = new CompanyCreateController();