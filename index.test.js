const request = require('supertest');
// express app
const app = require('./index');

// db setup
const { sequelize, Dog } = require('./db');
const seed = require('./db/seedFn');
const {dogs} = require('./db/seedData');

describe('Endpoints', () => {
    // to be used in POST test
    const testDogData = {
        breed: 'Poodle',
        name: 'Sasha',
        color: 'black',
        description: 'Sasha is a beautiful black pooodle mix.  She is a great companion for her family.'
    };

    beforeAll(async () => {
        // rebuild db before the test suite runs
        await seed();
    });

    describe('GET /dogs', () => {
        it('should return list of dogs with correct data', async () => {
            // make a request
            const response = await request(app).get('/dogs');
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // toEqual checks deep equality in objects
            expect(response.body[0]).toEqual(expect.objectContaining(dogs[0]));
        });
    });

    describe('POST /dogs', () => {
        let response
        let createdDogID
        const testDogData = {breed: 'Cockapoo', name: 'Buttons', color: 'brown', description: 'Buttons loves to go on walks with his family!'} 
        beforeAll(async () => {
            // make a request
            response = await request(app).post("/dogs").send(testDogData);
            createdDogID = response.body.id;
        });
        it('should return new dog posted with correct data', async () => {
            // assert a response code
            expect(response.status).toBe(200);
            // expect a response
            expect(response.body).toBeDefined();
            // toEqual checks deep equality in objects
            expect(response.body).toEqual(expect.objectContaining(testDogData));
        });
        it('should expect created Dog object to match what is in the database', async () => {
            // query the database by ID
            const dogInDB = await Dog.findByPk(createdDogID)
            console.log(dogInDB)
            expect(dogInDB).toMatchObject(testDogData);
        });
    });

});