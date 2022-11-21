const connection = require('../config/mongoConnection');
const data = require('../data/');
const userData = data.user;
const modelData = data.model;
const dataData = data.data;

const fakeData = require('./fakeData');

async function main() {

    // connect and drop all data
    const db = await connection.dbConnection();
    await db.dropDatabase();
  
    // add user
    await userData.createUser(fakeData.user1);
    await userData.createUser(fakeData.user2);
    await userData.createUser(fakeData.user3);

    // add data

    // add model

    // close connect
    await connection.closeConnection();
    console.log('Done seeding database');
}
  
main().catch((error) => {
    console.error(error);
    return connection.dbConnection().then((db) => {
        return connection.closeConnection();
    });
});