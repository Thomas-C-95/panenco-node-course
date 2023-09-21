// src/app.js
import 'express-async-errors';
import express, { Application, NextFunction, Request, Response } from 'express';
import { UserController } from './controllers/users/user.controller.js';
import { RoutingControllersOptions, getMetadataArgsStorage, useExpressServer } from 'routing-controllers';
import { errorMiddleware, getAuthenticator } from '@panenco/papi';
import { AuthController } from './controllers/auth/auth.controller.js';
import { getMetadataStorage } from 'class-validator';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import ormConfig from './orm.config.js';

export class App {

    public orm: MikroORM<PostgreSqlDriver>;

    host: Application;
    constructor() {

        // Init server
        this.host = express();
        // Init json middleware
        this.host.use(express.json());
        
        // Init logger middleware
        this.host.use((req, res, next) => {
            console.log(req.method, req.url);
            next();
        })

        this.host.get('/', (req: Request, res: Response, next: NextFunction) => {
            res.send('Hello World');
        });

        // Init routes
        this.initializeControllers([UserController, AuthController]);
        this.initializeSwagger();

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
        authorizationChecker: getAuthenticator('validatedUser'), // Tell routing-controllers to use the papi authentication checker
        });
    }

    private initializeSwagger() {
		const schemas = validationMetadatasToSchemas({
			classValidatorMetadataStorage: getMetadataStorage(),
			refPointerPrefix: "#/components/schemas/",
		});

		const routingControllersOptions: RoutingControllersOptions = {
			routePrefix: "/api",
		};

		const storage = getMetadataArgsStorage();
		const spec = routingControllersToSpec(storage, routingControllersOptions, {
			components: {
				schemas,
				securitySchemes: {
					JWT: {
						in: "header",
						name: "x-auth",
						type: "apiKey",
						bearerFormat: "JWT",
						description: "JWT Authorization header using the JWT scheme. Example: \"x-auth: {token}\"",
					},
				},
			},
			security: [{JWT: []}],
		});

		this.host.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));
	}

    public async createConnection() {
        try{
            this.orm = await MikroORM.init(ormConfig);
        }catch (error){
            console.log('Error while connecting to the database', error);    
        }
    }

    listen() {
        this.host.listen(3000, () => {
            console.info(' http://localhost:3000');
            console.info('=======================');
        });
    }
}