// src/tests/integration/user.integration.test.ts

import supertest from "supertest";
import { App } from "../../app.js";
import { User, UserStore } from "../../controllers/users/handlers/user.store.js";
import { create } from "../../controllers/users/handlers/create.handler.js";
import { expect } from "chai";
import { StatusCode } from "@panenco/papi";

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

// bootstrapping the server with supertest
describe('Integration tests', () => {
	describe('User Tests', () => {
		let request: supertest.SuperTest<supertest.Test>;
		beforeEach(() => {
			const app = new App();
			request = supertest(app.host);
            UserStore.users = [...userFixtures];
		});
        it('Should create, get, update and delete a user', async () => {

            const newuser = {
                name: 'newuser',
                email: 'newuser@panenco.com',
                password: 'newuserunsafepassword'
            } as User;

            // Create a user
            const {body: createResponse} = await request
            .post('/api/users')
            .send({
                ...newuser,
            })
            .set('x-auth','api-key')
            .expect(StatusCode.created);

            expect(UserStore.users.some((x)=> x.name === newuser.name)).true;

            // Get user by ID
            const {body: getResponse} = await request
            .get(`/api/users/${createResponse.id}`)
            .expect(StatusCode.ok);

            expect(getResponse.name == newuser.name).true;
            expect(getResponse.email == newuser.email).true;
            expect(getResponse.id == 2).true;

            // Update user
            const {body: updateResponse} = await request
            .patch(`/api/users/${createResponse.id}`)
            .send({
                email: 'test-user+updated@panenco.com',
            } as User)
            .expect(200);

            expect(updateResponse.email == 'test-user+updated@panenco.com').true;
            // expect(updateResponse.name == newuser.name).true;
            // expect(updateResponse.password).undefined;

            // Delete user
            const {body: deleteResponse} = await request
            .delete(`/api/users/${createResponse.id}`)
            .expect(StatusCode.noContent);

            // Check that user is not in store anymore
            const {body: getResponse2} = await request
            .get(`/api/users`)
            .expect(StatusCode.ok);

            expect(UserStore.users.some((x)=> x.name === newuser.name)).false;


        })
    });
});
