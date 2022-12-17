const mongoCollections = require('../config/mongoCollections');
const user = mongoCollections.user;
const {ObjectId} = require('mongodb');
const bcrypt = require("bcrypt");
const saltRounds = 6;

const dataInfoData = require("./dataInfo");
const modelData = require("./model");

const utils = require("../utils");

/*
add username to user_info so that we can login via username and email
*/ 

const createUser = async (user_info) => {
    /*
    user_ino.username,
    user_info.first_name,
    user_info.last_name,
    user_info.email,
    user_info.gender,
    user_info.location,
    user_info.organization,
    user_info.passwd
    */

    // error check

    username = utils.checkUsername(user_info.username);
    first_name = utils.checkString(user_info.first_name);
    last_name = utils.checkString(user_info.last_name);
    email = utils.checkEmail(user_info.email);
    gender = utils.checkGender(user_info.gender);
    loc = utils.checkLocation(user_info.location);
    org = utils.checkString(user_info.organization);

    passwd = utils.checkPasswd(user_info.passwd);

    // hashing password

    const hash_passwd = await bcrypt.hash(passwd, saltRounds);

    // check if same username/email exists
    const userInfoCollection = await user();
    const userFoundByEmail = await userInfoCollection.findOne({email: {$regex: username, $options: 'i'}});
    const userFoundByUsername = await userInfoCollection.findOne({username: {$regex: username, $options: 'i'}});

    if (userFoundByEmail || userFoundByUsername) {
        throw 'Error: the username/email is already used!';
    }


    // add user

    let newUser = {
        username: username,
        first_name: first_name,
        last_name: last_name,
        email: email,
        gender: gender,
        location: loc,
        organization: org,
        passwd: hash_passwd,
        data_list: [],
        model_list:[]
    };

    const userCollection = await user();
    const insertInfo = await userCollection.insertOne(newUser);

    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add user';

    const newId = insertInfo.insertedId.toString();

    const user_db = await getUserById(newId);

    // return 'user successfully created!'   ???
    return {insertedUser: user_db};;

};

const checkUser = async (username, password) => {

    // error check
    username = utils.checkUsername(username);
    password = utils.checkPasswd(password);

    // query user name in database
    let userList = await getAllUser();

    let user_found = null;
    for (let i in userList) {
        if (userList[i].username.toLowerCase() === username.toLowerCase()) {
            if (user_found === null){
                user_found = userList[i];
            }
            else {
                throw "Error in database: duplicate username.";
            }
        }
    }

    if (user_found === null) {
        throw "Error: user not found.";
    }

    // check passwd
    let compare_res = false;

    try {
        compare_res = await bcrypt.compare(password, user_found.passwd);
    } catch (e) {
        throw "Error occurred in compare process.";
    }

    if (compare_res) {
        return {authenticatedUser: user_found};
    }
    else {
        throw "Error: Either the username or password is invalid.";
    }

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

const getUserById = async (userId) => {

    id = utils.checkId(userId, 'user id');

    const userCollection = await user();
    const user_res = await userCollection.findOne({_id: ObjectId(id)});
    if (user_res === null) throw 'No user with that id';

    user_res._id = user_res._id.toString();

    return user_res;

};

const getUserByUsernameOrEmail = async (str) => {
    // code goes here
    
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
    // don't contain password change, change password see next function
    // check user_info
    userId = utils.checkId(userId, 'User id');

    username = utils.checkUsername(user_info.username);
    first_name = utils.checkString(user_info.first_name);
    last_name = utils.checkString(user_info.last_name);
    email = utils.checkEmail(user_info.email);
    gender = utils.checkGender(user_info.gender);
    loc = utils.checkLocation(user_info.location);
    org = utils.checkString(user_info.organization);

    let user_db = await getUserById(userId);
    if (!user_db) throw `Could not find user with id ${userId}!`;

    let newUser = {
        username: username,
        first_name: first_name,
        last_name: last_name,
        email: email,
        gender: gender,
        location: loc,
        organization: org
    };

    const userInfoCollection = await user();
    const updateInfo = await userInfoCollection.updateOne(
        {_id: ObjectId(userId)},
        {$set: newUser}
    );

    if (!updateInfo) throw `Could not update user with origin name ${user.username}!`;

    return `user ${user.username} has been successfully updated!`;

};

const changePasswd = async (userId, oldPasswd, newPasswd) => {

    // check validation
    userId = utils.checkId(userId);
    userId = utils.checkId(userId);
    oldPasswd = utils.checkPasswd(oldPasswd);
    newPasswd = utils.checkPasswd(newPasswd);

    let user_db = await getUserById(userId);
    if (!user_db) throw `Could not find user with id ${userId}!`;
    
    // check old password is correct
    let compareToMatch = false;
    try {
        compareToMatch = await bcrypt.compare(oldPasswd, user_db.passwd);
    } catch (e) {
        throw 'failed to compare password.';
    }

    if (!compareToMatch) {
        throw 'Old password not match.';
    }

    // check if new password equal to old
    let compareNew = false;
    try {
        compareNew = await bcrypt.compare(newPasswd, user_db.passwd);
    } catch (e) {
        throw 'failed to compare password.';
    }

    if (compareNew) {
        throw "The new password is the same as the old one.";
    }

    // change passwd
    newPasswd = await bcrypt.hash(newPasswd, saltRounds);

    const userInfoCollection = await user();
    const updateInfo = await userInfoCollection.updateOne(
        {_id: ObjectId(userId)},
        {$set: {
            passwd: newPasswd
        }}
    );

    if (!updateInfo) throw `Could not change user password!`;

    return "Your password has been successfully changed!";

};

const addData = async (userId, dataId) => {

    // validation
    userId = utils.checkId(userId);
    dataId = utils.checkId(dataId);

    let user_db = await getUserById(userId);
    if (!user_db) throw `Could not find user with id ${userId}!`;

    // add data to user
    const userInfoCollection = await user();
    const updatedInfo = await userInfoCollection
        .updateOne( {_id: ObjectId(userId)}, {$push: {data_list: dataId}} );

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not add data successfully';
    }

    user_db = await getUserById(userId);

    user_db._id = user_db._id.toString();

    return user_db;

};

