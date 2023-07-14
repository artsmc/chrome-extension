import { UtilController } from "../../../../controllers/util.controller";
import { IUsers } from "../../interfaces/user.interface";
import { UserModel } from "../../models/user.model";


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
                    newDoc.save(function (err) {
                        if (err) { reject(err); }
                        resolve(newDoc);
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
            newDoc.save(function (err) {
                if (err) { reject(err); }
                resolve(newDoc);
            });
        });
    }
}
export const userCreateController = new UserCreateController();