import { Dictionary } from "@mikro-orm/core";
import { IPrimaryKeyValue } from "@mikro-orm/core/typings";
import { NotFound } from "@panenco/papi";


export const noEntitiyFoundError = function (entityName: string, where: Dictionary<any> | IPrimaryKeyValue) {
    return new NotFound(`entityNotFound`, `${entityName} ${NotFound.name}`);
}