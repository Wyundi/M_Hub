const mongoCollections = require('../config/mongoCollections');
const dataInfo = mongoCollections.dataInfo;
const {ObjectId} = require('mongodb');

const rawData = require('./raw');

const {readImg} = require("../dl/js/readImg");

const path = require("path");
const utils = require("../utils");

const createData = async (data) => {
    /*
    data.name,
    data.type,
    data.description,
    data.features,
    data.length,
    data.source,
    data.file_path,
    data.userId
    */

    // error check

    data_name = utils.checkString(data.name);
    data_type = utils.checkDataType(data.type);
    description = utils.checkString(data.description);
    features = utils.checkStringArray(data.features);
    length = utils.checkInt(data.length);
    source = utils.checkUrl(data.source);
    file_path = utils.checkPath(data.file_path);
    userId = utils.checkId(data.userId, "user id");
    
    // check valid json file

    json_obj = utils.checkJson(file_path);

    // add data info
    // according to mongodb document size limit, we need add another document to store raw data separately instead of store them in one document.

    let raw = {};
    let raw_list = [];
    let mean_list = [];
    let std_list = [];

    if (data_type === 'data') {
        for (let f of features) {
            raw[f] = {};
            raw_list.push([])
    
            for (let i in json_obj[f]) {
                // add to raw obj
                let single_data = await rawData.addData(json_obj[f][i].toString());
                raw[f][i] = single_data._id.toString();
    
                // add to raw list
                if (Number(json_obj[f][i] == json_obj[f][i])) {
                    raw_list[raw_list.length - 1].push(Number(json_obj[f][i]));
                }
                else {
                    raw_list[raw_list.length - 1].push(0);
                }
            }
    
            let values = raw_list[raw_list.length - 1];
            let mean = values.reduce((sum, value) => sum + value, 0) / values.length;
            let std = Math.sqrt(values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length);
    
            mean_list.push(mean);
            std_list.push(std);
        }
    }
    else if (data_type === 'img') {
        for (let f of features) {
            raw[f] = {};
            raw_list.push([])
    
            let l = Object.keys(json_obj[f]).length;
            for (let i in json_obj[f]) {
                // add to raw obj
                let single_data = await rawData.addData(json_obj[f][i].toString());
                raw[f][i] = single_data._id.toString();
    
                // add to raw list
                raw_list[raw_list.length - 1].push(json_obj[f][i]);

                if (f === 'img_path') {
                    // read img
                    let img_path = path.resolve(json_obj[f][i]);
                    let img_info = await readImg(img_path);

                    // // calculate mean and std, add them to the list
                    let values = img_info.img_data.flat(Infinity);
                    let mean = values.reduce((sum, value) => sum + value, 0) / values.length;
                    let std = Math.sqrt(values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length);

                    mean_list.push(mean);
                    std_list.push(std);

                    p = (Number(i)+1).toString().padStart(3, '0');
                    console.log(`Process: [${p} | ${l}]`);
                }
            }
        }
    }

    let newData = {
        data_name: data_name,
        type: data_type,
        description: description,
        features: features,
        mean: mean_list,
        std: std_list,
        length: length,
        source: source,
        file_path: file_path,
        raw_data: raw,
        user_list: [userId],
        comment: []
    }

    const dataInfoCollection = await dataInfo();

    const insertInfo = await dataInfoCollection.insertOne(newData);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
        throw 'Could not add data';

    const newId = insertInfo.insertedId.toString();

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

    dataId = utils.checkId(dataId, 'data id');

    const dataInfoCollection = await dataInfo();
    const data_res = await dataInfoCollection.findOne({_id: ObjectId(dataId)});
    if (data_res === null) throw 'No data with that id';

    data_res._id = data_res._id.toString();

    return data_res;

};

const getDataByName = async (search_data_name) => {

    // error check
    search_data_name = utils.checkString(search_data_name, 'data name');

    // get data
    const data_list = await getAllData();

    let res = [];
    for (d of data_list) {
        if (d.data_name.toLowerCase().includes(search_data_name.toLowerCase())) {
            res.push(d);
        }
    }

    //sort by ID
    res.sort(function(a, b) {return a.id - b.id;});

    //return up to 20 matching results
    return res.slice(0, 20);
};

const getRawData = async (dataId) => {

    // error check
    dataId = utils.checkId(dataId, 'data id');

    // get data
    let data_db = getDataById(dataId);
    let raw_data_path = data_db.file_path;

    return raw_data_path;

};

const removeData = async (dataId) => {

    id = utils.checkId(dataId, 'data id');

    let data_db = await getDataById(id);

    const dataInfoCollection = await dataInfo();
    const deletionInfo = await dataInfoCollection.deleteOne({_id: ObjectId(id)});

    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete data with id of ${id}`;
    }
    
    return `${data_db.name} has been successfully deleted!`;
    
};

const updateData = async (dataId, newData) => {

    // chech dataId
    dataId = utils.checkId(dataId, 'data id');

    // check new data
    let data_name = utils.checkString(newData.name);
    let type = utils.checkDataType(newData.type);
    let description = utils.checkString(newData.description);
    let features = utils.checkStringArray(newData.features);
    let length = utils.checkInt(newData.length);
    let source = utils.checkUrl(newData.source);
    let userId = utils.checkId(newData.userId);

    // add data info

    let data_db = await getDataById(dataId);
    if (!data_db) throw `Could not update data with id ${dataId}!`;

    newData = {
        data_name: data_name,
        type: type,
        description: description,
        features: features,
        length: length,
        source: source,
        raw_data: raw,
        user_list: [userId],
        comment: []
    }

    const dataInfoCollection = await dataInfo();
    const updateInfo = await dataInfoCollection.updateOne(
        {_id: ObjectId(dataId)},
        {$set: newData}
    );

    if (!updateInfo) throw `Could not update data with origin data ${data_db.name}`;

    return `origin data ${data_db.name} has been successfully udpated!`;

};

const addUser = async (dataId, userId) => {
    
    // error check
    dataId = utils.checkId(dataId, "data id");
    userId = utils.checkId(userId, "user id");

    // add user
    let data_db = await getDataById(dataId);
    if (!data_db) throw `Could not find data with id ${dataId}!`;

    // add user to model
    const dataInfoCollection = await dataInfo();
    const updatedInfo = await dataInfoCollection
        .updateOne( {_id: ObjectId(dataId)}, {$push: {user_list: userId}} );

    if (updatedInfo.modifiedCount === 0) {
        throw 'could not add user successfully';
    }

    data_db = await getDataById(dataId);

    data_db._id = data_db._id.toString();

    return data_db;

};

module.exports = {
    createData,
    getAllData,
    getDataById,
    getDataByName,
    getRawData,
    removeData,
    updateData,
    addUser
};