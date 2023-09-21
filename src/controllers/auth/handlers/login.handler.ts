import { NotFound, Unauthorized, createAccessToken } from "@panenco/papi";
import { AccessTokenView } from "../../../contracts/accesstoken.view.js";
import { LoginBody } from "../../../contracts/login.body.js";
import { UserStore } from "../../users/handlers/user.store.js";


export const login = async (loginBody: LoginBody) => {

    const user = UserStore.getByEmail(loginBody.email);

    if (!user || user.password !== loginBody.password ) {
        throw new Unauthorized('invalidCredentials', "Invalid credentials");
    }
    
    const accesstoken = await createAccessToken("validatedUser", 600, { userId: user.id,});
    return accesstoken;
}