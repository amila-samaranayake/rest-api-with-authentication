import { error } from "console";
import { Request, Response } from "express";
import { omit } from "lodash";

import { createUser } from "../service/user.service";
import log from "../logger";

export const crateUserHandler = async (req: Request, res: Response) => {
    try {
        const user = await createUser(req.body);
        return res.send(omit(user.toJSON(), "password"));
    } catch (error) {
        log.error(error);
        return res.status(409).send(error.message);
    }
}