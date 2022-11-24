const mongoCollections = require('../config/mongoCollections');
const dataInfo = mongoCollections.dataInfo;
const {ObjectId} = require('mongodb');

const rawData = require('./raw')

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

    // error check

    data_name = utils.checkString(data.name);
    description = utils.checkString(data.description);
    features = utils.checkStringArray(data.features);
    length = utils.checkInt(data.length);
    source = utils.checkUrl(data.source);
    file_path = utils.checkPath(data.file_path);
    userId = utils.checkId(data.userId);
    
    // check valid json file

    json_obj = utils.checkJson(file_path);

    // add data info
    // according to mongodb document size limit, we need add another document to store raw data separately instead of store them in one document.

    let raw = {}
    for (let f of features) {
        feature_id = ObjectId();
        raw[f] = {};

        for (let i in json_obj[f]) {
            let single_data = await rawData.addData(json_obj[f][i].toString());
            raw[f][i] = single_data._id.toString();
        }
    }

    let newData = {
        data_name: data_name,
        description: description,
        features: features,
        length: length,
        source: source,
        raw_data: raw,
        user_list: [userId],
        comment: []
    }

    const dataInfoCollection = await dataInfo();

    const insertInfo = await dataInfoCollection.insertOne(newData);

    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add data';

    const newId = insertInfo.insertedId.toString();

    // add dataId to user

    await userData.addData(userId, newId);

    // return new data

    const data_db = await getDataById(newId);
    return data_db;

};

const getAllData = async () => {

    const dataInfoCollection = await dataInfo();
    const dataList = await dataInfoCollection.find({}).toArray();
    if (!dataList) return [];

    for (i in dataList) {
        dataList[i]._id = dataList[i]._id.toString();
    }

    return dataList;

};

const getDataById = async (dataId) => {

    id = utils.checkId(dataId, 'data id');

    const dataInfoCollection = await dataInfo();
    const data_res = await dataInfoCollection.findOne({_id: ObjectId(id)});
    if (data_res === null) throw 'No data with that id';

    data_res._id = data_res._id.toString();

    return data_res;

};

const removeData = async (dataId) => {

    id = utils.checkId(dataId, 'data id');

    let data_db = await getDataById(id);

    const dataInfoCollection = await dataInfo();
    const deletionInfo = await dataInfoCollection.deleteOne({_id: ObjectId(id)});

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete data with id of ${id}`;
    }
    
    return `${data_db.nane} has been successfully deleted!`;
    
};

const updateData = async (dataId) => {

    return 0;

};

const addUser = async (dataId, userId) => {

    return 0;

};

module.exports = {
    createData,
    getAllData,
    getDataById,
    removeData,
    updateData,
    addUser
};