const mongoCollections = require('../config/mongoCollections');
const dataData = mongoCollections.data;
const {ObjectId} = require('mongodb');

const utils = require("../utils");

const createData = async (data) => {
    /*
    data.name,
    data.description,
    data.features,
    data.length,
    data.source,
    data.file_path,
    data.userId
    */
};

const getAllData = async () => {};

const getDataById = async (dataId) => {};

const removeData = async (dataId) => {};

const updateData = async (dataId) => {};

module.exports = {
    createData,
    getAllData,
    getDataById,
    removeData,
    updateData
};