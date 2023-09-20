import { NextFunction, Request, Response } from 'express';
import { UserStore } from './user.store.js';

// handlers/getList.handler.js
export const getList = async (req: Request, res: Response, next: NextFunction) => {
	
    //const search_term = req.query.search? String(req.query.search): undefined; 
    
    const users = UserStore.find(req.query.search?.toString());
    res.json(users);
};