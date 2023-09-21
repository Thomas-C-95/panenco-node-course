import { Body, Representer } from "@panenco/papi";
import { Authorized, JsonController, Post } from "routing-controllers";
import { LoginBody } from "../../contracts/login.body.js";
import { login } from "./handlers/login.handler.js";
import { AccessTokenView } from "../../contracts/accesstoken.view.js";
import { OpenAPI } from "routing-controllers-openapi";

@JsonController("/auth")
export class AuthController {

    @Post('/tokens')
    @Representer(AccessTokenView)
    @OpenAPI({summary: "Request new accesstoken"})
    async login(@Body() body: LoginBody){
        return login(body);
    }
}