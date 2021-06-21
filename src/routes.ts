import {Express, Request, Response} from 'express';

import { createUserHandler } from "./controller/user.controller";
import { createUserSessionsHandler, invalidateUserSessionHandler } from "./controller/session.controller";
import { validateRequest, requiresUser } from "./middleware";
import { createUserSchema, createUserSessionSchema } from './schema/user.schema';

export default (app: Express) => {
    app.get('/healthcheck', (req: Request, res: Response) =>  res.sendStatus(200) );

    /**
     * Register User
     */
    app.post('/api/users', validateRequest(createUserSchema), createUserHandler);

    /**
     * Login User
     */
    app.post("/api/sessions", validateRequest(createUserSessionSchema), createUserSessionsHandler);

    /**
     * Get the User's session
     */

    /**
     * Logout the user
     */
    app.delete('/api/sessions', requiresUser, invalidateUserSessionHandler);
}