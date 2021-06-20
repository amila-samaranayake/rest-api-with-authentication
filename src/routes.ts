import {Express, Request, Response} from 'express';

export default (app: Express) => {
    app.get('/healthcheck', (req: Request, res: Response) =>  res.sendStatus(200) );

    /**
     * Register User
     */

    /**
     * Login User
     */

    /**
     * Get the User's session
     */

    /**
     * Logout the user
     */
}