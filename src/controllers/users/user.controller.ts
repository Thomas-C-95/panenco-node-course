// user.route.js
import { NextFunction, Request, Response, Router } from 'express';
import { getList } from './handlers/getList.handler.js';
import { create } from './handlers/create.handler.js';
import { get } from './handlers/get.handler.js';
import { update } from './handlers/update.handler.js';
import { deleteUser } from './handlers/delete.handler.js';
import { UserBody } from '../../contracts/user.body.js';
import { Authorized, Delete, Get, JsonController, Param, Patch, Post, UseBefore } from 'routing-controllers';
import { Body, ListRepresenter, Query, Representer, StatusCode} from '@panenco/papi'
import { SearchQuery } from '../../contracts/search.query.js';
import { UserView } from '../../contracts/user.view.js';

@JsonController("/users")
export class UserController {
        
    @Get("/")
    @Authorized()
    @ListRepresenter(UserView)
    async getList(@Query() query: SearchQuery) {
        return getList(query);
    }

    @Get("/:id")
    @Authorized()
    @Representer(UserView, StatusCode.ok)
    async get(@Param("id") id: string) {
        return get(id);
    }

    @Post("/")
    @Representer(UserView, StatusCode.created)
    async create(@Body() body: UserBody) {
        return create(body);
    }

    @Patch("/:id")
    @Authorized()
    @Representer(UserView)
    async update(@Body({}, {skipMissingProperties: true}) body: UserBody,
                 @Param("id") id: string) {
        return update(body, id);
    }

    @Delete("/:id")
    @Authorized()
    @Representer(null, StatusCode.noContent)
    async delete(@Param("id") id: string) {
        return deleteUser(id);
    }

}