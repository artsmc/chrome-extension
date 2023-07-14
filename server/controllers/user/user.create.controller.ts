import { IUsers } from "../../interfaces/user.interface";
import { UserModel } from "../../models/user.model";
import { UtilController } from "../util.controller";



export class UserCreateController extends UtilController {
    constructor() {
        super();
    }
    findOrCreate(body): Promise<IUsers> {
        return new Promise(async (resolve, reject) => {
            UserModel.findOne({ email: body.email }, (err, user) => {
                if (err) { reject(err); }
                if (user) {
                    resolve(user);
                } else {
                    const newDoc = new UserModel({
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
    create(body): Promise<IUsers> {
        return new Promise(async (resolve, reject) => {
            const newDoc = new UserModel({
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
export const userCreateController = new UserCreateController();