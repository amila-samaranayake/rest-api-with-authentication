import { LeanDocument, FilterQuery, UpdateQuery } from "mongoose";
import { get } from "lodash";
import Session, { SessionDocument } from "../model/session.model";
import { UserDocument } from "../model/user.model";
import config from 'config';
import { sign, decode } from "../utils/jwt.utils";
import { findUser } from "../service/user.service";

export const createSession = async (userId: string, userAgent: string) => {
    const session = await Session.create({ user: userId, userAgent: userAgent});
    return session.toJSON();
}

export const createAccessToken = async ({user, session} : {
    user:
        | Omit<UserDocument, "password">
        | LeanDocument<Omit<UserDocument, "password">>;
    session: 
        | Omit<SessionDocument, "password">
        | LeanDocument<Omit<SessionDocument, "password">>;
}) => {
    const accessToken = sign(
        {...user, session: session._id },
        {expiresIn: config.get("accessTokenTtl") }
    );
    
    return accessToken;
}

export const reIssueAccessToken = async ({ refreshToken }: { refreshToken: string}) => {
    //decode the refresh accessToken
    const { decoded } = decode(refreshToken);

    if (!decoded || !get(decoded, "_id")) return false;

    //get the session
    const session = await Session.findById(get(decoded, "_id"));

    //make sure the session is still valid
    if (!session || !session?.valid) return false;

    const user = await findUser({ _id: session.user });

    if (!user) return false;

    const accessToken = createAccessToken({ user, session });

    return accessToken;
}

export const updateSession = async (query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) => {
    return await Session.updateOne(query, update);
}