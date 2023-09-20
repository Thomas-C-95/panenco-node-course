// user.route.js
import { NextFunction, Request, Response, Router } from 'express';
import { getList } from './handlers/getList.handler.js';
import { create } from './handlers/create.handler.js';
import { get } from './handlers/get.handler.js';
import { update } from './handlers/update.handler.js';
import { deleteUser } from './handlers/delete.handler.js';
import { plainToClass, plainToInstance } from 'class-transformer';
import { UserBody } from '../../contracts/user.body.js';
import { emitWarning } from 'process';
import { validate } from 'class-validator';
import { UserView } from '../../contracts/user.view.js';

const adminMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    if (req.header("x-auth") != "api-key") {
    return res.status(401).send("Unauthorized")
    }
    next();
}

const patchValidationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const transformed = plainToClass(UserBody, req.body, { exposeUnsetFields: false,});
    const validationErrors = await validate(transformed, {
        skipMissingProperties: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    });
    if (validationErrors.length) {
        return next(validationErrors);
    }
    req.body = transformed;
    next();
}

const representationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const transformed = plainToInstance(UserView, res.locals.body);
    res.json(transformed);

}
export class UserRoute {

    router: Router;
    path: string;

	constructor() {
		this.router = Router();
		this.path = 'users';

		this.router.get('/', getList);
        this.router.post('/', adminMiddleware, create);
        
        this.router.get('/:id', get);
        this.router.patch(
            '/:id', 
            patchValidationMiddleware,
            update,
            representationMiddleware);
        
        this.router.delete('/:id', deleteUser);


	}
}