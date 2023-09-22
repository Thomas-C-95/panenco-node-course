import { NextFunction, Request, Response } from 'express';
import { SearchQuery } from '../../../contracts/search.query.js';
import { RequestContext } from '@mikro-orm/core';
import { User } from '../../../entitites/user.entity.js';

// handlers/getList.handler.js
export const getList = (query: SearchQuery) => {
	
    //const search_term = req.query.search? String(req.query.search): undefined; 
    
    const em = RequestContext.getEntityManager();
    
    return em.findAndCount(
        User,
        query.search?
            { $or: [{name: {$ilike: `%${query.search}%`}}, {email: {$ilike:`${query.search}`}}],}
            : {}
    );
};