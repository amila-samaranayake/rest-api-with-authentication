
import { Request, Response } from "express";
import { get, update } from "lodash";

import { validatePassword } from "../service/user.service";
import { createSession, createAccessToken, updateSession } from "../service/session.service";
import config from 'config';
import { sign } from "../utils/jwt.utils";

export const createUserSessionsHandler = async (req: Request, res: Response) => {
    const user = await validatePassword(req.body);

    if(!user) {
        return res.status(401).send("Invalid usernameor password");
    }

    //create a session
    const session = await createSession(user._id, req.get("user-agent") || "");

    //create access Token

    const accessToken = await createAccessToken({user, session}); // 15mins
    
    //create refresh Token

    const refreshToken = sign(session, { expiresIn: config.get("refreshTokenTtl") });

    //send refresh & access token back
    
    return res.send({ accessToken, refreshToken });
}

export const invalidateUserSessionHandler = async (req: Request, res: Response) => {
    const sessionId = get(req, "user.session");

    await updateSession({_id: sessionId}, {valid: false});

    return res.sendStatus(200);
}