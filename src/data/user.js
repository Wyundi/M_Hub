const mongoCollections = require('../config/mongoCollections');
const user = mongoCollections.user;
const {ObjectId} = require('mongodb');

const utils = require("../utils");

const createUser = async (user_info) => {
    /*
    user_info.first_name,
    user_info.last_name,
    user_info.email,
    user_info.gender,
    user_info.location,
    user_info.organization,
    user_info.passwd
    */

    // error check

    first_name = utils.checkString(user_info.first_name);
    last_name = utils.checkString(user_info.last_name);

    email = utils.checkEmail(user_info.email);
    gender = utils.checkGender(user_info.gender);
    loc = utils.checkLocation(user_info.location);
    org = utils.checkString(user_info.organization);

    passwd = utils.checkPasswd(user_info.passwd);

    // hashing password

    passwd = utils.hash(passwd);

    // add user

    let newUser = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        gender: gender,
        location: loc,
        organization: org,
        passwd: passwd,
        data: [],
        model:[]
    };

    const userCollection = await user();
    const insertInfo = await userCollection.insertOne(newUser);

    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add user';

    const newId = insertInfo.insertedId.toString();

    const user_db = await getUseraById(newId);
    return user_db;

};

const getAllUser = async () => {

    const userCollection = await user();
    const userList = await userCollection.find({}).toArray();
    if (!userList) return [];

    for (i in userList) {
        userList[i]._id = userList[i]._id.toString();
    }

    return userList;

};

const getUseraById = async (userId) => {

    id = utils.checkId(userId, 'user id');

    const userCollection = await user();
    const user_res = await userCollection.findOne({_id: ObjectId(id)});
    if (user_res === null) throw 'No user with that id';

    user_res._id = user_res._id.toString();

    return user_res;

};

const getUserByNameOrEmail = async (str) => {

    return 0;
};

const removeUser = async (userId) => {

    id = utils.checkId(userId, 'user id');

    let user_db = await getUseraById(id);

    const userCollection = await user();
    const deletionInfo = await userCollection.deleteOne({_id: ObjectId(id)});

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete user with id of ${id}`;
    }
    
    return `${user_db.first_name} ${user_db.last_name} has been successfully deleted!`;

};

const updateUser = async (userId, user_info) => {

    return 0;

};

const changePasswd = async (userId, oldPasswd, newPasswd) => {

    return 0;

};

const addData = async (userId, dataId) => {

    userId = utils.checkId(userId);
    dataId = utils.checkId(dataId);

};

const addModel = async (userId, modelId) => {

    userId = utils.checkId(userId);
    modelId = utils.checkId(modelId);

};

module.exports = {
    createUser,
    getAllUser,
    getUseraById,
    getUserByNameOrEmail,
    removeUser,
    updateUser,
    changePasswd,
    addData,
    addModel
};