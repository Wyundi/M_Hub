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
    user1 = user1.insertedUser;
    let user2 = await userData.createUser(fakeData.user2);
    user2 = user2.insertedUser;
    let user3 = await userData.createUser(fakeData.user3);
    user3 = user3.insertedUser;

    // add data
    let data1 = fakeData.data1;
    data1.userId = user1._id.toString();
    data1 = await dataInfoData.createData(data1);
    await userData.addData(user1._id, data1._id);

    let data2 = fakeData.data2;
    data2.userId = user2._id.toString();
    data2 = await dataInfoData.createData(data2);
    await userData.addData(user1._id, data2._id);
    await userData.addData(user2._id, data2._id);

    // add model
    let model1 = fakeData.model1;
    model1.userId = user1._id.toString();
    model1.dataId = data1._id.toString();
    model1 = await modelData.createModel(model1);
    await userData.addModel(user1._id, model1._id);

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