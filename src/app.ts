// src/app.js
import 'express-async-errors';
import express, { Application, NextFunction, Request, Response } from 'express';
import { UserController } from './controllers/users/user.controller.js';
import { useExpressServer } from 'routing-controllers';
import { errorMiddleware } from '@panenco/papi';

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
        this.initializeControllers([UserController]);
        // this.host.use(`/api/${usersRoute.path}`, usersRoute.router);

        this.host.use(errorMiddleware);

    }

    private initializeControllers(controllers: Function[]){
        useExpressServer(this.host, { // Link the express host to routing-controllers
        cors: {
            origin: "*", // Allow all origins, any application on any url can call our api. This is why we also added the `cors` package.
            exposedHeaders: ["x-auth"], // Allow the header `x-auth` to be exposed to the client. This is needed for the authentication to work later.
        },
        controllers, // Provide the controllers. Currently this won't work yet, first we need to convert the Route to a routing-controllers controller.
        defaultErrorHandler: false, // Disable the default error handler. We will handle errors through papi later.
        routePrefix: "/api", // Map all routes to the `/api` path.
        });
    }

    listen() {
        this.host.listen(3000, () => {
            console.info(' http://localhost:3000');
            console.info('=======================');
        });
    }
}