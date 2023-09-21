import { NextFunction, Request, Response } from "express";
import { UserStore } from "./user.store.js";
import { NotFound } from "@panenco/papi";

export const deleteUser = async (idString: string) => {

    const id = Number(idString);
    const user = UserStore.get(id);

    if (!user) {
        throw new NotFound('userNotFound', "User not found"); 
    }

    UserStore.delete(id);
    return null;
} 