// user.route.js
import { NextFunction, Request, Response, Router } from 'express';
import { getList } from './handlers/getList.handler.js';
import { create } from './handlers/create.handler.js';
import { get } from './handlers/get.handler.js';
import { update } from './handlers/update.handler.js';
import { deleteUser } from './handlers/delete.handler.js';
import { UserBody } from '../../contracts/user.body.js';
import { Delete, Get, JsonController, Param, Patch, Post, UseBefore } from 'routing-controllers';
import { Body, ListRepresenter, Query, Representer, StatusCode} from '@panenco/papi'
import { SearchQuery } from '../../contracts/search.query.js';
import { UserView } from '../../contracts/user.view.js';

const adminMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    if (req.header("x-auth") != "api-key") {
    return res.status(401).send("Unauthorized")
    }
    next();
};

@JsonController("/users")
export class UserController {
        
    @Get("/")
    @ListRepresenter(UserView)
    async getList(@Query() query: SearchQuery) {
        return getList(query);
    }

    @Get("/:id")
    @Representer(UserView, StatusCode.ok)
    async get(@Param("id") id: string) {
        return get(id);
    }

    @Post("/")
    @UseBefore(adminMiddleware)
    @Representer(UserView, StatusCode.created)
    async create(@Body() body: UserBody) {
        return create(body);
    }

    @Patch("/:id")
    @Representer(UserView)
    async update(@Body({}, {skipMissingProperties: true}) body: UserBody,
                 @Param("id") id: string) {
        return update(body, id);
    }

    @Delete("/:id")
    @Representer(null, StatusCode.noContent)
    async delete(@Param("id") id: string) {
        return deleteUser(id);
    }

}