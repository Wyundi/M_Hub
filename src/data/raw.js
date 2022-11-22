const mongoCollections = require('../config/mongoCollections');
const raw = mongoCollections.raw;
const {ObjectId} = require('mongodb');

const utils = require("../utils");

const addData = async (data) => {

    data = utils.checkString(data);

    let newData = {
        data: data
    };

    const rawCollection = await raw();
    const insertInfo = await rawCollection.insertOne(newData);

    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw 'Could not add data';

    const newId = insertInfo.insertedId.toString();

    const data_db = await getDataById(newId);
    return data_db;

};

const getAllData = async () => {

    const rawCollection = await raw();
    const dataList = await rawCollection.find({}).toArray();
    if (!dataList) return [];

    for (i in dataList) {
        dataList[i]._id = dataList[i]._id.toString();
    }

    return dataList;

};

const getDataById = async (dataId) => {

    id = utils.checkId(dataId, 'data id');

    const rawCollection = await raw();
    const data_res = await rawCollection.findOne({_id: ObjectId(id)});
    if (data_res === null) throw 'No data with that id';

    data_res._id = data_res._id.toString();

    return data_res;

};

const removeData = async (dataId) => {

    id = utils.checkId(userId, 'user id');

    let data_db = await getDataById(id);

    const dataInfoCollection = await dataInfo();
    const deletionInfo = await dataInfoCollection.deleteOne({_id: ObjectId(id)});

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete data with id of ${id}`;
    }
    
    return `${data_db.nane} has been successfully deleted!`;
    
};

module.exports = {
    addData,
    getAllData,
    getDataById,
    removeData
};
