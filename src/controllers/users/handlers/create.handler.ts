import { NextFunction, Request, Response} from 'express';

// create.handler.js
import { UserStore } from './user.store.js';
import { plainToInstance } from 'class-transformer';
import { UserBody } from '../../../contracts/user.body.js';
import { validate } from 'class-validator';
import { UserView } from '../../../contracts/user.view.js';

export const create = async (body: UserBody) => {

    const user = UserStore.add(body);
    return user;
};