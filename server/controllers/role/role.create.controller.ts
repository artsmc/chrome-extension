
import { IRoles } from "../../interfaces/roles.interface";
import { RoleModel } from "../../models/roles.model";
import { UtilController } from "../util.controller";



export class RoleCreateController extends UtilController {
    constructor() {
        super();
    }
    findOrCreate(body): Promise<IRoles> {
        return new Promise(async (resolve, reject) => {
            RoleModel.findOne({ name: body.name }, (err, role) => {
                if (err) { reject(err); }
                if (role) {
                    resolve(role);
                } else {
                    const newDoc = new RoleModel({
                        ...body
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
    create(body): Promise<IRoles> {
        return new Promise(async (resolve, reject) => {
            console.log(body)
            const newDoc = new RoleModel({
                ...body
            });
            newDoc.save().then((user) => {
                resolve(newDoc);
            }).catch((err) => {
                reject(err);
            });
        });
    }
}
export const roleCreateController = new RoleCreateController();