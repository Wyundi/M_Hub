const connection = require('../config/mongoConnection');
const data = require('../data/');
const userData = data.user;
const dataInfoData = data.dataInfo;
const modelData = data.model;

const fakeData = require('./fakeData');

async function main() {

    // connect and drop all data
    const db = await connection.dbConnection();
    await db.dropDatabase();
  
    // add user
    let user1 = await userData.createUser(fakeData.user1);
    let user2 = await userData.createUser(fakeData.user2);
    let user3 = await userData.createUser(fakeData.user3);

    // add data
    let data1 = fakeData.data1;
    data1.userId = user1._id.toString();
    data1 = await dataInfoData.createData(fakeData.data1);

    // let data2 = fakeData.data2;
    // data2.userId = user2._id.toString();
    // data2 = await dataInfoData.createData(fakeData.data2);

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