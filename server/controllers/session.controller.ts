import { UtilController } from "./util.controller";
class SessionController extends UtilController {
    constructor() {
        super();
    }
    createSession(user,token) {
    }
}
export const sessionController = new SessionController();