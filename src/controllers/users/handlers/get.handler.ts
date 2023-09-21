import { NextFunction, Request, Response } from "express";
import { UserStore } from "./user.store.js";
import { NotFound } from "@panenco/papi";

export const get = (idString: string) => {

    const id = Number(idString);
    const user = UserStore.get(id);

    if (!user) {
        throw new NotFound('userNotFound', "User not found");
    }

    return user;
}