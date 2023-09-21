import { NextFunction, Request, Response } from 'express';
import { User, UserStore } from './user.store.js';
import { SearchQuery } from '../../../contracts/search.query.js';

// handlers/getList.handler.js
export const getList = (query: SearchQuery): [User[], number] => {
	
    //const search_term = req.query.search? String(req.query.search): undefined; 
    
    const users = UserStore.find(query.search);
    return [users, users.length];
};