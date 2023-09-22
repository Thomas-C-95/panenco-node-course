// src/tests/integration/user.integration.test.ts
import supertest from "supertest";
import { App } from "../../app.js";
import { expect } from "chai";
import { StatusCode } from "@panenco/papi";
import { LoginBody } from "../../contracts/login.body.js";
import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql";
import { User } from "../../entitites/user.entity.js";

// bootstrapping the server with supertest
describe('Integration tests', () => {
	describe('User Tests', () => {
		let request: supertest.SuperTest<supertest.Test>;
        let orm: MikroORM<PostgreSqlDriver>;

		before( async() => {
			const app = new App();
            await app.createConnection();
            orm = app.orm;
			request = supertest(app.host);
		});
        beforeEach(async () => {
            await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
            await orm.getMigrator().up();
        }
        )
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
            .expect(StatusCode.created);

            const em_fork1 = orm.em.fork();
            const foundCreatedUser = await em_fork1.findOne(User, {id: createResponse.id});
            expect(foundCreatedUser.name).equal('newuser');

            // Login
            const {body: loginResponse} = await request
            .post('/api/auth/tokens')
            .send( {
                email: 'newuser@panenco.com',
                password: 'newuserunsafepassword'
            } as LoginBody)
            .expect(StatusCode.ok);

            const token = loginResponse.token;

            // Get user by ID
            const {body: getResponse} = await request
            .get(`/api/users/${createResponse.id}`)
            .set('x-auth',token)
            .expect(StatusCode.ok);

            expect(getResponse.name).equal(newuser.name);
            expect(getResponse.email).equal(newuser.email);
            // expect(getResponse.id == 2).true;

            // Update user
            const {body: updateResponse} = await request
            .patch(`/api/users/${createResponse.id}`)
            .send({
                email: 'test-user+updated@panenco.com',
            } as User)
            .set('x-auth',token)
            .expect(200);

            // expect(updateResponse.email == 'test-user+updated@panenco.com').true;
            // expect(updateResponse.name == newuser.name).true;
            // expect(updateResponse.password).undefined;

            // Delete user
            const {body: deleteResponse} = await request
            .delete(`/api/users/${createResponse.id}`)
            .set('x-auth',token)
            .expect(StatusCode.noContent);

            // Check that user is not in store anymore
            const {body: getResponse2} = await request
            .get(`/api/users`)
            .set('x-auth',token)
            .expect(StatusCode.ok);

            const {count: getNoneCount } = getResponse2;
            expect(getNoneCount).equal(0);


        })
    });
});
