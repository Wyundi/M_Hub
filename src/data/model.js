const mongoCollections = require('../config/mongoCollections');
const model = mongoCollections.model;
const {ObjectId} = require('mongodb');

const userData = require('./user');
const utils = require("../utils");

const createModel = async (model_info) => {
    /*
    model_info.name,
    model_info.category,
    model_info.description,
    model_info.link,
    model_info.onnx_path,
    model_info.input,
    model_info.output,
    model_info.userId,
    model_info.dataId
    */

    // error check

    model_name = utils.checkString(model_info.name);
    category = utils.checkString(model_info.category);
    description = utils.checkString(model_info.description);
    link = utils.checkUrl(model_info.link);
    onnx_path = utils.checkPath(model_info.onnx_path);
    input = utils.checkString(model_info.input);
    output = utils.checkString(model_info.output);
    userId = utils.checkId(model_info.userId, "user id");
    dataId = utils.checkId(model_info.dataId, "data id");

    // add model to db
    const modelCollection = await model();

    let newModel = {
        model_name: model_name,
        category: category,
        description: description,
        link: link,
        onnx_path: onnx_path,
        input: input,
        output: output,
        user_list: [userId],
        data_list: [dataId],
        comment: []
    };

    const insertInfo = await modelCollection.insertOne(newModel);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add model';

    const newId = insertInfo.insertedId.toString();

    const model_db = await getModelById(newId);
    return model_db;
};

const getAllModel = async () => {
    const modelCollection = await model();
    const modelList = await modelCollection.find({}).toArray();
    if (!modelList) return [];

    for (i in modelList) {
        modelList[i]._id = modelList[i]._id.toString();
    }

    return modelList;
};

const getModelById = async (modelId) => {

    modelId = utils.checkId(modelId, 'model id');

    const modelCollection = await model();
    const model_res = await modelCollection.findOne({_id: ObjectId(modelId)});
    if (model_res === null) throw 'No model with that id';

    model_res._id = model_res._id.toString();

    for (i in model_res.comment) {
        model_res.comment[i]._id = model_res.comment[i]._id.toString();
    }

    return model_res;

};

const getModelByName = async (search_model_name) => {

    // error check
    search_model_name = utils.checkString(search_model_name, 'data name');

    // get model
    const model_list = await getAllModel();

    let res = [];
    for (m of model_list) {
        if (m.model_name.toLowerCase().includes(search_model_name.toLowerCase())) {
            res.push(m);
        }
    }

    //sort by ID
    res.sort(function(a, b) {return a.id - b.id;});

    //return up to 20 matching results
    return res.slice(0, 20);
};

const removeModel = async (modelId) => {

    modelId = utils.checkId(modelId, 'model id');

    let model_db = await getModelById(modelId);

    const modelCollection = await model();
    const deletionInfo = await modelCollection.deleteOne({_id: ObjectId(modelId)});

    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete model with id of ${modelId}`;
    }
    
    return `${model_db.name} has been successfully deleted!`;

};

const updateModel = async (modelId, model_info) => {

    // error check

    model_name = utils.checkString(model_info.model_name);
    category = utils.checkString(model_info.category);
    description = utils.checkString(model_info.description);
    link = utils.checkUrl(model_info.link);
    onnx_path = utils.checkPath(model_info.onnx_path);
    input = utils.checkString(model_info.input);
    output = utils.checkString(model_info.output);
    userId = utils.checkId(model_info.userId, "user id");
    dataId = utils.checkId(model_info.dataId, "data id");

    // update data

    let model_db = await getModelById(modelId);                 // throw an error when not found

    const modelCollection = await model();
    const updatedInfo = await modelCollection.updateOne(
        {_id: ObjectId(modelId)},
        {$set: {
            model_name: model_name,
            category: category,
            description: description,
            link: link,
            onnx_path: onnx_path,
            input: input,
            output: output,
            user_list: [userId],
            data_list: [dataId]
        }}
    );

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not update model successfully';
    }

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
    getAllModel,
    getModelById,
    getModelByName,
    removeModel,
    updateModel,
    addUser,
    addData
};