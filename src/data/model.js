const mongoCollections = require('../config/mongoCollections');
const model = mongoCollections.model;
const {ObjectId} = require('mongodb');

const utils = require("../utils");

const createModel = async (model) => {
    /*
    model.name,
    model.category,
    model.description,
    model.link,
    model.structure,
    model.input,
    model.output,
    model.userId,
    model.dataId
    */
};

const getAllModel = async () => {};

const getModelById = async (modelId) => {};

const removeModel = async (modelId) => {};

const updateModel = async (modelId) => {};

module.exports = {
    createModel,
    getAllModel,
    getModelById,
    removeModel,
    updateModel
};