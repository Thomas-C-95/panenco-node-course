import { expect } from "chai";
import { User, UserStore } from "../../controllers/users/handlers/user.store.js";
import { getList } from "../../controllers/users/handlers/getList.handler.js";
import { get } from "../../controllers/users/handlers/get.handler.js";
import { create } from "../../controllers/users/handlers/create.handler.js";
import { UserBody } from "../../contracts/user.body.js";
import { update } from "../../controllers/users/handlers/update.handler.js";
import { deleteUser } from "../../controllers/users/handlers/delete.handler.js";
import { SearchQuery } from "../../contracts/search.query.js";

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
            let query = new SearchQuery ();
            query.search = 'test1';
            const [res, count] = getList(query);
			expect(res.some((x) => x.name === 'test1')).true;
        });
        it('should not find unknown users', () => {
            let query = new SearchQuery ();
            query.search = 'test3';
            const [res, count] = getList(query);
            
            expect(count === 0).true;
        });
        it('should get users if no search term is provided', () => {
            let query = new SearchQuery();
            const[res, count] = getList(query);
            expect(count > 0).true;
        });
        it('should get users by ID', () => {
            let res: User;
            res = get('0')            
            expect(res.name === 'test1').true;
        });
        it('should fail when getting user by unknown ID', () => {
            let res: any;
            try {
                res = get('2');
            } catch (error) {
                expect(error.message).equal("User not found");
                return;
            }
            
            expect(true, "Get should have raised an error").false;
        });
        it('should create user', async() => {
            let res: User; 
            const body = {
                name: 'test3',
                email: 'test-user-3@panenco.com',
                password: 'user3unsafepassword',
            } as User;
            res = await create(body);
                
            expect(res.name === 'test3').true;
            expect(res.email === 'test-user-3@panenco.com').true;
            expect(res.id === 2).true; // Bad idea because if Fixture changes, this will fail
        });
        it ('should update user', async() => {
            let res: User;

            const body = {
                email: 'new-email@panenco.com',
                password: 'saferpassword'
            } as User;
            
            res = await update(body, '0');

            expect(res.name === 'test1').true;
            expect(res.email === body.email).true;
            expect(res.password === body.password).true;
        });
        it ('should delete user by id', () =>{
            const usercount = UserStore.users.length;
            deleteUser('0');
            expect(UserStore.users.some( (x) => x.id === 0)).false;
            expect(usercount-1 === UserStore.users.length);

        });
    });
});
