import { expect } from "chai";
import { getList } from "../../controllers/users/handlers/getList.handler.js";
import { get } from "../../controllers/users/handlers/get.handler.js";
import { create } from "../../controllers/users/handlers/create.handler.js";
import { UserBody } from "../../contracts/user.body.js";
import { update } from "../../controllers/users/handlers/update.handler.js";
import { deleteUser } from "../../controllers/users/handlers/delete.handler.js";
import { SearchQuery } from "../../contracts/search.query.js";
import { MikroORM, PostgreSqlDriver } from "@mikro-orm/postgresql";
import ormConfig from "../../orm.config.js";
import { User } from "../../entitites/user.entity.js";
import { RequestContext } from "@mikro-orm/core";
import { randomUUID } from "crypto";

const userFixtures: User[] = [
    {
        name: 'test1',
        email: 'test-user-1@panenco.com',
        password: 'user1unsafepassword'
    } as User,
    {
        name: 'test2',
        email: 'test-user-2@panenco.com',
        password: 'user2unsafepassword'
    } as User
];


describe('Handler tests', () => {
	describe('User Tests', () => {
        let orm: MikroORM<PostgreSqlDriver>;
        let users: User[];
        before( async() => {
            orm = await MikroORM.init(ormConfig);
        });
		beforeEach( async() => {
            await orm.em.execute(`DROP SCHEMA public CASCADE; CREATE SCHEMA public;`);
            await orm.getMigrator().up();
            const em = orm.em.fork();
            users = userFixtures.map((x) => em.create(User, x));
            await em.persistAndFlush(users);
		});

		it('should search users', async() => {
            await RequestContext.createAsync(orm.em.fork(), async () => {

                let query = new SearchQuery ();
                query.search = 'test1';
                const [res, count] = await getList(query);
                expect(res.some((x) => x.name === 'test1')).true;
            });
        });
        it('should not find unknown users', async () => {
            await RequestContext.createAsync(orm.em.fork(), async () =>{

                let query = new SearchQuery ();
                query.search = 'test3';
                const [res, count] = await getList(query);
                expect(count === 0).true;
            });
        });
        it('should get users if no search term is provided', async() => {
            await RequestContext.createAsync(orm.em.fork(), async () => {
                let query = new SearchQuery();
                const[res, count] = await getList(query);
                expect(res.some((x)=>x.name === "test2")).true;
            });
        });
        it('should get users by ID', async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                
                const res = await get(users[1].id);
                expect(res.name === 'test2').true;
                expect(res.email === 'test-user-2@panenco.com').true;
            })
        });
        it('should fail when getting user by unknown ID', async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {

                try {
                    await get(randomUUID());
                } catch (error) {
                    expect(error.message).equal("User NotFound");
                    return;
                }
                
                expect(true, "Get should have raised an error").false;
            });
        });
        it('should create user', async() => {
            await RequestContext.createAsync(orm.em.fork(), async() => {
                let res: User; 
                const body = {
                    name: 'test3',
                    email: 'test-user-3@panenco.com',
                    password: 'user3unsafepassword',
                } as User;
                res = await create(body);
                expect(res.name === 'test3').true;
                expect(res.email === 'test-user-3@panenco.com').true;
            });
                
        });
        it ('should update user', async() => {
			await RequestContext.createAsync(orm.em.fork(), async () => {
				const body = {
					email: 'test-user+updated@panenco.com',
				} as User;
				const id = users[0].id;
				const res = await update(body, id.toString());

				expect(res.email).equal(body.email);
				expect(res.name).equal('test1');
				const foundUser = await orm.em.findOne(User, {id});
				expect(foundUser.email).equal(body.email);
			});
        });

        it ('should delete user by id', async() =>{
            await RequestContext.createAsync(orm.em.fork(), async() => {

                const countbefore = await orm.em.count(User);
                await deleteUser(users[0].id);
                const countafter = await orm.em.count(User);
                
                expect(countbefore-1).equal(countafter);
            })

        });
    });
});
