import { NextFunction, Request, Response } from 'express';
import { UserStore} from './user.store.js';
import { UserBody } from '../../../contracts/user.body.js';
import { NotFound } from '@panenco/papi';

export const update = async(body: UserBody, idString: string) => {
    
    const id = Number(idString);
    const user = UserStore.get(id);

    if (!user) {
        throw new NotFound('userNotFound', "User not found");
    }
    
    const updated = UserStore.update(id, {...user , ...body});
    return updated;
}