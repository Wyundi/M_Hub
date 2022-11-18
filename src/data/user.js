const mongoCollections = require('../config/mongoCollections');
const user = mongoCollections.user;
const {ObjectId} = require('mongodb');

const utils = require("../utils");

const createUser = async (user) => {
    /*
    user.first_name,
    user.last_name,
    user.email,
    user.gender,
    user.location,
    user.organization,
    user.password
    */
};

const getAllUser = async () => {};

const getUseraById = async (userId) => {};

const removeUser = async (userId) => {};

const updateUser = async (userId) => {};

module.exports = {
    createUser,
    getAllUser,
    getUseraById,
    removeUser,
    updateUser
};