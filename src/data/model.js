const mongoCollections = require('../config/mongoCollections');
const model = mongoCollections.model;
const {ObjectId} = require('mongodb');

const utils = require("../utils");

const createModel = async (model_info) => {
    /*
    model_info.name,
    model_info.category,
    model_info.description,
    model_info.link,
    model_info.structure,
    model_info.input,
    model_info.output,
    model_info.userId,
    model_info.dataId
    */

    
};

const getAllModel = async () => {};

const getModelById = async (modelId) => {};

const removeModel = async (modelId) => {};

const updateModel = async (modelId) => {};

const addUser = async (modelId, userId) => {};

const addData = async (modelId, dataId) => {};

module.exports = {
    createModel,
    getAllModel,
    getModelById,
    removeModel,
    updateModel,
    addUser,
    addData
};