const addModel = async (userId, modelId) => {

    // error check
    userId = utils.checkId(userId);
    modelId = utils.checkId(modelId);

    let user_db = await getUserById(userId);
    if (!user_db) throw `Could not find user with id ${userId}!`;

    // add model to user
    
    const userInfoCollection = await user();
    const updatedInfo = await userInfoCollection
        .updateOne( {_id: ObjectId(userId)}, {$push: {model_list: modelId}} );

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not add model successfully';
    }

    user_db = await getUserById(userId);

    user_db._id = user_db._id.toString();

    return user_db;

};

const getDataList = async(userId) => {

    // error check
    userId = utils.checkId(userId, "user id");

    let user_db = await getUserById(userId);
    if (!user_db) throw `Could not find user with id ${userId}!`;

    // get Data List
    let data_list = []
    let data_id_list = user_db.data_list;
    let data_db = undefined;

    for (dataId of data_id_list) {
        dataId = utils.checkId(dataId, "data id");
        data_db = await dataInfoData.getDataById(dataId);
        if (!user_db) throw `Could not find data with id ${dataId}!`;

        data_list.push(data_db);
    }

    return data_list;

};

const getModelList = async(userId) => {

    // error check
    userId = utils.checkId(userId, "user id");

    let user_db = await getUserById(userId);
    if (!user_db) throw `Could not find user with id ${userId}!`;

    // get Data List
    let model_list = []
    let model_id_list = user_db.model_list;
    let model_db = undefined;

    for (modelId of model_id_list) {
        modelId = utils.checkId(modelId, "model id");
        model_db = await modelData.getModelById(modelId);
        if (!model_db) throw `Could not find model with id ${modelId}!`;

        model_list.push(model_db);
    }

    return model_list;

};

const removeFromDataList = async (userId, dataId) => {

    userId = utils.checkId(userId, "user id");
    dataId = utils.checkId(dataId, "data id");

    let user_db = await getUserById(userId);
    if (!user_db) throw `Could not find user with id ${userId}!`;

    let user_data_list = user_db.data_list;
    if (!user_data_list) throw 'user data list is empty';
    utils.deleteFromArray(dataId, user_data_list);

    let newUser = {
        username: user_db.username,
        first_name: user_db.first_name,
        last_name: user_db.last_name,
        email: user_db.email,
        gender: user_db.gender,
        location: user_db.location,
        organization: user_db.organization,
        passwd: user_db.passwd,
        data_list: user_data_list,
        model_list: user_db.model_list
    };

    const userInfoCollection = await user();
    const updateInfo = await userInfoCollection.updateOne(
        {_id: ObjectId(userId)},
        {$set: newUser}
    );

    if (!updateInfo) throw `Could not update user with origin name ${user.username}!`;

    return `user ${user.username} has been successfully updated!`;

}; 

const removeFromModelList = async (userId, modelId) => {

    userId = utils.checkId(userId, "user id");
    modelId = utils.checkId(modelId, "model id");

    let user_db = await getUserById(userId);
    if (!user_db) throw `Could not find user with id ${userId}!`;

    let user_model_list = user_db.model_list;
    if (!user_model_list) throw 'user data list is empty';
    utils.deleteFromArray(modelId, user_model_list);

    let newUser = {
        username: user_db.username,
        first_name: user_db.first_name,
        last_name: user_db.last_name,
        email: user_db.email,
        gender: user_db.gender,
        location: user_db.location,
        organization: user_db.organization,
        passwd: user_db.passwd,
        data_list: user_db.data_list,
        model_list: user_model_list
    };

    const userInfoCollection = await user();
    const updateInfo = await userInfoCollection.updateOne(
        {_id: ObjectId(userId)},
        {$set: newUser}
    );

    if (!updateInfo) throw `Could not update user with origin name ${user.username}!`;

    return `user ${user.username} has been successfully updated!`;

}; 

module.exports = {
    createUser,
    checkUser,
    getAllUser,
    getUserById,
    getUserByUsernameOrEmail,
    removeUser,
    updateUser,
    changePasswd,
    addData,
    addModel,
    getDataList,
    getModelList,
    removeFromDataList,
    removeFromModelList
};