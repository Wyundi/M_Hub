const { dataInfo, model } = require('../config/mongoCollections');
const connection = require('../config/mongoConnection');
const data = require('../data/');
const userData = data.user;
const commentData = data.comment;
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
    let user4 = await userData.createUser(fakeData.user4);
    user4 = user4.insertedUser;
    let user5 = await userData.createUser(fakeData.user5);
    user5 = user5.insertedUser;

    // add data
    let data1 = fakeData.data1;
    data1.userId = user1._id.toString();
    data1 = await dataInfoData.createData(data1);
    await dataInfoData.addUser(data1._id, user2._id);
    await userData.addData(user1._id, data1._id);
    await userData.addData(user2._id, data1._id);

    let data2 = fakeData.data2;
    data2.userId = user2._id.toString();
    data2 = await dataInfoData.createData(data2);
    await dataInfoData.addUser(data2._id, user2._id);
    await userData.addData(user1._id, data2._id);
    await userData.addData(user2._id, data2._id);

    // add model
    let model1 = fakeData.model1;
    model1.userId = user1._id.toString();
    model1.dataId = data1._id.toString();
    model1 = await modelData.createModel(model1);
    await userData.addModel(user1._id, model1._id);
    await userData.addModel(user2._id, model1._id);
    await modelData.addUser(model1._id, user2._id);
    await modelData.addData(model1._id, data2._id);
    await dataInfoData.addModel(data1._id, model1._id);
    await dataInfoData.addModel(data2._id, model1._id);

    let model2 = fakeData.model2;
    model2.userId = user2._id.toString();
    model2.dataId = data2._id.toString();
    model2 = await modelData.createModel(model2);
    await userData.addModel(user1._id, model2._id);
    await userData.addModel(user2._id, model2._id);
    await dataInfoData.addModel(data1._id, model2._id);
    await dataInfoData.addModel(data2._id, model2._id);
    await modelData.addData(model2._id, data1._id);
    await modelData.addUser(model2._id, user1._id);
    
    // add comment
    let modelComment1 = fakeData.modelComment1;
    await commentData.createComment(model1._id, modelComment1.userName, modelComment1.comment, 'model');
    let modelComment2 = fakeData.modelComment2;
    await commentData.createComment(model1._id, modelComment2.userName, modelComment2.comment, 'model');
    let modelComment3 = fakeData.modelComment3;
    await commentData.createComment(model1._id, modelComment3.userName, modelComment3.comment, 'model'); 
    let modelComment4 = fakeData.modelComment4;
    await commentData.createComment(model1._id, modelComment4.userName, modelComment4.comment, 'model');
    let modelComment5 = fakeData.modelComment5;
    await commentData.createComment(model2._id, modelComment5.userName, modelComment5.comment, 'model');
    let modelComment6 = fakeData.modelComment6;
    await commentData.createComment(model2._id, modelComment6.userName, modelComment6.comment, 'model');
    let modelComment7 = fakeData.modelComment7;
    await commentData.createComment(model1._id, modelComment7.userName, modelComment7.comment, 'model');
    let dataComment1 = fakeData.dataComment1;
    await commentData.createComment(data1._id, dataComment1.userName, dataComment1.comment, 'data');
    let dataComment2 = fakeData.dataComment2;
    await commentData.createComment(data2._id, dataComment2.userName, dataComment2.comment, 'data');
    
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