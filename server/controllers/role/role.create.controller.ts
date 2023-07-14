
import { IRoles } from "../../interfaces/roles.interface";
import { RoleModel } from "../../models/roles.model";
import { UtilController } from "../util.controller";



export class RoleCreateController extends UtilController {
    constructor() {
        super();
    }
    findOrCreate(body): Promise<IRoles> {
        return new Promise(async (resolve, reject) => {
            RoleModel.findOne({ email: body.email }, (err, user) => {
                if (err) { reject(err); }
                if (user) {
                    resolve(user);
                } else {
                    const newDoc = new RoleModel({
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
    create(body): Promise<IRoles> {
        return new Promise(async (resolve, reject) => {
            const newDoc = new RoleModel({
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
export const roleCreateController = new RoleCreateController();