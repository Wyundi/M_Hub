const mongoCollections = require('../config/mongoCollections');
const user = mongoCollections.user;
const {ObjectId} = require('mongodb');
const bcrypt = require("bcrypt");
const saltRounds = 6;

const utils = require("../utils");

/*
add username to user_info so that we can login via username and email
*/ 

const createUser = async (user_info) => {
    /*
    user_info.first_name,
    user_info.last_name,
    user_ino.username,
    user_info.email,
    user_info.gender,
    user_info.location,
    user_info.organization,
    user_info.passwd
    */

    // error check

    first_name = utils.checkString(user_info.first_name);
    last_name = utils.checkString(user_info.last_name);
    username = utils.checkUsername(user_info.username);
    email = utils.checkEmail(user_info.email);
    gender = utils.checkGender(user_info.gender);
    loc = utils.checkLocation(user_info.location);
    org = utils.checkString(user_info.organization);

    passwd = utils.checkPasswd(user_info.passwd);

    // hashing password

    passwd = utils.hash(passwd);

    // check if same username/email exists
    const userInfoCollection = await user();
    const userFoundByEmail = await userInfoCollection.findOne({email: {$regex: username, $options: 'i'}});
    const userFoundByUsername = await userInfoCollection.findOne({username: {$regex: username, $options: 'i'}});
    if (userFoundByEmail || userFoundByUsername) throw 'Error: the username/email is already used!';

    // add user

    let newUser = {
        first_name: first_name,
        last_name: last_name,
        username: username,
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

    // return 'user successfully created!'   ???
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
    id = utils.checkId(userId, 'User id');

    first_name = utils.checkString(user_info.first_name);
    last_name = utils.checkString(user_info.last_name);
    username = utils.checkUsername(user_info.username);
    email = utils.checkEmail(user_info.email);
    gender = utils.checkGender(user_info.gender);
    loc = utils.checkLocation(user_info.location);
    org = utils.checkString(user_info.organization);

    let user = await getUserById(id);
    if (!user) throw `Could not find user with id ${id}!`;

    let newUser = {
        first_name: first_name,
        last_name: last_name,
        username: username,
        email: email,
        gender: gender,
        location: loc,
        organization: org,
        passwd: user.passwd,
        data: [],
        model:[]
    };

    const userInfoCollection = await user();
    const updateInfo = await userInfoCollection.updateOne(
        {_id: id},
        {$set: newUser}
    );

    if (!updateInfo) throw `Could not update user with origin name ${user.username}!`;

    return `user ${user.username} has been successfully updated!`;

};

const changePasswd = async (userId, oldPasswd, newPasswd) => {

    // check validation
    id = utils.checkId(userId);
    oldPasswd = utils.checkPasswd(oldPasswd);
    newPasswd = utils.checkPasswd(newPasswd);

    let user = await getUserById(id);
    if (!user) throw `Could not find user with id ${id}!`;
    
    // check old password is correct
    let compareToMatch = false;
    try {
        compareToMatch = await bcrypt.compare(oldPasswd, user.passwd);
    } catch (e) {
        // no op
    }

    if (compareToMatch) {
        newPasswd = utils.hash(newPasswd);
        let newUser = user;
        newUser.passwd = newPasswd;

        const userInfoCollection = await user();
        const updateInfo = await userInfoCollection.updateOne(
            {_id: id},
            {$set: newUser}
        );
    
        if (!updateInfo) throw `Could not change user password!`;
    
        return `user ${user.username}'s password has been successfully changed!`;

    } else throw 'old password is not correct, try again!';


};

const addData = async (userId, dataId) => {

    // validation
    userId = utils.checkId(userId);
    dataId = utils.checkId(dataId);

    let user = await getUserById(userId);
    if (!user) throw `Could not find user with id ${userId}!`;

    let newUser = user;
    newUser.data.push(dataId);

    const userInfoCollection = await user();
    const updateInfo = await userInfoCollection.updateOne(
        {_id: ObjectId(userId)},
        {$set: newUser}
    );

    if (!updateInfo) throw `Could not add dataset to user ${user.username}!`;

    return 'dataset added successfully!';

};

const addModel = async (userId, modelId) => {

    // validation
    userId = utils.checkId(userId);
    modelId = utils.checkId(modelId);

    let user = await getUserById(userId);
    if (!user) throw `Could not find user with id ${userId}!`;

    let newUser = user;
    newUser.model.push(modelId);

    const userInfoCollection = await user();
    const updateInfo = await userInfoCollection.updateOne(
        {_id: ObjectId(userId)},
        {$set: newUser}
    );

    if (!updateInfo) throw `Could not add model to user ${user.username}!`;

    return 'model added successfully!';

};

const checkUser = async (username, password) => {
    if (!username || !password) throw 'Error: please enter a username or password';
    username = utils.checkUsername(username);
    passwd = utils.checkPasswd(password);
  
    const userCollection = await user();
    const userFound = await userCollection.findOne({username: {$regex: username, $options: 'i'}});
    if(userFound === null) throw 'Error: username or password is invalid';
  
    let compareToMatch = false;
    try {
      compareToMatch = await bcrypt.compare(passwd, userFound.passwd);
    } catch (e) {
      //no op
    }
  
    if (compareToMatch) {
      return {authenticated: true};
    } else throw 'Error: password is not valid'
  };

module.exports = {
    createUser,
    getAllUser,
    getUserById,
    getUserByUsernameOrEmail,
    removeUser,
    updateUser,
    changePasswd,
    addData,
    addModel,
    checkUser,
};