import { expect } from "chai";
import { User, UserStore } from "../../controllers/users/handlers/user.store.js";
import { getList } from "../../controllers/users/handlers/getList.handler.js";
import { NextFunction, Request, Response } from "express";
import { get } from "../../controllers/users/handlers/get.handler.js";
import { create } from "../../controllers/users/handlers/create.handler.js";
import { UserBody } from "../../contracts/user.body.js";
import { update } from "../../controllers/users/handlers/update.handler.js";
import { deleteUser } from "../../controllers/users/handlers/delete.handler.js";

const userFixtures: User[] = [
    {
        name: 'test1',
        email: 'test-user-1@panenco.com',
        id: 0,
        password: 'user1unsafepassword'
    },
    {
        name: 'test2',
        email: 'test-user-2@panenco.com',
        id: 1,
        password: 'user2unsafepassword'
    }
];


describe('Handler tests', () => {
	describe('User Tests', () => {
		beforeEach(() => {
            UserStore.users = [...userFixtures];
			console.log('beforeEach');
		});

		it('should search users', () => {
            let res: User[];
            getList(
                {query: {search: 'test1'} as any} as Request,
                {json: (val) => (res = val)} as Response,
                null as NextFunction
            );
			expect(res.some((x) => x.name === 'test1')).true;
        });
        it('should not find unknown users', () => {
            let res: User[];
            getList(
                {query: {search: 'test3'} as any} as Request,
                {json: (val) => (res = val)} as Response,
                null as NextFunction
            );
            expect(res.length === 0).true;
        });
        it('should get users if no search term is provided', () => {
            let res: User[];
            getList(
                {query: {search: undefined} as any } as Request,
                {json: (val) => (res = val)} as Response,
                null as NextFunction
                );
            expect(res.length > 0).true;
        });
        it('should get users by ID', () => {
            let res: User;
            get(
                {params: {id: '0'} as any} as Request,
                {json: (val) => (res = val)} as Response,
                null as NextFunction);
            
            expect(res.name === 'test1').true;
        });
        it('should fail when getting user by unknown ID', () => {
            let res: any;
            get(
                {params: {id: '2'} as any} as Request,
                {status: (s) => ({json: (val) => (res = val)})} as Response,
                null as NextFunction);
            
            expect(res.error === 'User not found').true;
        });
        it('should create user', async() => {
            let res: User; 
            const body = {
                name: 'test3',
                email: 'test-user-3@panenco.com',
                password: 'user3unsafepassword',
            } as User;
            await create(
                {body} as Request,
                {json: (val) => (res = val)} as Response,
                null as NextFunction);
            expect(res.name === 'test3').true;
            expect(res.email === 'test-user-3@panenco.com').true;
            expect(res.id === 2).true; // Bad idea because if Fixture changes, this will fail
        });
        it ('should update user', async() => {
            const body = {
                name: 'beautiful name',
                email: 'new-email@panenco.com',
                password: 'saferpassword'
            } as User;
            // await update(
            //     {body, params: {id: '0'} as any} as Request,
            //     {res: {locals: {}}} as Response,
            //     null as NextFunction
            // );
            const res = {locals: {}} as Response;
            await update(
                {body, params: {id: '0'} as any} as Request,
                res,
                () => null as NextFunction
            );

            expect(res.locals.body.name === body.name).true;
            expect(res.locals.body.email === body.email).true;
            expect(res.locals.body.password === body.password).true;
        });
        it ('should delete user by id', () =>{
            let res: Number;
            const usercount = UserStore.users.length;
            deleteUser(
                {params: {id: '0'} as any} as Request,
                {
                    status: (s) => {
                        res = s; 
                        return {send: () => null};
                    },
                } as Response,
                null as NextFunction
            );
            expect(UserStore.users.some( (x) => x.id === 0)).false;
            expect(usercount-1 === UserStore.users.length);
            expect(res === 204).true;


        });
    });
});
