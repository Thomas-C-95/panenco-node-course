import { Body, Representer } from "@panenco/papi";
import { Authorized, JsonController, Post } from "routing-controllers";
import { LoginBody } from "../../contracts/login.body.js";
import { login } from "./handlers/login.handler.js";
import { AccessTokenView } from "../../contracts/accesstoken.view.js";

@JsonController("/auth")
export class AuthController {

    @Post('/tokens')
    @Representer(AccessTokenView)
    async login(@Body() body: LoginBody){
        return login(body);
    }
}