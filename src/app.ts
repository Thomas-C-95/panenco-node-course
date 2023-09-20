// src/app.js
import express, { Application, NextFunction, Request, Response } from 'express';
import { UserRoute } from './controllers/users/user.route.js';

export class App {

    host: Application;
    constructor() {

        // Init server
        this.host = express();
        this.host.get('/', (req: Request, res: Response, next: NextFunction) => {
            res.send('Hello World');
        });

        // Init json middleware
        this.host.use(express.json());

        // Init logger middleware
        this.host.use((req, res, next) => {
            console.log(req.method, req.url);
            next();
        })

        // Init routes
        const usersRoute = new UserRoute();
        this.host.use(`/api/${usersRoute.path}`, usersRoute.router);

        this.host.use((error: any, req: Request, res: Response, next: NextFunction) => {
            res.status(400).json(error);
        });

    }

    listen() {
        this.host.listen(3000, () => {
            console.info(' http://localhost:3000');
            console.info('=======================');
        });
    }
}