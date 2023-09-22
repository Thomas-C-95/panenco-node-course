import { NotFound } from "@panenco/papi";
import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entitites/user.entity.js";

export const deleteUser = async (idString: string) => {

    const em = RequestContext.getEntityManager();
    const user = await em.findOneOrFail(User, {id: idString});

    em.removeAndFlush(user);
    return null;
} 