const mongoCollections = require('../config/mongoCollections');
const user = mongoCollections.user;
const {ObjectId} = require('mongodb');

const utils = require("../utils");

const createUser = async (
    first_name,
    last_name,
    email,
    gender,
    location,
    organization,
    password
) => {};

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