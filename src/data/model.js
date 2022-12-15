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

    modelName = utils.checkModelName(model_info.name);
    modelCategory = utils.checkModelCategory(model_info.category);
    modelDescription = utils.checkModelDescription(model_info.description);
    modelLink = utils.checkModelLink(model_info.link, 'model link');
    modelStructure = utils.checkStringPattern(model_info.structure, /\p{S}|\p{P}|\p{N}/, 'model structure');
    modelInput = utils.checkStringPattern(model_info.input, /\p{S}|\p{P}/, 'model input');
    modelOutput = utils.checkStringPattern(model_info.output, /\p{S}|\p{P}/, 'model output');
    modelUserId = utils.checkId(model_info.userId, 'user id');
    modelDataId = utils.checkId(model_info.dataId, 'data id');

    const modelCollection = await model();

    let newModel = {
        name: modelName,
        category: modelCategory,
        description: modelDescription,
        link: modelLink,
        structure: modelStructure,
        input: modelInput,
        output: modelOutput,
        userId: modelUserId,
        dataId: modelUserId
    }

    const insertInfo = await modelCollection.insertOne(newModel);
    if (!insertInfo.insertedId) throw `Error: cannot insert model`;
    const newId = insertInfo.insertedId.toString();
    const model = await getModelById(newId);
    model._id = model._id.toString();
    
    return model;
};

const getAllModels = async () => {
    const modelCollection = await model();
    const modelList = await modelCollection.find({}).toArray();
    if(!modelList) throw `Error: movie list cannot be fetched`;
    modelList.forEach(element => {
        element._id = element._id.toString();
    });
    return modelList;
};

const getModelById = async (modelId) => {
    modelId = utils.checkId(modelId, 'model id');
    const modelCollection = await model();
    const modelObj = await modelCollection.findOne({_id: ObjectId(modelId)});
    if (JSON.stringify(modelObj) == "{}") throw `Error: no movie exists with that id`;
    modelObj._id = modelObj._id.toString();
    if (modelObj.length != 0) {
        modelObj.comments.forEach(element => {
            element._id = element._id.toString();
        })
    }
    return modelObj;
};

const removeModel = async (modelId) => {
    modelId = utils.checkId(modelId, 'model id');
    const modelCollection = await model();
    const model = await getModelById(modelId);
    const deleteInfo = await modelCollection.deleteOne({_id: ObjectId(modelId)});
    if (deleteInfo.deletedCount === 0) throw `Error: could not delete model with id of ${modelId}`;
    return;
};

const updateModel = async (model_info) => {
    modelName = utils.checkModelName(model_info.name);
    modelCategory = utils.checkModelCategory(model_info.category);
    modelDescription = utils.checkModelDescription(model_info.description);
    modelLink = utils.checkModelLink(model_info.link, 'model link');
    modelStructure = utils.checkStringPattern(model_info.structure, /\p{S}|\p{P}|\p{N}/, 'model structure');
    modelInput = utils.checkStringPattern(model_info.input, /\p{S}|\p{P}/, 'model input');
    modelOutput = utils.checkStringPattern(model_info.output, /\p{S}|\p{P}/, 'model output');
    modelUserId = utils.checkId(model_info.userId, 'user id');
    modelDataId = utils.checkId(model_info.dataId, 'data id');

    const modelCollection = await model();
    const updatedModel = {
        name: modelName,
        category: modelCategory,
        description: modelDescription,
        link: modelLink,
        structure: modelStructure,
        input: modelInput,
        output: modelOutput,
        userId: modelUserId,
        dataId: modelUserId
    };
    const updatedInfo = await modelCollection.updateOne(
        {_id: ObjectId(modelId)},
        {$set: updateModel}
    );
    if (updatedInfo.modifiedCount === 0) throw `Error: no change, cannot update`;

    return await getModelById(modelId);
};

const addUser = async (modelId, userId) => {
    
    // error check
    modelId = utils.checkId(modelId, "model id");
    userId = utils.checkId(userId, "user id");

    // add user
    let model_db = await getModelById(modelId);
    if (!model_db) throw `Could not find model with id ${modelId}!`;

    // add user to model
    const modelCollection = await model();
    const updatedInfo = await modelCollection
        .updateOne( {_id: ObjectId(modelId)}, {$push: {user_list: userId}} );

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not add user successfully';
    }

    model_db = await getModelById(modelId);

    model_db._id = model_db._id.toString();

    return model_db;

};

const addData = async (modelId, dataId) => {

    // error check
    modelId = utils.checkId(modelId, "model id");
    dataId = utils.checkId(dataId, "data id");

    // add user
    let model_db = await getModelById(modelId);
    if (!model_db) throw `Could not find model with id ${modelId}!`;

    // add user to model
    const modelCollection = await model();
    const updatedInfo = await modelCollection
        .updateOne( {_id: ObjectId(modelId)}, {$push: {data_list: dataId}} );

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not add data successfully';
    }

    model_db = await getModelById(modelId);

    model_db._id = model_db._id.toString();

    return model_db;

};

module.exports = {
    createModel,
    getAllModels,
    getModelById,
    removeModel,
    updateModel,
    addUser,
    addData
};