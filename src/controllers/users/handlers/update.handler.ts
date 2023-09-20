import { NextFunction, Request, Response } from 'express';
import { UserStore} from './user.store.js';

export const update = async(req: Request, res: Response, next: NextFunction) => {
    
    const id = Number(req.params.id);
    const user = UserStore.get(id);

    if (!user) {
        res.status(404).json({'error': 'User not found'});
        res.send();
        return;
    }
    
    const updated = UserStore.update(id, {...user, ...req.body});
    res.locals.body = updated;
    next();
}