const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
const userData = data.user;
const modelData = data.model;
const dataData = data.data;

const fakeData = require('./fakeData');

async function main() {

    // connect and drop all data
    const db = await dbConnection();
    await db.dropDatabase();
  
    // add data
    

    // close connect
    console.log('Done seeding database');
    await db.serverConfig.close();
}
  
main().catch((error) => {
    console.error(error);
    return dbConnection().then((db) => {
        return db.serverConfig.close();
    });
});