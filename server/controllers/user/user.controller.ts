
import { IUsers } from '../../interfaces/user.interface';
import { UtilController } from '../util.controller';
import { userCreateController } from './user.create.controller';
import { usersFindController } from './user.find.controller';

class UserController extends UtilController {
    constructor() {
        super();
    }
    create(body): Promise<IUsers> {
        return userCreateController.create(body);
    }
    find(body): Promise<IUsers[]> {
        return usersFindController.findAll(body);
    }
}
export const userController = new UserController();