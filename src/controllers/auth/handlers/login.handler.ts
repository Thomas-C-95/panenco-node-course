import { NotFound, Unauthorized, createAccessToken } from "@panenco/papi";
import { LoginBody } from "../../../contracts/login.body.js";
import { RequestContext } from "@mikro-orm/core";
import { User } from "../../../entitites/user.entity.js";


export const login = async (loginBody: LoginBody) => {

    const em = RequestContext.getEntityManager();
    const user = await em.findOneOrFail(User, {email: loginBody.email});

    if (user.password !== loginBody.password ) {
        throw new Unauthorized('invalidCredentials', "Invalid credentials");
    }
    
    const accesstoken = await createAccessToken("validatedUser", 600, { userId: user.id,});
    return accesstoken;
}