import { UserBody } from '../../../contracts/user.body.js';
import { NotFound } from '@panenco/papi';
import { RequestContext } from '@mikro-orm/core';
import { User } from '../../../entitites/user.entity.js';

export const update = async(body: UserBody, idString: string) => {
    
    // const em = RequestContext.getEntityManager();
    // const user = em.findOneOrFail(User, {id: idString});

    // user.assign(body);
    // em.upsert()

    // await em.flush();
    // return user;
    const em = RequestContext.getEntityManager();
    const user = await em.findOne(User, { id: idString });
  
    if (!user) {
      throw new NotFound("userNotFound", "User not found");
    }
    user.assign(body);
    await em.flush();
    return user;
}