const mongoCollections = require('../config/mongoCollections');
const {ObjectId} = require('mongodb');

const data = mongoCollections.data;
const dataData = require("./data");

const model = mongoCollections.model;
const modelData = require("./model");

const utils = require("../utils");

const createComment = async (
    id,
    userName,
    comment
    // date should be current date
) => {};

const getAllComment = async (id) => {};

const getComment = async (commentId) => {};

const removeComment = async (commentId) => {};

module.exports = {
    createComment,
    getAllComment,
    getComment,
    removeComment
};
